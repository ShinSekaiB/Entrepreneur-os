import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau projet</h1>
        <p className="text-muted-foreground">Décrivez votre projet pour commencer l&apos;analyse</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du projet</CardTitle>
          <CardDescription>Ces informations permettront à l&apos;IA de comprendre votre projet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet *</Label>
            <Input id="name" placeholder="Ex: EcoTrack" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Secteur d&apos;activité</Label>
            <Input id="sector" placeholder="Ex: Greentech, SaaS, E-commerce..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description courte</Label>
            <textarea
              id="description"
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Décrivez votre projet en quelques phrases..."
            />
          </div>
          <Button className="w-full">Créer le projet</Button>
        </CardContent>
      </Card>
    </div>
  );
}
