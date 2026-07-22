import { prisma } from "@/lib/db";
import type { Message } from "@/types";
import { getSectorKnowledge } from "@/lib/ai/sector-knowledge";

export async function getProjectMemory(projectId: string) {
  const memory = await prisma.projectMemory.findUnique({ where: { projectId } });
  return {
    facts: memory?.facts as Record<string, unknown> ?? {},
    summary: memory?.summary ?? "",
  };
}

export async function getConversationHistory(projectId: string, limit: number = 20): Promise<Message[]> {
  const messages = await prisma.conversation.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
}

export async function buildContext(projectId: string): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { businessData: true, marketingData: true, projectMemory: true },
  });

  if (!project) return "";

  const parts: string[] = [];
  parts.push(`Projet: ${project.name}`);
  if (project.description) parts.push(`Description: ${project.description}`);
  if (project.sector) parts.push(`Secteur: ${project.sector}`);
  if (project.score) parts.push(`Score actuel: ${project.score}/100`);

  const biz = project.businessData;
  if (biz) {
    if (biz.problem) parts.push(`Problème: ${biz.problem}`);
    if (biz.solution) parts.push(`Solution: ${biz.solution}`);
    if (biz.targetCustomer) parts.push(`Cible: ${biz.targetCustomer}`);
    if (biz.valueProposition) parts.push(`Proposition valeur: ${biz.valueProposition}`);
    if (biz.businessModel) parts.push(`Modèle économique: ${biz.businessModel}`);
  }

  const mkt = project.marketingData;
  if (mkt) {
    if (mkt.positioning) parts.push(`Positionnement: ${mkt.positioning}`);
    if (mkt.brandTone) parts.push(`Ton de marque: ${mkt.brandTone}`);
  }

  const mem = project.projectMemory;
  if (mem?.summary) parts.push(`\nRésumé des échanges précédents:\n${mem.summary}`);

  const sectorKnowledge = getSectorKnowledge(project.sector);
  if (sectorKnowledge) parts.push(sectorKnowledge);

  return parts.join("\n");
}

export async function updateMemory(projectId: string, messages: Message[]) {
  const allContent = messages.map((m) => m.content).join(" ");
  const tokens = allContent.length / 4;

  if (tokens > 3000 || messages.length > 10) {
    const summary = await generateSummary(messages);
    await prisma.projectMemory.upsert({
      where: { projectId },
      update: { summary },
      create: { projectId, summary },
    });
  }
}

async function generateSummary(messages: Message[]): Promise<string> {
  const recent = messages.slice(-10);
  return recent
    .map((m) => `${m.role === "user" ? "👤" : "🤖"}: ${m.content.substring(0, 500)}`)
    .join("\n")
    .substring(0, 2000);
}
