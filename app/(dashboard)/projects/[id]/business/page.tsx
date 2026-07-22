import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { BusinessForm } from "@/features/business/business-form";

export default async function BusinessQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: { businessData: true, workspace: { select: { id: true } } },
  });

  if (!project) notFound();

  const isMember = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId: session.user.id },
  });
  if (!isMember) redirect("/dashboard");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Architect</h1>
        <p className="text-muted-foreground">{project.name}</p>
      </div>
      <BusinessForm
        projectId={id}
        projectSector={project.sector}
        initialData={{
          problem: project.businessData?.problem,
          solution: project.businessData?.solution,
          targetCustomer: project.businessData?.targetCustomer,
          valueProposition: project.businessData?.valueProposition,
          businessModel: project.businessData?.businessModel,
        }}
      />
    </div>
  );
}
