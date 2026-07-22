"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/ui/score-card";
import React from "react";

interface MarketingAnalysis {
  score: number;
  positioning: string;
  summary: string;
  persona: {
    name: string;
    age: string;
    profession: string;
    painPoints: string[];
    goals: string[];
    channels: string[];
  };
  recommendations: {
    title: string;
    description: string;
    priority: string;
    category: string;
  }[];
}

export default function MarketingAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  return <MarketingAnalysisContent projectId={React.use(Promise.resolve(params)).id} />;
}

function MarketingAnalysisContent({ projectId }: { projectId: string }) {
  const [analysis, setAnalysis] = useState<MarketingAnalysis | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem(`marketing-analysis-${projectId}`);
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
      } catch {
        router.push(`/projects/${projectId}/marketing`);
      }
    } else {
      router.push(`/projects/${projectId}/marketing`);
    }
  }, [projectId, router]);

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
          <h1 className="text-3xl font-bold">Analyse Marketing</h1>
          <p className="text-muted-foreground">{analysis.summary}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/marketing`)}>
          Modifier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ScoreCard label="Score Marketing" score={analysis.score} />
      </div>

      <Card>
        <CardHeader><CardTitle>Positionnement</CardTitle></CardHeader>
        <CardContent><p>{analysis.positioning}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Persona client</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><strong>{analysis.persona.name}</strong> · {analysis.persona.age} ans · {analysis.persona.profession}</p>
          <div>
            <p className="font-medium text-sm mt-2">Points de douleur :</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {analysis.persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm mt-2">Objectifs :</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {analysis.persona.goals.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm mt-2">Canaux recommandés :</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.persona.channels.map((c, i) => (
                <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{c}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recommandations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{rec.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  rec.priority === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
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
