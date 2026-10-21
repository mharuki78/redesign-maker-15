import { imageModels } from "./image-models";

type ReferenceImage = { name: string; mimeType: string; buffer: Buffer };
type ImageRequest = { apiKey: string; prompt: string; references: ReferenceImage[] };

export async function generateOpenAIImage({ apiKey, prompt, references }: ImageRequest) {
  const form = new FormData();
  form.append("model", imageModels.openai.id);
  form.append("prompt", prompt);
  form.append("size", "1152x2048");
  form.append("quality", "low");
  form.append("output_format", "png");
  for (const reference of references.slice(0, 4)) {
    form.append("image[]", new Blob([new Uint8Array(reference.buffer)], { type: reference.mimeType }), reference.name);
  }
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  const data = await readJsonResponse(response);
  if (!response.ok) throw new Error(withRequestId(data?.error?.message || `${imageModels.openai.label} 생성 실패`, response));
  const imageBase64 = data?.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error("OpenAI 응답에 이미지 데이터가 없습니다.");
  return { mimeType: "image/png", buffer: Buffer.from(imageBase64, "base64") };
}

export async function generateGoogleImage({ apiKey, prompt, references }: ImageRequest) {
  // Nano Banana 2.1 uses Interactions. Each request includes its own references;
  // server-side conversation storage is unnecessary for browser-owned projects.
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: imageModels.google.id,
      store: false,
      input: [
        { type: "text", text: prompt },
        ...references.slice(0, 4).map(reference => ({
          type: "image", mime_type: reference.mimeType, data: reference.buffer.toString("base64")
        }))
      ],
      response_format: { type: "image", mime_type: "image/png", aspect_ratio: "9:16", image_size: "1K" }
    })
  });
  const data = await readJsonResponse(response);
  if (!response.ok) throw new Error(withRequestId(data?.error?.message || `${imageModels.google.label} 생성 실패`, response));
  // output_image is an SDK convenience property, not a REST response field.
  const steps: Array<{ type?: string; content?: Array<{ type?: string; mime_type?: string; data?: string }> }> = data?.steps || [];
  const images = steps.filter(step => step.type === "model_output")
    .flatMap(step => step.content || [])
    .filter(content => content.type === "image" && content.data && content.mime_type?.startsWith("image/"));
  const image = images.at(-1);
  if (!image?.data) throw new Error("Google 응답에 이미지 데이터가 없습니다.");
  return { mimeType: image.mime_type!, buffer: Buffer.from(image.data, "base64") };
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try { return JSON.parse(text); }
  catch { return { error: { message: text || response.statusText } }; }
}

function withRequestId(message: string, response: Response) {
  const requestId = response.headers.get("x-request-id");
  return requestId ? `${message} (request_id: ${requestId})` : message;
}
