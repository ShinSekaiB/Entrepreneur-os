export const MARKETING_QUESTIONNAIRE_SYSTEM = `Tu es un expert en marketing digital et stratégie de marque.

Analyse le projet et réponds UNIQUEMENT avec un objet JSON valide :

{
  "score": <nombre entre 0 et 100>,
  "positioning": "<positionnement recommandé en 2-3 phrases>",
  "summary": "<résumé analyse marketing>",
  "persona": {
    "name": "<nom fictif>",
    "age": "<âge>",
    "profession": "<profession>",
    "painPoints": ["<point douleur 1>", "<point douleur 2>"],
    "goals": ["<objectif 1>", "<objectif 2>"],
    "channels": ["<canal 1>", "<canal 2>"]
  },
  "recommendations": [
    {
      "title": "<titre action>",
      "description": "<description>",
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "positioning|acquisition|brand|content"
    }
  ]
}`;

export const MARKETING_QUESTIONNAIRE_PROMPT = (data: {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  competitors: string;
  brandTone?: string;
}) => `Analyse marketing pour le projet suivant :

Nom du projet : ${data.projectName}
Description : ${data.projectDescription}
Audience cible : ${data.targetAudience}
Concurrents : ${data.competitors}
${data.brandTone ? `Ton de marque souhaité : ${data.brandTone}` : ""}

Définis un positionnement marketing, un persona détaillé et une stratégie d'acquisition.`;
