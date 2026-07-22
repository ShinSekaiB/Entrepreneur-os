"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface FormAssistantProps {
  projectId: string;
  projectName: string;
  projectSector?: string | null;
  projectDescription?: string | null;
  type: "business" | "marketing";
}

const QUICK_ACTIONS: Record<string, { label: string; prompt: string }[]> = {
  business: [
    { label: "Décrire le problème", prompt: "Aide-moi à décrire le problème que mon projet résout de façon claire et chiffrée." },
    { label: "Définir la solution", prompt: "Comment décrire ma solution pour convaincre ? Quels points clés inclure ?" },
    { label: "Cibler le client", prompt: "Aide-moi à définir mon client cible précisément (segment, taille, décisionnaire)." },
    { label: "Proposition de valeur", prompt: "Qu'est-ce qui rend une proposition de valeur unique et percutante ?" },
    { label: "Modèle économique", prompt: "Aide-moi à structurer mon modèle économique (revenus, coûts, pricing)." },
  ],
  marketing: [
    { label: "Audience cible", prompt: "Aide-moi à décrire mon audience cible en détail (démographie, psychographie, points de friction)." },
    { label: "Analyser concurrents", prompt: "Comment analyser mes concurrents et identifier leurs forces/faiblesses ?" },
    { label: "Ton de marque", prompt: "Quel ton de marque est adapté à mon projet ? Donne-moi des exemples." },
    { label: "Objectifs marketing", prompt: "Aide-moi à définir des objectifs marketing concrets (acquisition, budget, canaux)." },
  ],
};

export function FormAssistant({ projectId, projectName, projectSector, projectDescription, type }: FormAssistantProps) {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (content: string) => {
    setChat((prev) => [...prev, { role: "user", content }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const ctx = [
        `Projet: ${projectName}`,
        projectSector ? `Secteur: ${projectSector}` : "",
        projectDescription ? `Description: ${projectDescription}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Tu aides l'utilisateur à remplir le formulaire ${type === "business" ? "Business (problème, solution, client cible, proposition de valeur, modèle économique)" : "Marketing (audience cible, concurrents, ton de marque, objectifs marketing)"}.

Contexte du projet :
${ctx}

Message de l'utilisateur : ${content}

Réponds en français, concret et actionnable. Donne des exemples précis que l'utilisateur peut adapter. Propose des formulations. Ne produis PAS de JSON.`,
          projectId,
          system: "Tu es un coach entrepreneurial expert. Tu aides à remplir un questionnaire d'analyse de projet. Sois pédagogique, donne des exemples concrets, et guide vers des réponses de qualité (50+ mots par champ).",
        }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.content || "Erreur" }]);
    } catch {
      setChat((prev) => [...prev, { role: "assistant", content: "Erreur réseau" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    sendMessage(chatInput.trim());
  };

  return (
    <div className="w-80 shrink-0 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Assistant Formulaire</CardTitle>
          <p className="text-xs text-muted-foreground">
            {projectName}
            {projectSector && ` · ${projectSector}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 mb-3">
            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Aide rapide</p>
            <div className="flex flex-wrap gap-1">
              {QUICK_ACTIONS[type].map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-6 px-1.5"
                  disabled={chatLoading}
                  onClick={() => sendMessage(action.prompt)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3 h-80 overflow-y-auto mb-3 pr-1 border-t pt-3">
            {chat.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Posez une question sur le formulaire ou cliquez sur un bouton d&apos;aide rapide.
              </p>
            )}
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ex: comment décrire mon marché ?"
              disabled={chatLoading}
              className="text-sm"
            />
            <Button type="submit" size="sm" disabled={chatLoading || !chatInput.trim()}>
              {chatLoading ? "..." : "→"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
