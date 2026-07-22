const SECTOR_BENCHMARKS: Record<string, string> = {
  saas: `Benchmarks SaaS & Software (Bessemer BVP Cloud Index, ChartMogul, KeyBanc)

| Stade      | MRR Growth  | CAC         | LTV:CAC | Churn/mois | NRR    |
|------------|-------------|-------------|---------|------------|--------|
| Seed       | 15-25%/mois | $150-400    | 2-3:1   | 5-12%      | 80-95% |
| Series A   | 10-20%/mois | $300-700    | 3-4:1   | 3-8%       | 90-105%|
| Growth     | 3-8%/mois   | $600-1.5k   | 4-6:1   | 1-3%       | 105-125%|

CAC par segment : SMB $4.8k, Mid-Market $18k, Enterprise $67k
Rule of 40 : croissance% + marge% > 40
Marge brute target : 70-85%
Churn > 5%/mois en SMB = fatal sans expansion revenue
NRR < 100% = base existante rétrécit
CAC Payback < 12 mois sain, > 18 mois alarme`,

  software: `Benchmarks SaaS & Software (Bessemer BVP Cloud Index, ChartMogul, KeyBanc)

| Stade      | MRR Growth  | CAC         | LTV:CAC | Churn/mois | NRR    |
|------------|-------------|-------------|---------|------------|--------|
| Seed       | 15-25%/mois | $150-400    | 2-3:1   | 5-12%      | 80-95% |
| Series A   | 10-20%/mois | $300-700    | 3-4:1   | 3-8%       | 90-105%|
| Growth     | 3-8%/mois   | $600-1.5k   | 4-6:1   | 1-3%       | 105-125%|

CAC par segment : SMB $4.8k, Mid-Market $18k, Enterprise $67k
Rule of 40 : croissance% + marge% > 40
Marge brute target : 70-85%
Churn > 5%/mois en SMB = fatal sans expansion revenue
NRR < 100% = base existante rétrécit
CAC Payback < 12 mois sain, > 18 mois alarme`,

  ecommerce: `Benchmarks E-commerce & Retail (Littledata 15k+ boutiques, Dynamic Yield, Triple Whale)

Taux de conversion par vertical :
- Food & Beverage : 4.9-6.2%
- Health & Beauty : 2.4%
- Fashion & Apparel : 1.8%
- Home & Garden : 1.8%
- Electronics : 1.1-1.4%
CVR cross-industry moyen : 2.5-3.0%
AOV médian cross-industry : $128-180

Marges DTC par vertical (Gross Margin / CM2 / CM3) :
- Beauty : 65-85% / 52-70% / 25-40%
- Apparel : 50-65% / 38-50% / 15-25%
- Food & Beverage : 40-55% / 30-42% / 12-22%

CPA Meta médian 2025 : $32.74
Taux d'abandon panier : ~70%
Seuil viabilité DTC : CM1 > 40%
CAC payback e-commerce : < 6 mois idéal, < 12 mois acceptable`,

  restaurant: `Benchmarks Restauration & Food & Beverage (National Restaurant Association 2026)

Par concept : QSR / Fast Casual / Casual Dining / Fine Dining
- Food Cost % : 28-32% / 28-33% / 28-34% / 25-35%
- Labor Cost % : 25-35% / 28-33% / 30-35% / 30-35%
- Prime Cost : 55-60% / 58-63% / 60-65% / 55-65%
- Rent % : 6-10% / 7-10% / 5-10% / 5-9%
- Net Profit % : 6-9% / 6-9% / 3-8% / 5-10%

Prime cost (food+labor) < 65% du revenu
Seuil rentabilité : taux d'occupation > 60-70%
Food cost hors boissons : 28-35%
Beverage cost (alcool) : 22-28%`,

  food: `Benchmarks Restauration & Food & Beverage (National Restaurant Association 2026)

Par concept : QSR / Fast Casual / Casual Dining / Fine Dining
- Food Cost % : 28-32% / 28-33% / 28-34% / 25-35%
- Labor Cost % : 25-35% / 28-33% / 30-35% / 30-35%
- Prime Cost : 55-60% / 58-63% / 60-65% / 55-65%
- Rent % : 6-10% / 7-10% / 5-10% / 5-9%
- Net Profit % : 6-9% / 6-9% / 3-8% / 5-10%

Prime cost (food+labor) < 65% du revenu
Seuil rentabilité : taux d'occupation > 60-70%
Food cost hors boissons : 28-35%
Beverage cost (alcool) : 22-28%`,

  beverage: `Benchmarks Restauration & Food & Beverage (National Restaurant Association 2026)

Par concept : QSR / Fast Casual / Casual Dining / Fine Dining
- Food Cost % : 28-32% / 28-33% / 28-34% / 25-35%
- Labor Cost % : 25-35% / 28-33% / 30-35% / 30-35%
- Prime Cost : 55-60% / 58-63% / 60-65% / 55-65%
- Rent % : 6-10% / 7-10% / 5-10% / 5-9%
- Net Profit % : 6-9% / 6-9% / 3-8% / 5-10%`,

  manufacturing: `Benchmarks Manufacturing (NYU Stern Damodaran 2026 — 27 sous-secteurs)

Marges par sous-secteur (Gross Margin / EBITDA / Net) :
- Pharmaceuticals : 65.3% / 35.4% / 15.2%
- Semiconductors : 56.2% / 37.0% / 30.5%
- Medical Devices : 55.0% / 24.0% / 12.0%
- Machinery : 32.5% / 17.3% / 8.5%
- Electronics : 32.0% / 15.0% / 9.8%
- Auto Parts : 15.8% / 9.0% / 1.6%
- Furniture : 28.0% / 8.0% / 3.2%
Médiane manufacturing : Gross 33.6%, EBITDA 18.3%, Net 7.2%
CapEx/Sales médian : 4.3% (peut atteindre 19% semi-conducteurs)
Labor = 30-50% du coût projet, Materials = 30-40%
Overhead manufacturing : 15-25% du revenu
Marges privées : 5-15 points en dessous des cotées`,

  construction: `Benchmarks Construction (CFMA Financial Benchmarker 2025)

Marges par métier (Gross / Net / Overhead) :
- GC Residential : 25-35% / 8-15% / 8-12%
- GC Commercial : 15-25% / 5-10% / 8-12%
- Electrical : 35-50% / 10-18% / 10-15%
- Plumbing : 35-55% / 10-20% / 10-15%
- HVAC : 30-45% / 8-15% / 10-15%
- Specialty Trades (CFMA 2025) : Gross 22.4%, Net 7.7%

Revenue/ET médian : $320k (CFMA 2025)
Current ratio target : > 2.0 (bonding > 1.5)
DSO target : < 35 jours (acceptable <= 50, critique > 70)
Les métiers avec service/maintenance (plomberie, elec, HVAC) ont des marges plus hautes`,

  realestate: `Benchmarks Immobilier & Real Estate (NAR, Federal Reserve)

Marges nettes par type d'agence :
- Solo Agent : 20-40%
- Small Agency (<5 agents) : 10-20%
- Mid-Size (5-20) : 7-15%
- Large Brokerage (20+) : 5-10%
- Virtual Brokerage : 15-25%
- Property Management : 10-15%

Commission rate historique : 5-6%, tendance à la baisse
Revenue mix : 75% ventes, 15-18% gestion locative
Wages ratio (commissions + staff) : 45-55% du revenue brut
Taux de conversion leads→clients : 2-3%
Objectif : property management devrait couvrir 100% des frais fixes`,

  immobilier: `Benchmarks Immobilier & Real Estate (NAR, Federal Reserve)

Marges nettes par type d'agence :
- Solo Agent : 20-40%
- Small Agency (<5 agents) : 10-20%
- Mid-Size (5-20) : 7-15%
- Large Brokerage (20+) : 5-10%
- Virtual Brokerage : 15-25%
- Property Management : 10-15%

Commission rate historique : 5-6%, tendance à la baisse
Revenue mix : 75% ventes, 15-18% gestion locative
Taux de conversion leads→clients : 2-3%`,

  agriculture: `Benchmarks Agriculture (USDA ERS Mai 2026)

Net Farm Income 2026 : $153.4B (-0.7% vs 2025)
Net Cash Farm Income : $158.5B (+3% vs 2025)
Total farm debt : $624.7B (+5% YoY)
Dette/Actif ratio : 13.4%
Dette non-immobilière : +35% depuis 2020

Prix cultures 2025-2026 :
- Soja : $10.25/bushel
- Maïs : ~$4.50/bushel
- Blé hiver : 990M boisseaux (-29% vs 2025, sécheresse)

Marge nette agriculture (NYU Stern, cotées) : 5.25%
Exploitations indépendantes : marges 3-7%
Coûts intrants : +30% depuis 2020
Bétail : plus rentable que cultures en 2025-2026`,

  sante: `Benchmarks Santé & Médical (MGMA DataDive 15k+ groupes, HFMA)

Revenue cycle :
- Net Collection Rate target : > 96%
- Clean Claim Rate : > 90%
- Denial Rate : < 5%
- Days in A/R : < 35 jours

Marges par type de pratique :
- Primary Care : 15-20% (overhead 50-60%)
- Dental : 20-30% (overhead 45-55%)
- Dermatology : 25-35% (overhead 40-50%)
- Orthopedics : 15-25% (overhead 50-60%)
- Cardiology : 10-20% (overhead 55-65%)
- Behavioral Health : 15-25% (overhead 40-55%)
- Hospital systems : 2-6% (overhead 75-90%)

Operating margin hôpitaux : ~0.4% (Mai 2026)
Coûts opératoires : +11% YoY (MGMA 2025)
Taux de refus en hausse : 46% des cabinets voient une augmentation`,

  medical: `Benchmarks Santé & Médical (MGMA DataDive 15k+ groupes, HFMA)

Revenue cycle :
- Net Collection Rate target : > 96%
- Clean Claim Rate : > 90%
- Denial Rate : < 5%
- Days in A/R : < 35 jours

Marges par type de pratique :
- Primary Care : 15-20%
- Dental : 20-30%
- Dermatology : 25-35%
- Orthopedics : 15-25%
- Cardiology : 10-20%
- Behavioral Health : 15-25%
- Hospital systems : 2-6%

Operating margin hôpitaux : ~0.4% (Mai 2026)
Coûts opératoires : +11% YoY`,

  health: `Benchmarks Santé & Médical (MGMA DataDive 15k+ groupes, HFMA)

Revenue cycle :
- Net Collection Rate target : > 96%
- Clean Claim Rate : > 90%
- Denial Rate : < 5%
- Days in A/R : < 35 jours

Marges par type de pratique :
- Primary Care : 15-20%
- Dental : 20-30%
- Dermatology : 25-35%
- Orthopedics : 15-25%
- Cardiology : 10-20%
- Behavioral Health : 15-25%
- Hospital systems : 2-6%`,

  fintech: `Benchmarks Fintech (BCG/FT Partners 2026, McKinsey, Finro 416 companies)

Revenus globaux fintech : $504-650B
Croissance annuelle : 21-22%
% des revenus financiers totaux : 4%
Public fintech profitable : 74%
EBITDA margin public : 16-20%
Funding 2025 : $58B
Nombre de fintechs : ~37k (<100 captent 60% des revenus)

CAC par segment :
- SMB fintech : $1,000-1,500
- Consumer fintech : $50-200
- Enterprise fintech : $5,000-15,000

LTV:CAC target : > 3x, idéalement 5x+
Churn fintech : 10-25% annuel
Compliance cost : 10-20% du revenu
Multiples EV/Revenue : 3.7-7.4x (private), 4.7x median (public)`,

  greentech: `Benchmarks transverses — secteurs à haute marge (NYU Stern Damodaran Jan 2026)

Top 3 par marge nette : Software 25.5%, Tobacco 16.2%, Pharmaceuticals 15.2%
Médiane cross-industry : Gross Margin ~37%, Net Margin ~8.5%
Les sociétés privées ont 5-15 points de moins que les cotées
Une startup en amorçage est en dessous de toutes ces médianes
L'essentiel est la crédibilité du plan, pas d'atteindre les médianes immédiatement`,

  tech: `Benchmarks SaaS & Software (Bessemer BVP Cloud Index, ChartMogul, KeyBanc)

Stade Seed : MRR Growth 15-25%/mois, CAC $150-400, LTV:CAC 2-3:1, Churn 5-12%
Rule of 40 : croissance% + marge% > 40 vaut premium 2-3x
Marge brute target : 70-85%
CAC Payback < 12 mois sain
Croissance médiane 2026 : 26% annuel (vs 47% en 2024 — normalisation)`,

  ai: `Benchmarks SaaS & Software — segment AI (Bessemer BVP Cloud Index)

Croissance médiane 2026 : les sociétés AI-native ont des multiples plus élevés
Mais la profitabilité est exigée en 2026 — la croissance seule ne suffit plus
Marge brute SaaS AI : 60-80% (souvent plus basse que SaaS pur à cause des coûts d'inférence)
Churn AI : 5-15%/mois selon la dépendance au modèle`,

  marketplace: `Benchmarks Marketplace (publications BCG, a16z)

Commission rate : 10-25% selon la verticale
Gross Take Rate : 15-30%
CAC marketplace : très variable selon côté (demand vs supply)
Défi principal : résoudre le problème de la poule et de l'oeuf (liquidity)
Marge nette : -10% à +15% selon maturité`,
};

