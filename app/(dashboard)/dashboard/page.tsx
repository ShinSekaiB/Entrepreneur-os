import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  let projectCount = 0;
  let projects: { id: string; name: string; createdAt: Date }[] = [];

  try {
    const user = await prisma.user?.findUnique?.({
      where: { id: session.user.id },
      include: {
        workspaces: {
          include: {
            workspace: {
              include: {
                projects: {
                  orderBy: { createdAt: "desc" },
                  take: 5,
                },
              },
            },
          },
        },
      },
    });

    if (user?.workspaces) {
      for (const membership of user.workspaces) {
        projectCount += membership.workspace.projects.length;
        projects = [
          ...projects,
          ...membership.workspace.projects.map((p) => ({
            id: p.id,
            name: p.name,
            createdAt: p.createdAt,
          })),
        ];
      }
      projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      projects = projects.slice(0, 5);
    }
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue{ session.user.name ? `, ${session.user.name}` : "" } sur votre espace Entrepreneur OS
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Projets</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Workspace</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{session.user.name?.[0]?.toUpperCase() ?? "?"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Statut</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">✓</p>
          </CardContent>
        </Card>
      </div>

      {projectCount > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Projets récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Bien démarrer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Créez votre premier projet pour débuter l&apos;analyse par l&apos;IA.
            </p>
            <Button asChild>
              <Link href="/projects/new">Créer un projet</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
