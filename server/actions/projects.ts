import "server-only";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/server/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1, "Nom requis").max(200),
  description: z.string().max(2000).optional(),
  sector: z.string().max(100).optional(),
  stage: z.enum(["IDEA", "VALIDATION", "PREPARATION", "LAUNCH", "GROWTH", "ACTIVE"]).optional(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>, workspaceId: string) {
  const userId = await requireAuth();
  const parsed = createProjectSchema.parse(data);

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  if (!member) throw new Error("Accès refusé");

  const project = await prisma.project.create({
    data: {
      ...parsed,
      workspaceId,
      projectMemory: { create: {} },
      progress: { create: {} },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return project;
}

const updateBusinessDataSchema = z.object({
  problem: z.string().optional(),
  solution: z.string().optional(),
  targetCustomer: z.string().optional(),
  valueProposition: z.string().optional(),
  businessModel: z.string().optional(),
  revenueSources: z.string().optional(),
  competitors: z.array(z.string()).optional(),
});

export async function updateBusinessData(projectId: string, data: z.infer<typeof updateBusinessDataSchema>) {
  const userId = await requireAuth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  if (!project) throw new Error("Projet introuvable");

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
  });
  if (!member) throw new Error("Accès refusé");

  const parsed = updateBusinessDataSchema.parse(data);

  const businessData = await prisma.businessData.upsert({
    where: { projectId },
    update: parsed,
    create: { projectId, ...parsed },
  });

  revalidatePath(`/projects/${projectId}`);
  return businessData;
}

const updateMarketingDataSchema = z.object({
  positioning: z.string().optional(),
  audience: z.array(z.string()).optional(),
  persona: z.any().optional(),
  brandTone: z.string().optional(),
  channels: z.array(z.string()).optional(),
  strategy: z.any().optional(),
  contentPlan: z.any().optional(),
});

export async function updateMarketingData(projectId: string, data: z.infer<typeof updateMarketingDataSchema>) {
  const userId = await requireAuth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  if (!project) throw new Error("Projet introuvable");

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
  });
  if (!member) throw new Error("Accès refusé");

  const parsed = updateMarketingDataSchema.parse(data);

  const marketingData = await prisma.marketingData.upsert({
    where: { projectId },
    update: parsed,
    create: { projectId, ...parsed },
  });

  revalidatePath(`/projects/${projectId}`);
  return marketingData;
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!task) throw new Error("Tâche introuvable");

  const userId = await requireAuth();
  const project = await prisma.project.findUnique({ where: { id: task.projectId }, select: { workspaceId: true } });
  if (!project) throw new Error("Projet introuvable");

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
  });
  if (!member) throw new Error("Accès refusé");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status, completedAt: status === "DONE" ? new Date() : null },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return updated;
}
