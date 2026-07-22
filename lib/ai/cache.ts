import { AI_CONFIG } from "./config";

interface CacheEntry {
  result: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export function getCacheKey(prompt: string, system?: string): string {
  return `${system ?? ""}|${prompt}`;
}

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = AI_CONFIG.cache.ttlMs
): Promise<T> {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.result as T;
  }

  const result = await fn();
  cache.set(key, { result, timestamp: Date.now() });

  if (cache.size > AI_CONFIG.cache.maxSize) {
    const oldest = Array.from(cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0];
    if (oldest) cache.delete(oldest[0]);
  }

  return result;
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}
