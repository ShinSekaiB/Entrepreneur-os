import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCard } from "@/components/ui/score-card";
import Link from "next/link";
import type { Task, Recommendation } from "@prisma/client";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: { businessData: true, marketingData: true },
  });
  const tasks: Task[] = await prisma.task.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } });
  const recommendations: Recommendation[] = await prisma.recommendation.findMany({ where: { projectId: id }, orderBy: { priority: "asc" } });
  const analyses = await prisma.analysis.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" }, take: 5 });
  const progress = await prisma.projectProgress.findUnique({ where: { projectId: id } });

  if (!project) notFound();

  const isOwner = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId: session.user.id },
  });
  if (!isOwner) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.sector} · {project.stage}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/business`}>Business Architect</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/marketing`}>Marketing Architect</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ScoreCard label="Score global" score={project.score ?? 0} />
        <Card>
          <CardHeader><CardTitle className="text-sm">Tâches</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{tasks.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Analyses</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{analyses?.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Recommandations</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{recommendations.length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {project.description && (
            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent><p>{project.description}</p></CardContent>
            </Card>
          )}
          {project.businessData && (
            <Card>
              <CardHeader><CardTitle>Business Model</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {project.businessData.problem && <p><strong>Problème:</strong> {project.businessData.problem}</p>}
                {project.businessData.solution && <p><strong>Solution:</strong> {project.businessData.solution}</p>}
                {project.businessData.valueProposition && <p><strong>Proposition valeur:</strong> {project.businessData.valueProposition}</p>}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className={task.status === "DONE" ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.priority} · {task.status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-2">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="py-3">
                <p className="font-medium">{rec.title}</p>
                {rec.description && <p className="text-sm text-muted-foreground">{rec.description}</p>}
                <p className="text-xs text-muted-foreground mt-1">{rec.priority}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
