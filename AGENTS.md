<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sector-knowledge -->
# Connaissances Sectorielles & Benchmarks

Ce fichier est lu automatiquement à chaque conversation. AVANT chaque analyse IA, consulte la section correspondant au secteur du projet. Utilise ces benchmarks pour justifier les scores. Cite les fourchettes et les sources.

## Règles globales
- Ne gonfle pas les scores. Un score de 50 = un projet vraiment moyen.
- Si l'utilisateur donne < 50 mots par champ de formulaire, pénalise le score et mentionne-le dans les faiblesses.
- Les benchmarks viennent de sociétés cotées ou d'enquêtes à grande échelle. Les PME/startups sont souvent en dessous — ajuste en conséquence.
- Pour les documents uploadés (RAG) : le contenu des documents prime sur les benchmarks génériques quand l'utilisateur fournit ses propres chiffres.

### Grille de notation (applique-la STRICTEMENT)
- 81-100 : Excellent — plan complet, chiffres crédibles, aligné aux benchmarks sectoriels
- 61-80 : Bon — bases solides, quelques lacunes, potentiel clair
- 41-60 : Passable — idée intéressante, lacunes notables sur 2+ dimensions
- 21-40 : Faible — problème ou solution flous, pas de marché clair
- 0-20 : Insuffisant — retour à la planche à dessin

---

## 1. SaaS & Software

Sources : Bessemer BVP Cloud Index, Stripe, ChartMogul (2500+ co), KeyBanc/Sapphire, Benchmarkit (1500+ co), PMToolkit

### Benchmarks par stade
| Stade | MRR Growth | CAC | LTV:CAC | Churn/mois | NRR | Gross Margin |
|---|---|---|---|---|---|---|
| Seed | 15-25% MoM | $150-400 | 2-3:1 | 5-12% | 80-95% | 70-80% |
| Series A | 10-20% MoM | $300-700 | 3-4:1 | 3-8% | 90-105% | 70-80% |
| Series B | 5-15% MoM | $500-1k | 3-5:1 | 2-5% | 100-115% | 70-80% |
| Growth ($20-100M ARR) | 3-8% MoM | $600-1.5k | 4-6:1 | 1-3% | 105-125% | 70-80% |
| Scale ($100M+ ARR) | 1-5% MoM | $800-2.5k | 4-6:1 | 0.5-2% | 110-130% | 70-80% |

### CAC par segment
| Segment | CAC médian | 25e pct | 75e pct |
|---|---|---|---|
| SMB (<$10K ACV) | $4,800 | $2,500 | $8,200 |
| Mid-Market ($10-100K) | $18,000 | $12,000 | $28,000 |
| Enterprise (>$100K) | $67,000 | $42,000 | $120,000 |
| PLG / Self-Serve | $1,200 | $650 | $2,800 |

### Règles de base
- CAC Payback < 12 mois = sain | > 18 mois = alarme
- LTV:CAC < 3:1 = unsustainable
- Churn > 5%/mois en SMB = fatal sans expansion revenue
- NRR < 100% = la base existante rétrécit
- NRR > 120% = premium de valorisation 2x
- Rule of 40 : croissance % + marge % > 40 (vaut premium 2-3x sur multiple)
- Marge brute target : 70-85%
- Croissance médiane 2026 : 26% annuel (vs 47% en 2024 — normalisation)

---

## 2. E-commerce & Retail

Sources : Littledata (15k+ Shopify/Woo), IRP Commerce, Statista, Dynamic Yield (200M+ users/mois), Triple Whale (30k+ marques), Eightx, ConversionStudio, Shopify Commerce Trends

### Conversion rate par industrie
| Vertical | CVR moyen | Top 10% | AOV médian |
|---|---|---|---|
| Food & Beverage | 4.9-6.2% | 5.8% | $45-55 |
| Health & Beauty | 2.4% | 5.1% | $60-80 |
| Fashion & Apparel | 1.8% | 4.2% | $75-100 |
| Home & Garden | 1.8% | 3.6% | $120-180 |
| Electronics | 1.1-1.4% | 3.4% | $200-400 |
| Jewelry & Luxury | 0.9% | 2.3% | $300-800 |
| B2B Services | 4.8% | 11.2% | — |
| **Cross-industry** | **2.5-3.0%** | **> 3.2%** | **$128-180** |

