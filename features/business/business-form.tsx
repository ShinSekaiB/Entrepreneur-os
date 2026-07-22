"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessField } from "@/components/forms/business-field";
import { BUSINESS_QUESTIONNAIRE_SYSTEM, BUSINESS_QUESTIONNAIRE_PROMPT } from "@/lib/ai/prompts/business";

interface BusinessFormProps {
  projectId: string;
  projectSector?: string | null;
  initialData?: {
    problem?: string | null;
    solution?: string | null;
    targetCustomer?: string | null;
    valueProposition?: string | null;
    businessModel?: string | null;
  };
}

const FIELDS = {
  problem: {
    label: "Quel problème résolvez-vous ?",
    placeholder: "Décrivez le problème précis que vous adressez...",
    subQuestions: [
      "Quel est le problème exact que vous résolvez ?",
      "Depuis combien de temps existe-t-il ?",
      "Qui le vit et à quelle fréquence ?",
      "Quelle est l'intensité de la douleur (coût, temps, frustration) ?",
      "Pourquoi les solutions actuelles sont-elles insuffisantes ?",
    ],
    examples: [
      "Les restaurateurs indépendants passent en moyenne 8h/semaine à gérer leurs stocks manuellement, ce qui cause 15% de pertes et des ruptures fréquentes.",
    ],
  },
  solution: {
    label: "Quelle est votre solution ?",
    placeholder: "Comment résolvez-vous ce problème ?",
    subQuestions: [
      "Comment votre solution résout-elle le problème ?",
      "Quel est votre avantage technique ou fonctionnel unique ?",
      "En quoi êtes-vous différent des alternatives existantes ?",
      "Quel est le statut de développement (idée, MVP, beta, lancé) ?",
    ],
    examples: [
      "Une plateforme SaaS avec IA qui scanne les factures fournisseurs, prédit la demande par saison et génère automatiquement les commandes. Le tout en 10 min/semaine contre 8h en manuel.",
    ],
  },
  targetCustomer: {
    label: "Qui est votre client cible ?",
    placeholder: "Décrivez votre client idéal...",
    subQuestions: [
      "Quel segment exact ciblez-vous (taille d'entreprise, secteur, localisation) ?",
      "Quelle est la taille de ce segment (nombre de clients potentiels) ?",
      "Combien sont-ils prêts à payer pour votre solution ?",
      "Qui prend la décision d'achat et quel est le cycle de vente ?",
    ],
    examples: [
      "Restaurants indépendants (10-50 couverts) en France métropolitaine, environ 25 000 établissements. Décision par le gérant-propriétaire, cycle de vente de 2 à 4 semaines.",
    ],
  },
  valueProposition: {
    label: "Quelle est votre proposition de valeur unique ?",
    placeholder: "Pourquoi les clients vous choisiraient ?",
    subQuestions: [
      "Qu'est-ce qui vous rend unique par rapport aux alternatives ?",
      "Pourquoi les clients vous choisiraient plutôt que le statu quo ?",
      "Quel est votre avantage concurrentiel durable ?",
      "Quel est le bénéfice client le plus important (temps, argent, qualité) ?",
    ],
    examples: [
      "Notre IA prédit la demande avec 95% de précision contre 70% pour les concurrents, et notre intégration avec les ERP existants est 3x plus rapide. ROI garanti sous 3 mois.",
    ],
  },
  businessModel: {
    label: "Quel est votre modèle économique ?",
    placeholder: "Comment gagnez-vous de l'argent ?",
    subQuestions: [
      "Comment gagnez-vous de l'argent (abonnement, transaction, freemium, etc.) ?",
      "Quels sont vos flux de revenus (récurrents, ponctuels, services) ?",
      "Quelle est votre structure de coûts (fixes, variables) ?",
      "Quels sont vos canaux de vente (direct, partenaires, self-serve) ?",
    ],
    examples: [
      "SaaS par abonnement : Starter 49€/mois (10 utilisateurs), Pro 149€/mois (illimité). CAC estimé à 800€ via LinkedIn Ads, ARPU de 89€/mois avec un churn visé < 3%/mois.",
    ],
  },
};

export function BusinessForm({ projectId, projectSector, initialData }: BusinessFormProps) {
  const [form, setForm] = useState({
    problem: initialData?.problem ?? "",
    solution: initialData?.solution ?? "",
    targetCustomer: initialData?.targetCustomer ?? "",
    valueProposition: initialData?.valueProposition ?? "",
    businessModel: initialData?.businessModel ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem(`business-form-${projectId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem(`business-form-${projectId}`, JSON.stringify(form));
    }, 800);
    return () => clearTimeout(timer);
  }, [form, projectId]);

  const saveForm = () => {
    sessionStorage.setItem(`business-form-${projectId}`, JSON.stringify(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problem || !form.solution) {
      setError("Veuillez remplir au moins le problème et la solution");
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
          prompt: BUSINESS_QUESTIONNAIRE_PROMPT({ ...form, sector: projectSector ?? undefined }),
          projectId,
          type: "BUSINESS",
          system: BUSINESS_QUESTIONNAIRE_SYSTEM,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.details || data.error || "Erreur lors de l'analyse");
        setLoading(false);
        return;
      }

      saveForm();
      sessionStorage.setItem(`analysis-${projectId}`, data.content);
      router.push(`/projects/${projectId}/analysis?view=business`);
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
          <CardTitle>Questionnaire Business</CardTitle>
          <CardDescription>
            Répondez à ces questions pour que l&apos;IA analyse votre modèle d&apos;affaires.
            Chaque champ doit contenir <strong>50 mots minimum</strong> pour une analyse fiable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">{error}</p>
          )}

          <BusinessField
            id="problem"
            label={FIELDS.problem.label}
            value={form.problem}
            onChange={update("problem")}
            subQuestions={FIELDS.problem.subQuestions}
            examples={FIELDS.problem.examples}
            placeholder={FIELDS.problem.placeholder}
            required
            rows={4}
          />

          <BusinessField
            id="solution"
            label={FIELDS.solution.label}
            value={form.solution}
            onChange={update("solution")}
            subQuestions={FIELDS.solution.subQuestions}
            examples={FIELDS.solution.examples}
            placeholder={FIELDS.solution.placeholder}
            required
            rows={4}
          />

          <BusinessField
            id="targetCustomer"
            label={FIELDS.targetCustomer.label}
            value={form.targetCustomer}
            onChange={update("targetCustomer")}
            subQuestions={FIELDS.targetCustomer.subQuestions}
            examples={FIELDS.targetCustomer.examples}
            placeholder={FIELDS.targetCustomer.placeholder}
            rows={3}
          />

          <BusinessField
            id="valueProposition"
            label={FIELDS.valueProposition.label}
            value={form.valueProposition}
            onChange={update("valueProposition")}
            subQuestions={FIELDS.valueProposition.subQuestions}
            examples={FIELDS.valueProposition.examples}
            placeholder={FIELDS.valueProposition.placeholder}
            rows={3}
          />

          <BusinessField
            id="businessModel"
            label={FIELDS.businessModel.label}
            value={form.businessModel}
            onChange={update("businessModel")}
            subQuestions={FIELDS.businessModel.subQuestions}
            examples={FIELDS.businessModel.examples}
            placeholder={FIELDS.businessModel.placeholder}
            rows={4}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Analyse en cours..." : "Analyser mon projet"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
