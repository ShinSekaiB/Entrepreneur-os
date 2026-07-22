export const AI_CONFIG = {
  provider: "openai" as const,
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 4096,
  timeoutMs: 30000,
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 8000,
  },
  cache: {
    ttlMs: 3600000,
    maxSize: 100,
  },
  memory: {
    maxMessages: 50,
    maxTokens: 3000,
    summaryModel: "gpt-4o-mini",
  },
  quotas: {
    FREE: { requestsPerDay: 10, tokensPerMonth: 100000 },
    PRO: { requestsPerDay: 50, tokensPerMonth: 1000000 },
    BUSINESS: { requestsPerDay: 200, tokensPerMonth: 5000000 },
    EXPERT: { requestsPerDay: 500, tokensPerMonth: 15000000 },
  },
  costs: {
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
  },
};

export type AISettings = typeof AI_CONFIG;
