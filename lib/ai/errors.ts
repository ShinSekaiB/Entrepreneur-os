import { AI_CONFIG } from "./config";
import { delay } from "@/lib/utils";

export class AIRetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public originalError: unknown
  ) {
    super(message);
    this.name = "AIRetryError";
  }
}

export class AITimeoutError extends Error {
  constructor(public timeoutMs: number) {
    super(`IA timeout après ${timeoutMs}ms`);
    this.name = "AITimeoutError";
  }
}

export class AIRateLimitError extends Error {
  constructor(public retryAfterMs: number = 60000) {
    super("Limite de débit IA atteinte");
    this.name = "AIRateLimitError";
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { maxAttempts?: number; baseDelayMs?: number; maxDelayMs?: number }
): Promise<T> {
  const config = { ...AI_CONFIG.retry, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (
        error instanceof AITimeoutError ||
        error instanceof AIRateLimitError ||
        (error instanceof Error && error.message.includes("rate limit"))
      ) {
        const backoff = Math.min(
          config.baseDelayMs * Math.pow(2, attempt - 1),
          config.maxDelayMs
        );
        await delay(backoff);
        continue;
      }

      if (attempt === config.maxAttempts) break;
      await delay(config.baseDelayMs);
    }
  }

  throw new AIRetryError(
    `Échec après ${config.maxAttempts} tentatives`,
    config.maxAttempts,
    lastError
  );
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = AI_CONFIG.timeoutMs): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new AITimeoutError(timeoutMs)), timeoutMs)
    ),
  ]);
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIRetryError) return false;
  if (error instanceof AITimeoutError) return true;
  if (error instanceof AIRateLimitError) return true;
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("rate limit") ||
      msg.includes("timeout") ||
      msg.includes("server error") ||
      msg.includes("503") ||
      msg.includes("429")
    );
  }
  return false;
}
