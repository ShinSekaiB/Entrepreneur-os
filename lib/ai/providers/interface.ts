export interface AIProvider {
  generate(prompt: string, options?: AIProviderOptions): Promise<AIResponse>;
  generateStream(prompt: string, options?: AIProviderOptions): AsyncIterable<string>;
  countTokens(text: string): Promise<number>;
  getModel(): string;
}

export interface AIProviderOptions {
  temperature?: number;
  maxTokens?: number;
  system?: string;
  userId?: string;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  duration: number;
}
