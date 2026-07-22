import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/server/permissions";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    if (!projectId || !type) {
      return NextResponse.json({ error: "projectId et type requis" }, { status: 400 });
    }

    const analysis = await prisma.analysis.findFirst({
      where: { projectId, type: type as "BUSINESS" | "MARKETING" | "REALISATION" | "FINAL" },
      include: { recommendations: true },
      orderBy: { createdAt: "desc" },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analyse introuvable" }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
