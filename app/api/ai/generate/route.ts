import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { requireAuth } from "@/server/permissions";
import { logAICost, calculateCost, checkQuota } from "@/lib/ai/monitor";
import { withRetry, withTimeout } from "@/lib/ai/errors";
import { withCache, getCacheKey } from "@/lib/ai/cache";
import { buildContext } from "@/lib/ai/memory";

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "IA non configurée", details: "Ajoutez une clé DEEPSEEK_API_KEY (gratuite sur https://platform.deepseek.com) dans les variables d'environnement." },
        { status: 503 }
      );
    }

    const userId = await requireAuth();
    const { prompt, projectId, system } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const hasQuota = await checkQuota(userId);
    if (!hasQuota) {
      return NextResponse.json({ error: "Quota IA dépassé" }, { status: 429 });
    }

    let context = "";
    if (projectId) {
      context = await buildContext(projectId);
    }

    const fullPrompt = context ? `Contexte du projet:\n${context}\n\n${prompt}` : prompt;
    const provider = getAIProvider();

    const cacheKey = getCacheKey(fullPrompt, system);
    const result = await withCache(cacheKey, async () => {
      return withRetry(() =>
        withTimeout(
          provider.generate(fullPrompt, { system }),
          provider.getModel().includes("mini") ? 45000 : 30000
        )
      );
    });

    const cost = calculateCost(result.model, result.usage.promptTokens, result.usage.completionTokens);

    await logAICost({
      userId,
      projectId,
      model: result.model,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      cost,
      duration: result.duration,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération IA", details: error instanceof Error ? error.message : undefined },
      { status: 502 }
    );
  }
}
