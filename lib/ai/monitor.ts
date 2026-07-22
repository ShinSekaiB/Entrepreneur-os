import { AI_CONFIG } from "./config";
import { prisma } from "@/lib/db";

export async function logAICost(params: {
  userId: string;
  projectId?: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  duration: number;
}) {
  await prisma.aICostLog.create({ data: params });
}

export function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = AI_CONFIG.costs[model as keyof typeof AI_CONFIG.costs];
  if (!pricing) return 0;

  const inputCost = (promptTokens / 1000) * pricing.input;
  const outputCost = (completionTokens / 1000) * pricing.output;
  return parseFloat((inputCost + outputCost).toFixed(6));
}

export async function getUserQuota(userId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  const plan = (subscription?.plan ?? "FREE") as keyof typeof AI_CONFIG.quotas;
  return AI_CONFIG.quotas[plan];
}

export async function checkQuota(userId: string): Promise<boolean> {
  const quota = await getUserQuota(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const requestsToday = await prisma.aICostLog.count({
    where: { userId, createdAt: { gte: today } },
  });

  if (requestsToday >= quota.requestsPerDay) return false;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const tokensThisMonth = await prisma.aICostLog.aggregate({
    where: { userId, createdAt: { gte: monthStart } },
    _sum: { totalTokens: true },
  });

  return (tokensThisMonth._sum.totalTokens ?? 0) < quota.tokensPerMonth;
}
