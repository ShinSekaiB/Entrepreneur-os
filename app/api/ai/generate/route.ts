import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { requireAuth } from "@/server/permissions";
import { logAICost, calculateCost, checkQuota } from "@/lib/ai/monitor";
import { withRetry, withTimeout } from "@/lib/ai/errors";
import { withCache, getCacheKey } from "@/lib/ai/cache";
import { buildContext } from "@/lib/ai/memory";
import { prisma } from "@/lib/db";

function extractJSON(text: string): string {
  const cleaned = text.trim();
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const brace = cleaned.match(/\{[\s\S]*\}/);
  if (brace) return brace[0];
  return cleaned;
}

const SCORE_FIELDS = new Set(["score", "problemScore", "solutionScore", "marketScore", "strategyScore", "positioningScore", "acquisitionScore", "brandScore", "contentScore", "feasibilityScore", "financialScore", "operationalScore", "riskScore", "businessScore", "marketingScore", "realisationScore", "weightedScore"]);

function clampScores(obj: Record<string, unknown>, depth = 0): Record<string, unknown> {
  if (depth > 10) return obj;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (SCORE_FIELDS.has(key)) {
      if (typeof val === "number") {
        obj[key] = Math.max(0, Math.min(100, Math.round(val)));
      } else if (typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val)) {
        obj[key] = Math.max(0, Math.min(100, Math.round(parseFloat(val))));
      }
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      obj[key] = clampScores(val as Record<string, unknown>, depth + 1);
    }
  }
  return obj;
}

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "IA non configurée", details: "Ajoutez une clé API Groq gratuite (DEEPSEEK_API_KEY) depuis https://console.groq.com/keys" },
        { status: 503 }
      );
    }

    const userId = await requireAuth();
    const { prompt, projectId, system, type } = await request.json();

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

    result.content = extractJSON(result.content);

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

    if (projectId && type) {
      try {
        const parsed = JSON.parse(result.content);
        clampScores(parsed);
        parsed._scoreVersion = "v2-brutal-truth";
        result.content = JSON.stringify(parsed);
        const analysisType = (type === "MARKETING" ? "MARKETING" : type === "REALISATION" ? "REALISATION" : type === "FINAL" ? "FINAL" : "BUSINESS") as "BUSINESS" | "MARKETING" | "REALISATION" | "FINAL";
        const existing = await prisma.analysis.findFirst({ where: { projectId, type: analysisType } });
        if (existing) {
          await prisma.analysis.update({
            where: { id: existing.id },
            data: { content: parsed, score: parsed.score ?? null },
          });
          await prisma.recommendation.deleteMany({ where: { analysisId: existing.id } });
          if (parsed.recommendations?.length) {
            await prisma.recommendation.createMany({
              data: parsed.recommendations.map((r: Record<string, string>) => ({
                analysisId: existing.id,
                projectId,
                title: r.title ?? "",
                description: r.description ?? null,
                priority: r.priority ?? "MEDIUM",
                category: r.category ?? null,
              })),
            });
          }
        } else {
          await prisma.analysis.create({
            data: {
              projectId,
              type: analysisType,
              content: parsed,
              score: parsed.score ?? null,
              recommendations: {
                create: (parsed.recommendations ?? []).map((r: Record<string, string>) => ({
                  projectId,
                  title: r.title ?? "",
                  description: r.description ?? null,
                  priority: r.priority ?? "MEDIUM",
                  category: r.category ?? null,
                })),
              },
            },
          });
        }
      } catch {
        // Analysis save non-blocking
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération IA", details: error instanceof Error ? error.message : undefined },
      { status: 502 }
    );
  }
}
