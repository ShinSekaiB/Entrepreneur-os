export const AI_CONFIG = {
  provider: "deepseek" as const,
  model: "deepseek-chat",
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
    summaryModel: "deepseek-chat",
  },
  quotas: {
    FREE: { requestsPerDay: 10, tokensPerMonth: 100000 },
    PRO: { requestsPerDay: 50, tokensPerMonth: 1000000 },
    BUSINESS: { requestsPerDay: 200, tokensPerMonth: 5000000 },
    EXPERT: { requestsPerDay: 500, tokensPerMonth: 15000000 },
  },
  costs: {
    "deepseek-chat": { input: 0, output: 0 },
  },
};

export type AISettings = typeof AI_CONFIG;
