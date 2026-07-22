export const AI_CONFIG = {
  provider: "groq" as const,
  model: "llama-3.3-70b-versatile",
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
    summaryModel: "llama-3.3-70b-versatile",
  },
  quotas: {
    FREE: { requestsPerDay: 100, tokensPerMonth: 500000 },
    PRO: { requestsPerDay: 1000, tokensPerMonth: 5000000 },
    BUSINESS: { requestsPerDay: 5000, tokensPerMonth: 25000000 },
    EXPERT: { requestsPerDay: 10000, tokensPerMonth: 100000000 },
  },
  costs: {
    "llama-3.3-70b-versatile": { input: 0, output: 0 },
  },
};

export type AISettings = typeof AI_CONFIG;
