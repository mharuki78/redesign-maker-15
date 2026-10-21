# 중요한 결정

## D-001 · 2026-10-21 · 사용자 확정

리디자인 마법사의 수정은 매번 `mharuki78/redesign-maker-15`에 업데이트한다. 근거: 사용자의 저장소 지정. 배곧 브랜드를 유지한다.

## D-002 · 2026-10-21 · 구현 선택

공식 문서를 확인해 OpenAI `gpt-image-2.5-sunburst`, Google `gemini-nano-banana-2.1`을 적용한다. 생성과 편집이 공통 어댑터를 사용한다. 기존 provider 값과 브라우저 API 키 저장 방식을 유지하며 Google Interactions 요청은 `store: false`로 보낸다. 기존 OpenAI low 품질을 유지한다.

근거: [OpenAI Images API](https://developers.openai.com/api/reference/resources/images/methods/edit), [Google 이미지 생성](https://ai.google.dev/gemini-api/docs/image-generation), [Google Interactions API](https://ai.google.dev/api/interactions-api).
