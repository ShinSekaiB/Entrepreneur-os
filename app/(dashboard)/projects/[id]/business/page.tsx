import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { BusinessForm } from "@/features/business/business-form";
import { FormAssistant } from "@/components/forms/form-assistant";

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
    <div className="flex gap-6">
      <FormAssistant
        projectId={id}
        projectName={project.name}
        projectSector={project.sector}
        projectDescription={project.description}
        type="business"
      />
      <div className="flex-1 min-w-0 space-y-6">
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
    </div>
  );
}
