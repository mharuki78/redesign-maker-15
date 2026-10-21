/** Shared by the model picker and both image routes. Verified against provider docs on 2026-10-21. */
export const imageModels = {
  openai: { label: "OpenAI Image 2.5", id: "gpt-image-2.5-sunburst" },
  google: { label: "Google Nano Banana 2.1", id: "gemini-nano-banana-2.1" }
} as const;

// Keep provider values stable so saved jobs and browser API keys remain compatible.
export type ImageProvider = keyof typeof imageModels;

export function imageModelMeta(provider: ImageProvider) {
  return { provider, ...imageModels[provider] };
}
