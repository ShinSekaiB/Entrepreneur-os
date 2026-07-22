import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { MarketingForm } from "@/features/marketing/marketing-form";

export default async function MarketingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: { marketingData: true },
  });

  if (!project) notFound();

  const isMember = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId: session.user.id },
  });
  if (!isMember) redirect("/dashboard");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing Architect</h1>
        <p className="text-muted-foreground">{project.name}</p>
      </div>
      <MarketingForm
        projectId={id}
        projectName={project.name}
        projectDescription={project.description}
        initialData={{
          audience: project.marketingData?.audience as string[] | undefined,
          brandTone: project.marketingData?.brandTone ?? undefined,
        }}
      />
    </div>
  );
}
