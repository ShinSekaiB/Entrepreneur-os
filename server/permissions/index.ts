import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ForbiddenError, UnauthorizedError, NotFoundError } from "@/server/errors";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user.id;
}

export async function verifyProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      workspace: {
        select: {
          members: { where: { userId }, select: { id: true } },
        },
      },
    },
  });

  if (!project) throw new NotFoundError("Projet");
  if (project.workspace.members.length === 0) throw new ForbiddenError();

  return project;
}

export async function requireProjectAccess(projectId: string) {
  const userId = await requireAuth();
  return verifyProjectAccess(projectId, userId);
}

export async function verifyWorkspaceAccess(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });

  if (!member) throw new ForbiddenError();
  return member;
}