### Marges DTC par vertical
| Vertical | Gross Margin (CM1) | CM2 (après fulfillment) | CM3 (après acquisition) |
|---|---|---|---|
| Beauty & Skincare | 65-85% | 52-70% | 25-40% |
| Supplements | 65-78% | 50-63% | 22-35% |
| Apparel | 50-65% | 38-50% | 15-25% |
| Food & Beverage | 40-55% | 30-42% | 12-22% |

### Règles de base
- CPA Meta médian 2025 : $32.74 (+8.6% YoY)
- AOV moyen cross-industry : $128-180 (2026)
- Taux d'abandon panier : ~70%
- Seuil de viabilité DTC 2026 : CM1 > 40% (en dessous = financièrement fragile)
- Profitabilité nette : 5-15% du revenu selon vertical
- CAC payback e-commerce : < 6 mois idéal, < 12 mois acceptable

---

## 3. Restauration & Food & Beverage

Sources : National Restaurant Association (State of the Industry 2026), BLS, Census Bureau CBP (618k établissements), CostLab, WhippleWood, VantaInsights, Baker Tilly

### Benchmarks par concept
| Métrique | QSR | Fast Casual | Casual Dining | Fine Dining | Bar/Gastropub |
|---|---|---|---|---|---|---|
| Food Cost % | 28-32% | 28-33% | 28-34% | 25-35% | 22-28% |
| Labor Cost % | 25-35% | 28-33% | 30-35% | 30-35% | 28-35% |
| Prime Cost | 55-60% | 58-63% | 60-65% | 55-65% | 55-63% |
| Rent % | 6-10% | 7-10% | 5-10% | 5-9% | 5-10% |
| Net Profit % | 6-9% | 6-9% | 3-8% | 5-10% | 7-12% |

### Règles de base
- Prime cost (food + labor) doit rester < 65% du revenu. Au-dessus = marges trop fines.
- Food cost hors boissons : 28-35% selon concept
- Beverage cost (alcool) : 22-28% (marges plus élevées que food)
- Marge nette indépendants : en bas de la fourchette. Chaînes : en haut.
- Seuil de rentabilité : taux d'occupation > 60-70%
- Ticket moyen (average cover) : variable selon concept
- Rotation des tables : 2-4x pour QSR, 1-2x pour casual dining

---

## 4. Manufacturing

Sources : NYU Stern Damodaran (27 sous-secteurs manufacturing, Jan 2026), BLS, Federal Reserve, CFMA, Census Bureau ASM, RMA Annual Statement Studies

### Marges par sous-secteur manufacturing
| Sous-secteur | Gross Margin | EBITDA/Sales | Net Margin | CapEx/Sales |
|---|---|---|---|---|
| Pharmaceuticals | 65.3% | 35.4% | 15.2% | 4.3% |
| Semiconductors | 56.2% | 37.0% | 30.5% | 19.1% |
| Medical Devices | 55.0% | 24.0% | 12.0% | 3.5% |
| Specialty Chemicals | 33.1% | 16.2% | 10.9% | 4.8% |
| Machinery | 32.5% | 17.3% | 8.5% | 2.9% |
| Aerospace/Defense | 17.5% | 10.7% | 5.0% | 2.8% |
| Construction Supplies | 25.4% | 14.5% | 10.2% | 6.6% |
| Electronics | 32.0% | 15.0% | 9.8% | 5.7% |
| Auto Parts | 15.8% | 9.0% | 1.6% | 3.8% |
| Basic Chemicals | 13.8% | 8.2% | 3.5% | 4.5% |
| Automobile | 10.4% | 7.5% | 1.3% | 3.0% |
| Furniture | 28.0% | 8.0% | 3.2% | 5.9% |
| **Médiane manufacturing** | **33.6%** | **18.3%** | **7.2%** | **4.3%** |

