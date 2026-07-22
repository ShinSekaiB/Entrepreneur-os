import { OpenAIProvider } from "./providers/openai";
import type { AIProvider } from "./providers/interface";

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = new OpenAIProvider();
  }
  return provider;
}

export { OpenAIProvider } from "./providers/openai";
export type { AIProvider, AIProviderOptions, AIResponse } from "./providers/interface";
