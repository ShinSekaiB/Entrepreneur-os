import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/server/permissions";

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    const { name, sector, description } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Le nom du projet est requis" }, { status: 400 });
    }

    let workspace = await prisma.workspace.findFirst({
      where: { members: { some: { userId } } },
      orderBy: { createdAt: "asc" },
    });

    if (!workspace) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      workspace = await prisma.workspace.create({
        data: {
          name: `Espace de ${user?.name ?? "l'utilisateur"}`,
          ownerId: userId,
          members: { create: { userId, role: "OWNER" } },
        },
      });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        sector: sector?.trim() || null,
        description: description?.trim() || null,
        workspaceId: workspace.id,
        projectMemory: { create: {} },
        progress: { create: {} },
      },
    });

    return NextResponse.json({ id: project.id, name: project.name }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Create project error:", error);
    return NextResponse.json({ error: `Erreur lors de la création: ${message}` }, { status: 500 });
  }
}
