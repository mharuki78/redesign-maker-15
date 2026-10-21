const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test, mock, afterEach } = require('node:test');
const ts = require('typescript');

// Exercise the real route handlers without starting Next or calling a paid API.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolveFilename.call(this, request.startsWith('@/') ? path.join(__dirname, '../src', request.slice(2)) : request, ...args);
};
const { POST: edit } = require('../src/app/api/edit-section/route.ts');
const { POST: generate } = require('../src/app/api/generate/route.ts');
const pixels = Buffer.from('test-image-bytes');
const base64 = pixels.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;
const modelIds = { openai: 'gpt-image-2.5-sunburst', google: 'gemini-nano-banana-2.1' };
afterEach(() => mock.restoreAll());

function editRequest(provider) {
  return new Request('http://localhost/redesign/15/api/edit-section', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: provider, imageUrl: dataUrl, request: '중국어를 자연스러운 한국어로 바꿔줘', openaiKey: 'test-openai', googleKey: 'test-google' }),
  });
}
function generationRequest(provider, withBlueprint = true) {
  const form = new FormData();
  form.append('files', new File([pixels], 'source.png', { type: 'image/png' }));
  form.append('productFiles', new File([Buffer.from('product')], 'product.png', { type: 'image/png' }));
  form.append('model', provider);
  form.append('count', '1');
  form.append('openaiKey', 'test-openai');
  form.append('googleKey', 'test-google');
  if (withBlueprint) form.append('blueprint', JSON.stringify({ title: '테스트 제품', sections: [{ headline: '테스트 제품', subheadline: '제품 소개', bullets: [] }] }));
  return new Request('http://localhost/redesign/15/api/generate', { method: 'POST', body: form });
}
function providerMock(provider, check) {
  return mock.method(globalThis, 'fetch', async (url, init) => {
    if (provider === 'openai') {
      assert.equal(url, 'https://api.openai.com/v1/images/edits');
      assert.equal(init.headers.Authorization, 'Bearer test-openai');
      assert.equal(init.body.get('model'), modelIds.openai);
      assert.equal(init.body.get('size'), '1152x2048');
      assert.equal(init.body.get('quality'), 'low');
      assert.equal(init.body.get('output_format'), 'png');
      await check(init.body);
      return Response.json({ data: [{ b64_json: base64 }] });
    }
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(init.headers['x-goog-api-key'], 'test-google');
    const body = JSON.parse(init.body);
    assert.equal(body.model, modelIds.google);
    assert.equal(body.store, false);
    assert.deepEqual(body.response_format, { type: 'image', mime_type: 'image/png', aspect_ratio: '9:16', image_size: '1K' });
    await check(body);
    return Response.json({ status: 'completed', steps: [
      { type: 'user_input', content: [{ type: 'image', mime_type: 'image/jpeg', data: 'ignore-user-input' }] },
      { type: 'model_output', content: [{ type: 'text', text: '완료' }, { type: 'image', mime_type: 'image/png', data: base64 }] },
    ] });
  });
}

for (const provider of ['openai', 'google']) {
  test(`${provider}: section editing sends the latest model, original image and user instruction`, async () => {
    const fetch = providerMock(provider, async body => {
      const prompt = provider === 'openai' ? body.get('prompt') : body.input[0].text;
      assert.match(prompt, /중국어를 자연스러운 한국어로 바꿔줘/);
      if (provider === 'openai') {
        const images = body.getAll('image[]');
        assert.equal(images.length, 1);
        assert.deepEqual(Buffer.from(await images[0].arrayBuffer()), pixels);
      } else {
        assert.deepEqual(body.input[1], { type: 'image', mime_type: 'image/png', data: base64 });
      }
    });
    const response = await edit(editRequest(provider));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).imageUrl, dataUrl);
    assert.equal(fetch.mock.callCount(), 1);
  });

  test(`${provider}: initial generation uses the same model and preserves product-first references`, async () => {
    const fetch = providerMock(provider, async body => {
      const images = provider === 'openai' ? body.getAll('image[]') : body.input.filter(part => part.type === 'image');
      assert.equal(images.length, 2);
      const first = provider === 'openai' ? Buffer.from(await images[0].arrayBuffer()).toString() : Buffer.from(images[0].data, 'base64').toString();
      assert.equal(first, 'product');
    });
    const response = await generate(generationRequest(provider));
    assert.equal(response.status, 200);
    const { project } = await response.json();
    assert.equal(project.modelId, modelIds[provider]);
    assert.equal(project.sections[0].imageUrl, dataUrl);
    assert.equal(fetch.mock.callCount(), 1);
  });

  test(`${provider}: a new job analyzes its source before generating an image`, async () => {
    const imageFetch = providerMock(provider, async () => {});
    let analyzed = 0;
    const analysis = JSON.stringify({ title: '테스트 제품', sections: [{ headline: '테스트 제품', subheadline: '제품 소개', bullets: [] }] });
    mock.method(globalThis, 'fetch', async (url, init) => {
      const body = typeof init.body === 'string' ? JSON.parse(init.body) : null;
      if (url === 'https://api.openai.com/v1/responses') {
        analyzed++;
        assert.equal(init.headers.Authorization, 'Bearer test-openai');
        return Response.json({ output_text: analysis });
      }
      if (provider === 'google' && body?.response_format?.type === 'text') {
        analyzed++;
        assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
        assert.equal(body.model, modelIds.google);
        assert.equal(body.store, false);
        assert.equal(body.response_format.mime_type, 'application/json');
        assert.equal(body.input.filter(part => part.type === 'image').length, 2);
        return Response.json({ status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text: analysis }] }] });
      }
      return imageFetch(url, init);
    });
    const response = await generate(generationRequest(provider, false));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).project.sections[0].imageUrl, dataUrl);
    assert.equal(analyzed, 1);
    assert.equal(imageFetch.mock.callCount(), 1);
  });
}

test('Google: a text-only reply fails instead of treating an input image as generated output', async () => {
  mock.method(globalThis, 'fetch', async () => Response.json({ status: 'completed', steps: [
    { type: 'user_input', content: [{ type: 'image', mime_type: 'image/png', data: base64 }] },
    { type: 'model_output', content: [{ type: 'text', text: '이미지를 만들 수 없습니다.' }] },
  ] }));
  const response = await edit(editRequest('google'));
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /이미지 데이터가 없습니다/);
});

test('non-JSON provider errors retain the request id and do not trigger a second paid request', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => new Response('Service unavailable', { status: 503, headers: { 'x-request-id': 'req-test' } }));
  const response = await edit(editRequest('openai'));
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /Service unavailable.*req-test/);
  assert.equal(fetch.mock.callCount(), 1);
});
