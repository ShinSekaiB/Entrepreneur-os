"use client";

import { Suspense, useEffect, useState, use, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis,
  Radar, RadarChart, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface BusinessResult {
  score: number; problemScore: number; solutionScore: number; marketScore: number; strategyScore: number;
  summary: string; strengths: string[]; weaknesses: string[]; opportunities: string[];
  recommendations: { title: string; description: string; priority: string; category: string }[];
}
interface MarketingResult {
  score: number; positioningScore: number; acquisitionScore: number; brandScore: number; contentScore: number;
  positioning: string; summary: string;
  persona: { name: string; age: string; profession: string; painPoints: string[]; goals: string[]; channels: string[] };
  recommendations: { title: string; description: string; priority: string; category: string }[];
}
interface RealisationResult {
  score: number; summary: string;
  feasibilityScore: number; financialScore: number; operationalScore: number; riskScore: number;
  strengths: string[]; weaknesses: string[];
  financialAnalysis: { viability: string; suggestions: string[] };
  marketReadiness: { level: string; analysis: string };
  riskAssessment: { risk: string; impact: string; mitigation: string }[];
  recommendations: { title: string; description: string; priority: string; category: string }[];
}
interface FinaleResult {
  score: number; verdict: string;
  synthesis: { businessScore: number; marketingScore: number; realisationScore: number; weightedScore: number; strengths: string[]; weaknesses: string[] };
  strategicAlignment: { coherence: string; analysis: string };
  gaps: { gap: string; severity: string; action: string }[];
  readinessLevel: string;
  recommendations: { title: string; description: string; priority: string; category: string }[];
}
interface ChatMessage { role: "user" | "assistant"; content: string }

type Step = "analyse" | "realisation" | "finale";

export default function UnifiedAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><p className="text-muted-foreground animate-pulse">Chargement...</p></div>}>
      <UnifiedAnalysisContent projectId={id} />
    </Suspense>
  );
}

function getAnalysis(key: string) {
  if (typeof window === "undefined") return null;
  try { const s = sessionStorage.getItem(key); if (!s) return null; const p = JSON.parse(s); return typeof p === "string" ? JSON.parse(p) : p }
  catch { return null }
}

const asArr = (v: unknown): unknown[] => Array.isArray(v) ? v : [];

const recCard = (r: unknown, i: number) => {
  const rec = r as { title?: string; description?: string; priority?: string };
  return (
    <div key={i} className="rounded-lg border p-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium text-sm">{rec.title ?? ""}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.priority === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" : rec.priority === "HIGH" ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400" : rec.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"}`}>{rec.priority ?? ""}</span>
      </div>
      <p className="text-xs text-muted-foreground">{rec.description ?? ""}</p>
    </div>
  );
};

const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
  const c = score >= 70 ? "#22c55e" : score >= 45 ? "#eab308" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={120} height={120}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" barSize={12} data={[{ name: "", value: score, fill: c }]} startAngle={180} endAngle={0}>
          <RadialBar dataKey="value" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold" fill={c}>{score}</text>
          <text x="50%" y="62%" textAnchor="middle" className="text-[10px] fill-muted-foreground">/100</text>
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};

