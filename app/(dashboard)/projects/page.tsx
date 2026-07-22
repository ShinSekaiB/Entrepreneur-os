import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const projects = await prisma.project.findMany({
    where: {
      workspace: { members: { some: { userId: session.user.id } } },
    },
    include: { progress: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes projets</h1>
          <p className="text-muted-foreground">{projects.length} projet(s)</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">Nouveau projet</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Score: {project.score ?? "—"}</span>
                  <span>·</span>
                  <span>{project.stage}</span>
                </div>
                {project.progress && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${project.progress.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {projects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Aucun projet pour le moment</p>
              <Button asChild>
                <Link href="/projects/new">Créer mon premier projet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
