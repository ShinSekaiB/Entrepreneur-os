"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessFormProps {
  projectId: string;
  initialData?: {
    problem?: string | null;
    solution?: string | null;
    targetCustomer?: string | null;
    valueProposition?: string | null;
    businessModel?: string | null;
  };
}

export function BusinessForm({ projectId, initialData }: BusinessFormProps) {
  const [form, setForm] = useState({
    problem: initialData?.problem ?? "",
    solution: initialData?.solution ?? "",
    targetCustomer: initialData?.targetCustomer ?? "",
    valueProposition: initialData?.valueProposition ?? "",
    businessModel: initialData?.businessModel ?? "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyse ce projet entrepreneurial :\n\nProblème : ${form.problem}\nSolution : ${form.solution}\nCible : ${form.targetCustomer}\nProposition valeur : ${form.valueProposition}\nModèle : ${form.businessModel}`,
          projectId,
          system: "Tu es un expert business. Réponds en JSON avec score, forces, faiblesses, recommandations.",
        }),
      });

      const data = await res.json();
      sessionStorage.setItem(`analysis-${projectId}`, JSON.stringify(data.content));
      router.push(`/projects/${projectId}/business/analysis`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Questionnaire Business</CardTitle>
          <CardDescription>
            Répondez à ces questions pour que l&apos;IA analyse votre modèle d&apos;affaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="problem">Quel problème résolvez-vous ?</Label>
            <Textarea id="problem" value={form.problem} onChange={update("problem")} rows={3} placeholder="Décrivez le problème que vous adressez..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="solution">Quelle est votre solution ?</Label>
            <Textarea id="solution" value={form.solution} onChange={update("solution")} rows={3} placeholder="Comment résolvez-vous ce problème ?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCustomer">Qui est votre client cible ?</Label>
            <Textarea id="targetCustomer" value={form.targetCustomer} onChange={update("targetCustomer")} rows={2} placeholder="Décrivez votre client idéal..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueProposition">Quelle est votre proposition de valeur unique ?</Label>
            <Textarea id="valueProposition" value={form.valueProposition} onChange={update("valueProposition")} rows={2} placeholder="Pourquoi les clients vous choisiraient ?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessModel">Quel est votre modèle économique ?</Label>
            <Textarea id="businessModel" value={form.businessModel} onChange={update("businessModel")} rows={3} placeholder="Comment gagnez-vous de l'argent ?" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Analyse en cours..." : "Analyser mon projet"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
