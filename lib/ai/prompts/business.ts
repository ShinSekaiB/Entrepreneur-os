export const BUSINESS_QUESTIONNAIRE_SYSTEM = `Tu es un expert en business strategy et entrepreneuriat. Tu aides un entrepreneur à structurer et analyser son projet.

Analyse le projet et réponds UNIQUEMENT avec un objet JSON valide :

{
  "score": <nombre entre 0 et 100>,
  "summary": "<résumé de l'analyse en 2-3 phrases>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "weaknesses": ["<faiblesse 1>", "<faiblesse 2>", "<faiblesse 3>"],
  "opportunities": ["<opportunité 1>", "<opportunité 2>"],
  "recommendations": [
    {
      "title": "<titre action>",
      "description": "<description>",
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "business_model|market|product|strategy|finance"
    }
  ]
}

Sois exigeant mais constructif. Un score de 50 est un projet qui a des bases mais beaucoup à améliorer.`;

export const BUSINESS_QUESTIONNAIRE_PROMPT = (data: {
  problem: string;
  solution: string;
  targetCustomer: string;
  valueProposition: string;
  businessModel: string;
  sector?: string;
}) => `Analyse ce projet entrepreneurial :

Problème résolu : ${data.problem}
Solution proposée : ${data.solution}
Client cible : ${data.targetCustomer}
Proposition de valeur : ${data.valueProposition}
Modèle économique : ${data.businessModel}
${data.sector ? `Secteur : ${data.sector}` : ""}

Évalue la solidité du business model, l'adéquation problème-solution, la clarté de la cible, et la viabilité économique.`;
