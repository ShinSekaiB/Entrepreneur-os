"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessField } from "@/components/forms/business-field";
import { MARKETING_QUESTIONNAIRE_SYSTEM, MARKETING_QUESTIONNAIRE_PROMPT } from "@/lib/ai/prompts/marketing";

interface MarketingFormProps {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  initialData?: {
    positioning?: string | null;
    audience?: string[] | null;
    brandTone?: string | null;
  };
}

const FIELDS = {
  targetAudience: {
    label: "Qui est votre audience cible ?",
    placeholder: "Âge, profession, centres d'intérêt, localisation, points de friction...",
    subQuestions: [
      "Quel est votre profil client idéal (persona) ?",
      "Quels sont les critères démographiques et psychographiques ?",
      "Quels sont leurs principaux points de friction liés à votre domaine ?",
      "Où trouvent-ils l'information (réseaux, blogs, événements) ?",
    ],
    examples: [
      "Directeurs marketing dans des PME tech (50-200 salariés) en France, 35-50 ans, férus de data mais submergés d'outils. Lisent LinkedIn et la newsletter de la French Tech.",
    ],
  },
  competitors: {
    label: "Qui sont vos concurrents ?",
    placeholder: "Listez vos principaux concurrents directs et indirects...",
    subQuestions: [
      "Qui sont vos concurrents directs (même solution, même marché) ?",
      "Qui sont vos concurrents indirects (solution différente, même besoin) ?",
      "Quelles sont leurs forces et leurs faiblesses principales ?",
      "Quelle est votre part de marché estimée ou visée ?",
    ],
    examples: [
      "Concurrent A : leader avec 40% de part de marché mais UX médiocre et support client lent. Concurrent B : entrant récent, bon produit mais pricing 2x plus élevé que le nôtre.",
    ],
  },
  brandTone: {
    label: "Quel ton de marque souhaitez-vous ?",
    placeholder: "Ex: moderne, expert, décontracté, premium, audacieux...",
    subQuestions: [
      "Quelle personnalité de marque voulez-vous incarner (archétype) ?",
      "Quels adjectifs décrivent le mieux votre marque ?",
      "Quelle émotion voulez-vous susciter chez vos clients ?",
      "Y a-t-il des marques dont vous admirez le ton et le style ?",
    ],
    examples: [
      "Moderne, expert mais accessible, avec un ton direct et sans jargon. Comme Notion mais version B2B — on explique des choses complexes simplement.",
    ],
  },
  marketingObjectives: {
    label: "Quels sont vos objectifs marketing ?",
    placeholder: "Objectifs d'acquisition, budget, canaux envisagés...",
    subQuestions: [
      "Quels sont vos objectifs à 3, 6 et 12 mois (clients, revenus, notoriété) ?",
      "Quel budget marketing prévoyez-vous et sur quelle période ?",
      "Quels canaux comptez-vous utiliser en priorité ?",
      "Avez-vous déjà testé certains canaux avec quels résultats ?",
    ],
    examples: [
      "Acquérir 500 clients en 12 mois avec un budget de 50K€. Canaux prioritaires : LinkedIn Ads (60%), content marketing (25%), partenariats (15%). Test SEO en cours avec 200 visites/mois organiques.",
    ],
  },
};

export function MarketingForm({ projectId, projectName, projectDescription, initialData }: MarketingFormProps) {
  const [form, setForm] = useState({
    targetAudience: initialData?.audience?.join(", ") ?? "",
    competitors: "",
    brandTone: initialData?.brandTone ?? "",
    marketingObjectives: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem(`marketing-form-${projectId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem(`marketing-form-${projectId}`, JSON.stringify(form));
    }, 800);
    return () => clearTimeout(timer);
  }, [form, projectId]);

  const saveForm = () => {
    sessionStorage.setItem(`marketing-form-${projectId}`, JSON.stringify(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.targetAudience) {
      setError("Veuillez décrire votre audience cible");
      return;
    }
    saveForm();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: MARKETING_QUESTIONNAIRE_PROMPT({ projectName, projectDescription: projectDescription ?? undefined, ...form }),
          projectId,
          type: "MARKETING",
          system: MARKETING_QUESTIONNAIRE_SYSTEM,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.details || data.error || "Erreur lors de l'analyse marketing");
        setLoading(false);
        return;
      }

      saveForm();
      sessionStorage.setItem(`marketing-analysis-${projectId}`, data.content);
      router.push(`/projects/${projectId}/analysis?view=marketing`);
    } catch (err) {
      setError("Erreur réseau - vérifiez votre connexion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Questionnaire Marketing</CardTitle>
          <CardDescription>
            Parlez-nous de votre marché et de votre audience.
            Chaque champ doit contenir <strong>50 mots minimum</strong> pour une analyse fiable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">{error}</p>
          )}

          <BusinessField
            id="targetAudience"
            label={FIELDS.targetAudience.label}
            value={form.targetAudience}
            onChange={update("targetAudience")}
            subQuestions={FIELDS.targetAudience.subQuestions}
            examples={FIELDS.targetAudience.examples}
            placeholder={FIELDS.targetAudience.placeholder}
            required
            rows={4}
          />

          <BusinessField
            id="competitors"
            label={FIELDS.competitors.label}
            value={form.competitors}
            onChange={update("competitors")}
            subQuestions={FIELDS.competitors.subQuestions}
            examples={FIELDS.competitors.examples}
            placeholder={FIELDS.competitors.placeholder}
            rows={3}
          />

          <BusinessField
            id="brandTone"
            label={FIELDS.brandTone.label}
            value={form.brandTone}
            onChange={update("brandTone")}
            subQuestions={FIELDS.brandTone.subQuestions}
            examples={FIELDS.brandTone.examples}
            placeholder={FIELDS.brandTone.placeholder}
            rows={3}
          />

          <BusinessField
            id="marketingObjectives"
            label={FIELDS.marketingObjectives.label}
            value={form.marketingObjectives}
            onChange={update("marketingObjectives")}
            subQuestions={FIELDS.marketingObjectives.subQuestions}
            examples={FIELDS.marketingObjectives.examples}
            placeholder={FIELDS.marketingObjectives.placeholder}
            rows={4}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Analyse marketing en cours..." : "Analyser mon marketing"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
