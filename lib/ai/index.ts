import { DeepSeekProvider } from "./providers/deepseek";
import type { AIProvider } from "./providers/interface";

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = new DeepSeekProvider();
  }
  return provider;
}

export { DeepSeekProvider } from "./providers/deepseek";
export type { AIProvider, AIProviderOptions, AIResponse } from "./providers/interface";