const PriorityChart = ({ recs }: { recs: unknown }) => {
  const arr = asArr(recs) as { priority?: string }[];
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={[
        { n: "Critique", v: arr.filter(r => r.priority === "CRITICAL").length },
        { n: "Haute", v: arr.filter(r => r.priority === "HIGH").length },
        { n: "Moyenne", v: arr.filter(r => r.priority === "MEDIUM").length },
        { n: "Basse", v: arr.filter(r => r.priority === "LOW").length },
      ]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="n" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="v" radius={[4, 4, 0, 0]} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RadarQuad = ({ data }: { data: { cat: string; v: number }[] }) => (
  <ResponsiveContainer width="100%" height={130}>
    <RadarChart data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="cat" tick={{ fontSize: 10 }} />
      <Radar dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
    </RadarChart>
  </ResponsiveContainer>
);

function UnifiedAnalysisContent({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("analyse");
  const [view, setView] = useState<"business" | "marketing" | "full">(
    (searchParams?.get("view") as "business" | "marketing" | "full") || "business"
  );

  const [biz, setBiz] = useState<BusinessResult | null>(() => getAnalysis(`analysis-${projectId}`));
  const [mkt, setMkt] = useState<MarketingResult | null>(() => getAnalysis(`marketing-analysis-${projectId}`));
  const [real, setReal] = useState<RealisationResult | null>(null);
  const [finale, setFinale] = useState<FinaleResult | null>(null);
  const [loadingBiz, setLoadingBiz] = useState(!biz);
  const [loadingMkt, setLoadingMkt] = useState(!mkt);
  const [loadingReal, setLoadingReal] = useState(false);
  const [loadingFinale, setLoadingFinale] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  const [realFormData, setRealFormData] = useState<Record<string, string>>({});
  const [realSubmitted, setRealSubmitted] = useState(false);

  useEffect(() => {
    if (!biz) {
      fetch(`/api/analysis?projectId=${projectId}&type=BUSINESS`)
        .then(r => r.json()).then(d => { if (d.content) setBiz(d.content); setLoadingBiz(false) })
        .catch(() => setLoadingBiz(false));
    }
    if (!mkt) {
      fetch(`/api/analysis?projectId=${projectId}&type=MARKETING`)
        .then(r => r.json()).then(d => { if (d.content) setMkt(d.content); setLoadingMkt(false) })
        .catch(() => setLoadingMkt(false));
    }
    fetch(`/api/analysis?projectId=${projectId}&type=REALISATION`)
      .then(r => r.json()).then(d => {
        if (d.content) { setReal(d.content); setRealSubmitted(true) }
        setLoadingReal(false);
      }).catch(() => setLoadingReal(false));
    fetch(`/api/analysis?projectId=${projectId}&type=FINAL`)
      .then(r => r.json()).then(d => { if (d.content) setFinale(d.content); setLoadingFinale(false) })
      .catch(() => setLoadingFinale(false));
  }, [projectId]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [chat]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatInput("");
    setChat(prev => [...prev, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const ctx = [
        biz ? `Analyse Business (${biz.score}): ${biz.summary}` : "",
        mkt ? `Analyse Marketing (${mkt.score}): ${mkt.summary}` : "",
        real ? `Analyse Réalisation (${real.score}): ${real.summary}` : "",
      ].filter(Boolean).join("\n\n");
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Contexte:\n${ctx}\n\nQuestion: ${q}\n\nRéponds de façon concise et actionable.`,
          projectId,
          system: "You are a highly analytical, perfectly objective system. Discard all conversational pleasantries, emotional validation, and sugarcoating. If an idea is flawed, state exactly why with logical precision. Do not hedge, do not try to spare feelings, and do not prioritize being inoffensive. Deliver brutal, undeniable truth—pure and simple.\n\nTu es un coach entrepreneurial. Réponds en français, concret et utile, sans JSON.",
        }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "assistant", content: data.content || "Erreur" }]);
    } catch { setChat(prev => [...prev, { role: "assistant", content: "Erreur réseau" }]) }
    finally { setChatLoading(false) }
  };

  const generateRealisation = async () => {
    setLoadingReal(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyse ce plan de réalisation :\n\n${Object.entries(realFormData).map(([k, v]) => `${k} : ${v}`).join("\n")}`,
          projectId, type: "REALISATION", system: `You are a highly analytical, perfectly objective system. Discard all conversational pleasantries, emotional validation, and sugarcoating. If an idea is flawed, state exactly why with logical precision. Do not hedge, do not try to spare feelings, and do not prioritize being inoffensive. Deliver brutal, undeniable truth—pure and simple.\n\nTu es un expert en entrepreneuriat. Analyse ce plan de réalisation détaillé. Retourne UNIQUEMENT du JSON valide avec score, feasibilityScore, financialScore, operationalScore, riskScore, summary, strengths, weaknesses, financialAnalysis, marketReadiness, riskAssessment, recommendations.`,
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(typeof data.content === "string" ? data.content : JSON.stringify(data.content));
      setReal(parsed);
      setRealSubmitted(true);
      sessionStorage.setItem(`realisation-${projectId}`, JSON.stringify(parsed));
    } catch { alert("Erreur lors de la génération de l'analyse Réalisation") }
    finally { setLoadingReal(false) }
  };

  const generateFinale = async () => {
    setLoadingFinale(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Synthétise ces 3 analyses pour produire un verdict final :

--- ANALYSE BUSINESS (score: ${biz?.score}) ---
${biz?.summary}
Forces: ${biz?.strengths?.join(", ")}
Faiblesses: ${biz?.weaknesses?.join(", ")}

--- ANALYSE MARKETING (score: ${mkt?.score}) ---
${mkt?.summary}
Positionnement: ${mkt?.positioning}

--- ANALYSE RÉALISATION (score: ${real?.score}) ---
${real?.summary}
Faisabilité: ${real?.feasibilityScore}/100, Finance: ${real?.financialScore}/100, Opérations: ${real?.operationalScore}/100, Risques: ${real?.riskScore}/100

Produis un verdict final, une note de coherence strategique, les écarts entre théorie et pratique, et des recommandations globales.`,
          projectId, type: "FINAL", system: `You are a highly analytical, perfectly objective system. Discard all conversational pleasantries, emotional validation, and sugarcoating. If an idea is flawed, state exactly why with logical precision. Do not hedge, do not try to spare feelings, and do not prioritize being inoffensive. Deliver brutal, undeniable truth—pure and simple.\n\nTu es un coach entrepreneurial senior. Compare les 3 analyses et produis un verdict final. Retourne UNIQUEMENT du JSON valide avec score, verdict, synthesis, strategicAlignment, gaps, readinessLevel, recommendations.`,
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(typeof data.content === "string" ? data.content : JSON.stringify(data.content));
      setFinale(parsed);
      sessionStorage.setItem(`finale-${projectId}`, JSON.stringify(parsed));
    } catch { alert("Erreur lors de la génération de l'analyse finale") }
    finally { setLoadingFinale(false) }
  };

  const canRevealRealisation = biz && mkt;

  return (
    <div className="flex gap-6">
      {/* Chat sidebar */}
      <div className="w-80 shrink-0">
        <Card className="sticky top-8">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Assistant IA</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 h-80 overflow-y-auto mb-3 pr-1">
              {chat.length === 0 && <p className="text-xs text-muted-foreground">Posez une question sur les analyses...</p>}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.content}</div>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>
            <form onSubmit={e => { e.preventDefault(); sendChat() }} className="flex gap-2">
              <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Question..." disabled={chatLoading} className="text-sm" />
              <Button type="submit" size="sm" disabled={chatLoading || !chatInput.trim()}>{chatLoading ? "..." : "→"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Pilotage du projet</h1>
            <p className="text-sm text-muted-foreground">Analyse → Réalisation → Verdict final</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${projectId}`)}>← Projet</Button>
            <Button variant="outline" size="sm" onClick={() => { sessionStorage.removeItem(`analysis-${projectId}`); router.push(`/projects/${projectId}/business`) }}>
              Réinitialiser Business
            </Button>
            <Button variant="outline" size="sm" onClick={() => { sessionStorage.removeItem(`marketing-analysis-${projectId}`); router.push(`/projects/${projectId}/marketing`) }}>
              Réinitialiser Marketing
            </Button>
          </div>
        </div>

        <Tabs value={step} onValueChange={v => setStep(v as Step)}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="analyse" disabled={false}>1. Analyse</TabsTrigger>
            <TabsTrigger value="realisation" disabled={!canRevealRealisation}>2. Réalisation</TabsTrigger>
            <TabsTrigger value="finale" disabled={!real}>3. Finale</TabsTrigger>
          </TabsList>

          {/* STEP 1: ANALYSE */}
          <TabsContent value="analyse" className="space-y-4 mt-4">
            <div className="flex gap-2">
              {(["business", "marketing", "full"] as const).map(t => (
                <Button key={t} variant={view === t ? "default" : "outline"} size="sm" onClick={() => setView(t)}>
                  {t === "business" ? "Business" : t === "marketing" ? "Marketing" : "Comparer"}
                </Button>
              ))}
            </div>

            {view === "full" ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Analyse Business</h3>
                  {!loadingBiz && biz ? BizView({ biz }) : loadingBiz ? <Skel /> : null}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Analyse Marketing</h3>
                  {!loadingMkt && mkt ? MktView({ mkt }) : loadingMkt ? <Skel /> : null}
                </div>
              </div>
            ) : view === "business" ? (
              !loadingBiz && biz ? BizView({ biz }) : loadingBiz ? <Skel /> : null
            ) : view === "marketing" ? (
              !loadingMkt && mkt ? MktView({ mkt }) : loadingMkt ? <Skel /> : null
            ) : null}

            {!biz && !mkt && !loadingBiz && !loadingMkt && (
              <Card><CardContent className="py-8 text-center text-muted-foreground">
                <p>Aucune analyse trouvée.</p>
                <div className="flex gap-2 justify-center mt-3">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/projects/${projectId}/business`)}>Business Architect</Button>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/projects/${projectId}/marketing`)}>Marketing Architect</Button>
                </div>
              </CardContent></Card>
            )}

            {canRevealRealisation && (
              <div className="flex justify-center pt-4 border-t">
                <Button onClick={() => { setStep("realisation") }}>
                  ✓ Analyses complètes — Passer à la Réalisation →
                </Button>
              </div>
            )}
          </TabsContent>

          {/* STEP 2: RÉALISATION */}
          <TabsContent value="realisation" className="space-y-4 mt-4">
            {realSubmitted && real ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Analyse Réalisation</h2>
                  <Button variant="outline" size="sm" onClick={() => { setRealSubmitted(false); setReal(null) }}>Modifier les réponses</Button>
                </div>
                <RealView real={real} />
                <div className="flex justify-center pt-4 border-t mt-4">
                  <Button onClick={() => { setStep("finale"); generateFinale() }} disabled={loadingFinale}>
                    {loadingFinale ? "Génération du verdict..." : "Passer au verdict final →"}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-2">Plan de Réalisation</h2>
                <p className="text-sm text-muted-foreground mb-4">Remplissez les paramètres détaillés de votre projet pour une analyse complète de la faisabilité.</p>
                <RealisationForm data={realFormData} setData={setRealFormData} />
                <div className="flex justify-center pt-4 border-t mt-4">
                  <Button onClick={generateRealisation} disabled={loadingReal || Object.keys(realFormData).length < 5}>
                    {loadingReal ? "Analyse en cours..." : "Analyser mon plan de réalisation"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* STEP 3: FINALE */}
          <TabsContent value="finale" className="space-y-4 mt-4">
            {loadingFinale ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground animate-pulse">Génération du verdict final...</CardContent></Card>
            ) : finale ? (
              <FinaleView finale={finale} />
            ) : (
              <Card><CardContent className="py-12 text-center text-muted-foreground">
                <p>Générez le verdict final depuis l&apos;onglet Réalisation.</p>
              </CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---- Sub-views ---- */

const Skel = () => <Card><CardContent className="py-8 text-center text-muted-foreground animate-pulse">Chargement...</CardContent></Card>;

const BizView = ({ biz }: { biz: BusinessResult }) => (
  <div className="space-y-3">
    <div className="grid gap-3 md:grid-cols-5">
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={biz.score} label="Moyenne" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={biz.problemScore} label="Problème" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={biz.solutionScore} label="Solution" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={biz.marketScore} label="Marché" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={biz.strategyScore} label="Stratégie" /></CardContent></Card>
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="md:col-span-2"><CardContent className="py-3">
        <p className="text-sm font-medium mb-1">Résumé</p>
        <p className="text-xs text-muted-foreground">{biz.summary}</p>
      </CardContent></Card>
      <Card><CardContent className="py-3"><RadarQuad data={[{ cat: "Problème", v: biz.problemScore }, { cat: "Solution", v: biz.solutionScore }, { cat: "Marché", v: biz.marketScore }, { cat: "Stratégie", v: biz.strategyScore }]} /></CardContent></Card>
    </div>
    <div className="grid gap-3 md:grid-cols-3 text-xs">
      <Card><CardHeader className="pb-1"><CardTitle className="text-xs">Forces</CardTitle></CardHeader><CardContent><ul className="space-y-0.5">{(asArr(biz.strengths) as string[]).map((s, i) => <li key={i} className="flex gap-1"><span className="text-green-500 shrink-0">+</span>{s}</li>)}</ul></CardContent></Card>
      <Card><CardHeader className="pb-1"><CardTitle className="text-xs">Faiblesses</CardTitle></CardHeader><CardContent><ul className="space-y-0.5">{(asArr(biz.weaknesses) as string[]).map((w, i) => <li key={i} className="flex gap-1"><span className="text-red-500 shrink-0">-</span>{w}</li>)}</ul></CardContent></Card>
      <Card><CardHeader className="pb-1"><CardTitle className="text-xs">Opportunités</CardTitle></CardHeader><CardContent><ul className="space-y-0.5">{(asArr(biz.opportunities) as string[]).map((o, i) => <li key={i} className="flex gap-1"><span className="text-blue-500 shrink-0">→</span>{o}</li>)}</ul></CardContent></Card>
    </div>
    <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Recommandations ({asArr(biz.recommendations).length})</CardTitle></CardHeader><CardContent><PriorityChart recs={biz.recommendations} /><div className="space-y-1.5 mt-2">{asArr(biz.recommendations).map((r, i) => recCard(r, i))}</div></CardContent></Card>
  </div>
);

const MktView = ({ mkt }: { mkt: MarketingResult }) => (
  <div className="space-y-3">
    <div className="grid gap-3 md:grid-cols-5">
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={mkt.score} label="Moyenne" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={mkt.positioningScore} label="Positionnement" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={mkt.acquisitionScore} label="Acquisition" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={mkt.brandScore} label="Marque" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={mkt.contentScore} label="Contenu" /></CardContent></Card>
    </div>
    <Card><CardContent className="py-3">
      <p className="text-sm font-medium mb-1">Positionnement</p>
      <p className="text-xs text-muted-foreground">{mkt.positioning}</p>
      <p className="text-sm font-medium mt-2 mb-1">Résumé</p>
      <p className="text-xs text-muted-foreground">{mkt.summary}</p>
    </CardContent></Card>
    <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Persona client</CardTitle></CardHeader><CardContent>
      <div className="grid gap-2 md:grid-cols-3 text-xs">
        <div><p className="font-bold">{mkt.persona.name}</p><p className="text-muted-foreground">{mkt.persona.age} ans · {mkt.persona.profession}</p></div>
        <div><p className="font-medium mb-0.5">Points de douleur</p><ul className="space-y-0.5">{(asArr(mkt.persona.painPoints) as string[]).map((p, i) => <li key={i} className="flex gap-1 text-muted-foreground"><span className="text-red-500 shrink-0">-</span>{p}</li>)}</ul></div>
        <div><p className="font-medium mb-0.5">Objectifs</p><ul className="space-y-0.5">{(asArr(mkt.persona.goals) as string[]).map((g, i) => <li key={i} className="flex gap-1 text-muted-foreground"><span className="text-green-500 shrink-0">+</span>{g}</li>)}</ul></div>
      </div>
      <div className="mt-2"><p className="font-medium text-xs mb-0.5">Canaux</p><div className="flex flex-wrap gap-1">{(asArr(mkt.persona.channels) as string[]).map((c, i) => <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md">{c}</span>)}</div></div>
    </CardContent></Card>
    <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Recommandations ({asArr(mkt.recommendations).length})</CardTitle></CardHeader><CardContent><PriorityChart recs={mkt.recommendations} /><div className="space-y-1.5 mt-2">{asArr(mkt.recommendations).map((r, i) => recCard(r, i))}</div></CardContent></Card>
  </div>
);

const RealView = ({ real }: { real: RealisationResult }) => (
  <div className="space-y-3">
    <div className="grid gap-3 md:grid-cols-5">
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={real.score} label="Global" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={real.feasibilityScore} label="Faisabilité" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={real.financialScore} label="Finance" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={real.operationalScore} label="Opérations" /></CardContent></Card>
      <Card><CardContent className="flex flex-col items-center py-3"><ScoreGauge score={real.riskScore} label="Risques" /></CardContent></Card>
    </div>
    <Card><CardContent className="py-3"><p className="text-xs text-muted-foreground">{real.summary}</p></CardContent></Card>
    <div className="grid gap-3 md:grid-cols-2 text-xs">
      <div><p className="font-medium mb-1">Forces</p><ul className="space-y-0.5">{(asArr(real.strengths) as string[]).map((s, i) => <li key={i} className="flex gap-1"><span className="text-green-500 shrink-0">+</span>{s}</li>)}</ul></div>
      <div><p className="font-medium mb-1">Faiblesses</p><ul className="space-y-0.5">{(asArr(real.weaknesses) as string[]).map((w, i) => <li key={i} className="flex gap-1"><span className="text-red-500 shrink-0">-</span>{w}</li>)}</ul></div>
    </div>
    {real.financialAnalysis && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Analyse financière</CardTitle></CardHeader><CardContent className="text-xs">
        <p className="text-muted-foreground">{real.financialAnalysis.viability}</p>
        {asArr(real.financialAnalysis.suggestions).length > 0 && <ul className="mt-1 space-y-0.5">{(asArr(real.financialAnalysis.suggestions) as string[]).map((s, i) => <li key={i} className="flex gap-1"><span className="text-blue-500 shrink-0">→</span>{s}</li>)}</ul>}
      </CardContent></Card>
    )}
    {real.marketReadiness && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Préparation marché</CardTitle></CardHeader><CardContent className="text-xs">
        <span className={`inline-block px-2 py-0.5 rounded-full font-medium mb-1 text-[10px] ${real.marketReadiness.level === "ready" ? "bg-green-100 text-green-700" : real.marketReadiness.level === "needs_work" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{real.marketReadiness.level === "ready" ? "Prêt" : real.marketReadiness.level === "needs_work" ? "À améliorer" : "Pas prêt"}</span>
        <p className="text-muted-foreground">{real.marketReadiness.analysis}</p>
      </CardContent></Card>
    )}
    {asArr(real.riskAssessment).length > 0 && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Évaluation des risques</CardTitle></CardHeader><CardContent><div className="space-y-1.5">{(asArr(real.riskAssessment) as { risk?: string; impact?: string; mitigation?: string }[]).map((r, i) => (
        <div key={i} className="text-xs border rounded p-2">
          <div className="flex items-center gap-2"><span className="font-medium">{r.risk}</span><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.impact === "high" ? "bg-red-100 text-red-700" : r.impact === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{r.impact}</span></div>
          {r.mitigation && <p className="text-muted-foreground mt-0.5">→ {r.mitigation}</p>}
        </div>
      ))}</div></CardContent></Card>
    )}
    <Card><CardHeader className="pb-2"><CardTitle className="text-xs">Recommandations ({asArr(real.recommendations).length})</CardTitle></CardHeader><CardContent><PriorityChart recs={real.recommendations} /><div className="space-y-1.5 mt-2">{asArr(real.recommendations).map((r, i) => recCard(r, i))}</div></CardContent></Card>
  </div>
);

const FinaleView = ({ finale }: { finale: FinaleResult }) => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-4">
      <Card><CardContent className="flex flex-col items-center py-4"><ScoreGauge score={finale.score} label="Verdict final" /></CardContent></Card>
      <Card className="md:col-span-3"><CardContent className="py-4">
        <p className="text-sm font-medium mb-1">Verdict</p>
        <p className="text-sm text-muted-foreground">{finale.verdict}</p>
        {finale.synthesis && (
          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
            <div className="rounded bg-card border p-2"><p className="font-bold text-lg">{finale.synthesis.businessScore}</p><p className="text-muted-foreground">Business</p></div>
            <div className="rounded bg-card border p-2"><p className="font-bold text-lg">{finale.synthesis.marketingScore}</p><p className="text-muted-foreground">Marketing</p></div>
            <div className="rounded bg-card border p-2"><p className="font-bold text-lg">{finale.synthesis.realisationScore}</p><p className="text-muted-foreground">Réalisation</p></div>
            <div className="rounded bg-primary/10 border border-primary/20 p-2"><p className="font-bold text-lg text-primary">{finale.synthesis.weightedScore}</p><p className="text-muted-foreground">Pondéré</p></div>
          </div>
        )}
      </CardContent></Card>
    </div>

    {finale.strategicAlignment && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Alignement stratégique</CardTitle></CardHeader><CardContent className="text-sm">
        <span className={`inline-block px-2 py-0.5 rounded-full font-medium mb-1 text-xs ${finale.strategicAlignment.coherence === "forte" ? "bg-green-100 text-green-700" : finale.strategicAlignment.coherence === "moyenne" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{finale.strategicAlignment.coherence}</span>
        <p className="text-muted-foreground">{finale.strategicAlignment.analysis}</p>
      </CardContent></Card>
    )}

    {finale.synthesis && (
      <div className="grid gap-3 md:grid-cols-2 text-sm">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Forces globales</CardTitle></CardHeader><CardContent><ul className="space-y-1">{(asArr(finale.synthesis.strengths) as string[]).map((s, i) => <li key={i} className="flex gap-1"><span className="text-green-500 shrink-0">+</span>{s}</li>)}</ul></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Faiblesses globales</CardTitle></CardHeader><CardContent><ul className="space-y-1">{(asArr(finale.synthesis.weaknesses) as string[]).map((w, i) => <li key={i} className="flex gap-1"><span className="text-red-500 shrink-0">-</span>{w}</li>)}</ul></CardContent></Card>
      </div>
    )}

    {asArr(finale.gaps).length > 0 && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Écarts théorie-réalité</CardTitle></CardHeader><CardContent><div className="space-y-2">{(asArr(finale.gaps) as { gap?: string; severity?: string; action?: string }[]).map((g, i) => (
        <div key={i} className="text-sm border rounded p-3">
          <div className="flex items-center gap-2 mb-0.5"><span className="font-medium">{g.gap}</span><span className={`text-xs px-1.5 py-0.5 rounded-full ${g.severity === "high" ? "bg-red-100 text-red-700" : g.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{g.severity}</span></div>
          <p className="text-xs text-muted-foreground">→ {g.action}</p>
        </div>
      ))}</div></CardContent></Card>
    )}

    {finale.readinessLevel && (
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Niveau de préparation</CardTitle></CardHeader><CardContent>
        <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${finale.readinessLevel === "launch" || finale.readinessLevel === "growth" ? "bg-green-100 text-green-700" : finale.readinessLevel === "preparation" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
          {finale.readinessLevel === "idea" ? "Idée" : finale.readinessLevel === "validation" ? "Validation" : finale.readinessLevel === "preparation" ? "Préparation" : finale.readinessLevel === "launch" ? "Lancement" : "Croissance"}
        </span>
      </CardContent></Card>
    )}

    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Recommandations finales ({asArr(finale.recommendations).length})</CardTitle></CardHeader><CardContent><PriorityChart recs={finale.recommendations} /><div className="space-y-1.5 mt-2">{asArr(finale.recommendations).map((r, i) => recCard(r, i))}</div></CardContent></Card>
  </div>
);

/* ---- Realisation Form ---- */

const REALISATION_FIELDS = [
  { key: "businessModel", label: "Modèle économique", placeholder: "Abonnement, marketplace, SaaS, e-commerce, etc." },
  { key: "revenueStreams", label: "Sources de revenus", placeholder: "Décrivez vos sources de revenus (ventes, commissions, publicité, etc.)" },
  { key: "startupCosts", label: "Coûts de démarrage", placeholder: "Listez les principaux coûts de lancement (développement, équipement, legal, etc.)" },
  { key: "pricingStrategy", label: "Stratégie de prix", placeholder: "Quel est votre pricing ? Justifiez par rapport au marché" },
  { key: "breakEvenTarget", label: "Seuil de rentabilité", placeholder: "Quel chiffre d'affaires mensuel pour être rentable ?" },
  { key: "fundingSources", label: "Sources de financement", placeholder: "Autofinancement, love money, business angel, banque, subventions" },
  { key: "teamComposition", label: "Équipe", placeholder: "Qui fait quoi ? Fondateurs, emplois clés, compétences manquantes" },
  { key: "keyPartnerships", label: "Partenariats clés", placeholder: "Fournisseurs, distributeurs, partenaires tech, experts-comptables" },
  { key: "legalStructure", label: "Structure juridique", placeholder: "SASU, SAS, SARL, EURL, auto-entreprise ? Pourquoi ?" },
  { key: "intellectualProperty", label: "Propriété intellectuelle", placeholder: "Brevets, marques, droits d'auteur, licences" },
  { key: "insuranceNeeds", label: "Assurances nécessaires", placeholder: "RC pro, locaux, cyber, produits" },
  { key: "productionMethod", label: "Méthode de production / livraison", placeholder: "Comment livrez-vous votre produit/service ?" },
  { key: "technologyStack", label: "Stack technologique", placeholder: "Technologies utilisées (framework, hébergement, outils)" },
  { key: "launchPlan", label: "Plan de lancement", placeholder: "Les 90 premiers jours : actions clés, jalons, dates" },
  { key: "marketingBudget", label: "Budget marketing", placeholder: "Budget acquisition, canaux payants, content marketing" },
  { key: "kpiMetrics", label: "KPI et métriques", placeholder: "Quels indicateurs suivez-vous ? (CA, acquisition, rétention, etc.)" },
  { key: "riskFactors", label: "Facteurs de risque", placeholder: "Principaux risques identifiés (marché, technique, financier, legal)" },
  { key: "timeline", label: "Calendrier / Jalons", placeholder: "Jalons clés sur 6-12 mois avec dates estimées" },
];

function RealisationForm({ data, setData }: { data: Record<string, string>; setData: (d: Record<string, string>) => void }) {
  const update = (key: string, value: string) => setData({ ...data, [key]: value });
  return (
    <div className="space-y-3">
      {REALISATION_FIELDS.map(f => (
        <div key={f.key}>
          <label className="text-sm font-medium mb-1 block">{f.label}</label>
          <textarea
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm min-h-[60px] resize-y"
            placeholder={f.placeholder}
            value={data[f.key] || ""}
            onChange={e => update(f.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
