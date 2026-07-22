import OpenAI from "openai";
import { AI_CONFIG } from "../config";
import type { AIProvider, AIProviderOptions, AIResponse } from "./interface";

const MISSING_KEY_ERROR = "La clé API n'est pas configurée (DEEPSEEK_API_KEY). Obtenez une clé gratuite sur https://console.groq.com/keys";

function getClient(): OpenAI {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error(MISSING_KEY_ERROR);
  }
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export class DeepSeekProvider implements AIProvider {
  getModel(): string {
    return AI_CONFIG.model;
  }

  async generate(prompt: string, options?: AIProviderOptions): Promise<AIResponse> {
    const client = getClient();
    const start = Date.now();

    const completion = await client.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: options?.temperature ?? AI_CONFIG.temperature,
      max_tokens: options?.maxTokens ?? AI_CONFIG.maxTokens,
      messages: [
        ...(options?.system ? [{ role: "system" as const, content: options.system }] : []),
        { role: "user" as const, content: prompt },
      ],
    });

    const choice = completion.choices[0];
    const usage = completion.usage;

    return {
      content: choice?.message?.content ?? "",
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      model: AI_CONFIG.model,
      duration: Date.now() - start,
    };
  }

  async *generateStream(prompt: string, options?: AIProviderOptions): AsyncIterable<string> {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: options?.temperature ?? AI_CONFIG.temperature,
      max_tokens: options?.maxTokens ?? AI_CONFIG.maxTokens,
      messages: [
        ...(options?.system ? [{ role: "system" as const, content: options.system }] : []),
        { role: "user" as const, content: prompt },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
