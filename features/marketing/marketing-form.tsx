"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MarketingFormProps {
  projectId: string;
  projectName: string;
    initialData?: {
    positioning?: string | null;
    audience?: string[] | null;
    brandTone?: string | null;
  };
}

export function MarketingForm({ projectId, projectName, initialData }: MarketingFormProps) {
  const [form, setForm] = useState({
    targetAudience: initialData?.audience?.join(", ") ?? "",
    competitors: "",
    brandTone: initialData?.brandTone ?? "",
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
          prompt: `Analyse marketing pour :\n\nNom: ${projectName}\nAudience cible: ${form.targetAudience}\nConcurrents: ${form.competitors}\nTon de marque: ${form.brandTone}`,
          projectId,
          system: "Tu es un expert marketing. Réponds en JSON avec score, positionnement, persona, recommandations.",
        }),
      });

      const data = await res.json();
      sessionStorage.setItem(`marketing-analysis-${projectId}`, JSON.stringify(data.content));
      router.push(`/projects/${projectId}/marketing/analysis`);
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
          <CardTitle>Questionnaire Marketing</CardTitle>
          <CardDescription>
            Parlez-nous de votre marché et de votre audience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Qui est votre audience cible ?</Label>
            <Textarea id="targetAudience" value={form.targetAudience} onChange={update("targetAudience")} rows={3} placeholder="Âge, profession, centres d'intérêt, localisation..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitors">Qui sont vos concurrents ?</Label>
            <Textarea id="competitors" value={form.competitors} onChange={update("competitors")} rows={2} placeholder="Listez vos principaux concurrents..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandTone">Quel ton de marque souhaitez-vous ?</Label>
            <Input id="brandTone" value={form.brandTone} onChange={update("brandTone")} placeholder="Ex: moderne, expert, décontracté, premium..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Analyse en cours..." : "Analyser mon marketing"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