### Règles de base
- Les marges privées sont 5-15 points en dessous des cotées (manque d'échelle, moins de pricing power)
- Labor = 30-50% du coût projet
- Materials = 30-40% du coût projet
- Overhead manufacturing : 15-25% du revenu
- Working capital intensif : DSO, DPO, DIO à surveiller
- CapEx cyclique : 4% médian, mais peut atteindre 19% (semi-conducteurs)

---

## 5. Construction

Sources : CFMA Financial Benchmarker (2025), Autodesk, Projul, VantaInsights, Foundation Software, Project Metrics Hub, JMCO

### Marges par métier
| Trade | Gross Margin | Net Margin | Overhead |
|---|---|---|---|
| General Contractor (Residential) | 25-35% | 8-15% | 8-12% |
| General Contractor (Commercial) | 15-25% | 5-10% | 8-12% |
| Electrical | 35-50% | 10-18% | 10-15% |
| Plumbing | 35-55% | 10-20% | 10-15% |
| HVAC | 30-45% | 8-15% | 10-15% |
| Specialty Trades (CFMA 2025) | 22.4% | 7.7% | 8-15% |

### Règles de base
- Marge nette moyenne générale : 5-8%
- Revenue/ET : $320k (CFMA 2025)
- Current ratio target : > 2.0 (bonding : > 1.5)
- DSO target : < 35 jours (<=50 acceptable, > 70 critique)
- Overhead : 8-15% du revenu (GC 8-12%, specialty 10-15%)
- Labor = 30-50% du coût projet
- Materials = 30-40% du coût projet
- Les métiers avec service/maintenance (plomberie, elec, HVAC) ont des marges plus hautes
- Le résidentiel est plus fragmenté (212k établissements, < 5 employés)

---

## 6. Immobilier & Real Estate

Sources : NAR, Federal Reserve, AccountTECH Gross Margin Index, PrepMyBook, BusinessDojo, Brokurz, VantaInsights

### Marges par type d'agence
| Type | Net Margin | Commission split | Notes |
|---|---|---|---|
| Solo Agent | 20-40% | 90/10 – 100/0 | Overhead minimal, home office |
| Small Agency (<5 agents) | 10-20% | 80/20 – 90/10 | Structure légère |
| Mid-Size (5-20 agents) | 7-15% | 70/30 – 80/20 | Frais fixes + marketing |
| Large Brokerage (20+ agents) | 5-10% | 50/50 – 70/30 | Franchise fees, overhead élevé |
| Virtual Brokerage | 15-25% | 85/15 – 95/5 | 35-45% pour top performers |
| Property Management | 10-15% | N/A | Revenu récurrent, coûts maintenance |

### Règles de base
- Commission rate : 5-6% historique, tendance à la baisse
- Revenue mix : 75% commissions ventes, 15-18% gestion locative, solde services annexes
- Wages ratio (commissions + staff) : 45-55% du revenue brut
- Objectif : les revenus de property management devraient couvrir 100% des frais fixes
- Taux de conversion leads → clients : 2-3%
- Marge nette brokerage : 5-15% (top performers 30-45%)
- Marché US : ~2M agents, ~100k agences

---

## 7. Agriculture

Sources : USDA ERS (Farm Sector Income Forecast, Mai 2026), USDA NASS, USDA Census of Agriculture, DTN/AgWeek

### Chiffres clés 2026
| Métrique | Valeur | Évolution |
|---|---|---|
| Net Farm Income | $153.4B | -0.7% vs 2025 |
| Net Cash Farm Income | $158.5B | +3% vs 2025 |
| Total farm debt | $624.7B | +5% YoY |
| Dette/Actif ratio | 13.4% | Hausse lente |
| Dette non-immobilière | +35% depuis 2020 | Hausse significative |

### Prix cultures (saison 2025-2026)
| Culture | Prix/bushel | Tendances |
|---|---|---|
| Soja | $10.25 | Demande biofuel soutenue |
| Maïs | ~$4.50 | Rendements en hausse |
| Blé hiver | 990M boisseaux | -29% vs 2025 (sécheresse) |

### Règles de base
- Marge nette agriculture NYU Stern : 5.25% (entreprises cotées)
- Exploitations indépendantes : marges plus serrées (3-7%)
- Coûts intrants : +30% depuis 2020 (engrais, fuel, semences)
- Bétail : plus rentable que cultures en 2025-2026 (prix aliments bas)
- Subventions gouvernementales : impact significatif sur le NFI
- Ratio endettement : reste bas historiquement mais en hausse depuis 2022

---

## 8. Santé & Médical

Sources : MGMA DataDive (15k+ groupes), HFMA, CMS, Strata Decision Technology, AMGA, Change Healthcare, Tebra

### Benchmarks revenue cycle
| Métrique | Target | Warning | Critique |
|---|---|---|---|
| Net Collection Rate (NCR) | > 96% | 90-95% | < 90% |
| Gross Collection Rate (GCR) | > 95% | 85-94% | < 85% |
| Clean Claim Rate | > 90% | 80-89% | < 80% |
| Denial Rate | < 5% | 8-12% | > 12% |
| Days in A/R | < 35 | 35-50 | > 50 |
| Premier pass resolution | > 90% | — | — |

### Marges par type de pratique
| Type | Net Margin | Overhead | Notes |
|---|---|---|---|
| Primary Care | 15-20% | 50-60% | Volume élevé, reimbursement modéré |
| Dental | 20-30% | 45-55% | Faible insurance overhead |
| Dermatology | 25-35% | 40-50% | Procédures électives, bons taux |
| Orthopedics | 15-25% | 50-60% | Procédures high-cost |
| Cardiology | 10-20% | 55-65% | Dépend du payer mix |
| Behavioral Health | 15-25% | 40-55% | Faible overhead admin |
| Hospital systems | 2-6% | 75-90% | Marges très serrées |
| Multi-specialty | 10-15% | 55-65% | Economies d'échelle |

### Règles de base
- Operating margin hôpitaux : ~0.4% (Mai 2026) — historiquement bas
- Coûts opératoires : +11% YoY (MGMA 2025), 9/10 groupes en hausse
- Écart rémunération/collections : +27.7% comp vs +11.3% collections (16pt gap, AMGA)
- Medicare/Medicaid rembourse moins que le coût de service
- Taux de refus (denials) en hausse : 46% des cabinets voient une augmentation

---

## 9. Fintech

Sources : BCG/FT Partners Global Fintech Report 2026, McKinsey (Avril 2026), PitchBook, Finro (416 companies, 9 niches), BusinessDojo

### Benchmarks globaux
| Métrique | Valeur | Source |
|---|---|---|
| Revenus globaux fintech | $504-650B (selon périmètre) | BCG/McKinsey 2026 |
| Croissance annuelle | 21-22% | BCG/McKinsey |
| % des revenus financiers totaux | 4% | McKinsey |
| Public fintech profitable | 74% | BCG |
| EBITDA margin public | 16-20% | BCG |
| Funding 2025 | $58B | BCG |
| Nombre de fintechs | ~37k (dont < 100 captent 60% revenus) | BusinessDojo |

### CAC par segment
| Segment | CAC |
|---|---|
| SMB fintech | $1,000-1,500 |
| Consumer fintech | $50-200 |
| Enterprise fintech | $5,000-15,000 |

### Règles de base
- LTV:CAC target : > 3x, idéalement 5x+
- Churn fintech : 10-25% annuel selon produit
- Compliance cost : 10-20% du revenu (plus élevé en payments et lending)
- Coût d'acquisition règlementaire : KYC/AML = 15-25% des opex
- Multiples EV/Revenue : 3.7-7.4x (private), 4.7x median (public, -26% vs peak 2021)
- Cross-sell : levier #1 de profitabilité (multi-produit)
- Payments : plus forte marge mais plus régulé
- Lending : cyclique, dépend du credit risk

---

## 10. Datasets NYU Stern Damodaran (Janvier 2026) — Vue transverse

Source : Aswath Damodaran, NYU Stern — Margins by Sector US. Données des sociétés cotées SEC. **90+ secteurs disponibles.**

### Top 10 par marge nette
| Secteur | Gross Margin | Net Margin | EBITDA/Sales |
|---|---|---|---|
| Bank (Money Center) | 100% | 28.89% | — |
| Regional Banks | 99.36% | 27.49% | — |
| Software (System & App) | 71.72% | 25.49% | 29.27% |
| Computers/Peripherals | 37.54% | 17.47% | 20.17% |
| Tobacco | 63.15% | 16.15% | 31.38% |
| Diversified | 28.22% | 15.84% | 20.46% |
| Pharmaceuticals | 65.26% | 15.20% | 35.39% |
| Beverage (Soft) | 54.52% | 13.40% | 22.78% |
| Brokerage & Investment Banking | 62.06% | 12.44% | 12.24% |
| Healthcare Products | 55.11% | 12.10% | 20.16% |

### Bottom 10 par marge nette
| Secteur | Gross Margin | Net Margin |
|---|---|---|
| Real Estate Development | 45.00% | -16.35% |
| Drugs (Biotechnology) | 56.37% | -11.88% |
| Electronics (Consumer) | 18.87% | -6.26% |
| Coal & Related Energy | 34.60% | -5.24% |
| Broadcasting | 38.57% | -1.41% |
| Chemical (Diversified) | 18.18% | -1.01% |
| Advertising | 36.24% | -0.30% |
| Publishing | 42.23% | -0.18% |
| Insurance (Prop/Cas) | 22.30% | 0.00% |
| Reinsurance | 17.82% | 0.00% |

### Règles transverses
- Marge brute cross-industry médiane : ~37% | Marge nette médiane : ~8.5%
- Les sociétés privées ont 5-15 points de moins que les cotées
- Le multiple EV/Revenue dépend du NRR et du Rule of 40 (SaaS) ou de la marge EBITDA
- La croissance seule ne suffit plus en 2026 : la profitabilité est exigée

<!-- BEGIN:rag-instructions -->
## RAG — Documents utilisateur uploadés

Quand l'utilisateur a uploadé des documents (business plan PDF, étude de marché, prévisions financières) :

1. Le système a déjà parsé, chunké, et embeddiné les documents dans pgvector
2. Les 5 passages les plus pertinents sont injectés dans le prompt sous la section "Documents du projet"
3. **Le contenu des documents prime sur les benchmarks génériques** quand l'utilisateur fournit ses propres chiffres
4. Si les documents contiennent des données financières précises, utilise-les comme base d'évaluation plutôt que les moyennes sectorielles
5. Si les documents manquent de détails ou sont trop vagues, mentionne-le dans l'analyse
<!-- END:rag-instructions -->

<!-- BEGIN:prompt-instructions -->
## Instructions pour la construction des prompts

1. **System prompt** : utilise les fichiers dans `lib/ai/prompts/` (ils contiennent déjà `BRUTAL_TRUTH` + la grille)
2. **User prompt** : chaque formulaire appelle la fonction correspondante (`BUSINESS_QUESTIONNAIRE_PROMPT`, etc.)
3. **Context** : `buildContext()` injecte les données du projet (nom, description, secteur, analyses précédentes)
4. **Knowledge** : les fiches sectorielles sont injectées automatiquement selon le secteur du projet
5. **Cache** : les résultats sont mis en cache, une nouvelle analyse = appeler sans cache
6. **Score validation** : tous les scores sont clampés 0-100 et arrondis par `clampScores()` dans l'API
7. **Version tracking** : chaque analyse a `_scoreVersion: "v2-brutal-truth"` dans son JSON
<!-- END:prompt-instructions -->
<!-- END:sector-knowledge -->
