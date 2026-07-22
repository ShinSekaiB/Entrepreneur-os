"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/ui/score-card";

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: {
    title: string;
    description: string;
    priority: string;
    category: string;
  }[];
}

export default function BusinessAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  return <BusinessAnalysisContent projectId={React.use(Promise.resolve(params)).id} />;
}

import React from "react";

function BusinessAnalysisContent({ projectId }: { projectId: string }) {
  const [analysis] = useState<AnalysisResult | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`analysis-${projectId}`);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const router = useRouter();

  useEffect(() => {
    if (!analysis) {
      router.push(`/projects/${projectId}/business`);
    }
  }, [analysis, projectId, router]);

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Chargement de l&apos;analyse...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analyse Business</h1>
          <p className="text-muted-foreground">{analysis.summary}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/business`)}>
          Modifier les réponses
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard label="Score Business" score={analysis.score} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>✅ Forces</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="text-sm">{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>⚠️ Faiblesses</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="text-sm">{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🚀 Opportunités</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {analysis.opportunities.map((o, i) => (
                <li key={i} className="text-sm">{o}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recommandations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{rec.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  rec.priority === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                  rec.priority === "HIGH" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                }`}>{rec.priority}</span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