const CROSS_INDUSTRY = `Benchmarks transverses (NYU Stern Damodaran Jan 2026 — sociétés cotées US, 90+ secteurs)
Médiane cross-industry : Gross Margin ~37%, Net Margin ~8.5%, EBITDA/Sales ~18%
Top 3 marge nette : Software 25.5%, Pharmaceuticals 15.2%, Beverage (Soft) 13.4%
Les sociétés privées/startups ont 5-15 points de moins que les cotées
Un projet en amorçage est en dessous de toutes ces médianes — l'essentiel est la crédibilité du plan
Ne gonfle pas les scores. Un score de 50/100 = un projet sérieux mais perfectible.`;

export function getSectorKnowledge(sector: string | null | undefined): string {
  if (!sector) return `\nConnaissances sectorielles générales:\n${CROSS_INDUSTRY}`;
  const key = sector.toLowerCase().trim();
  // Direct match
  const direct = SECTOR_BENCHMARKS[key];
  if (direct) return `${direct}\n\n${CROSS_INDUSTRY}`;
  // Partial match — find first key contained in sector name
  for (const [k, v] of Object.entries(SECTOR_BENCHMARKS)) {
    if (key.includes(k) || k.includes(key)) return `${v}\n\n${CROSS_INDUSTRY}`;
  }
  return `\nConnaissances sectorielles générales:\n${CROSS_INDUSTRY}`;
}
