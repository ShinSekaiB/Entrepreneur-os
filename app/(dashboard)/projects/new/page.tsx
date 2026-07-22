"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewProjectPage() {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), sector: sector.trim(), description: description.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création");
        setLoading(false);
        return;
      }

      const project = await res.json();
      router.push(`/projects/${project.id}`);
    } catch {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

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
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet *</Label>
            <Input id="name" placeholder="Ex: EcoTrack" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Secteur d&apos;activité</Label>
            <Input id="sector" placeholder="Ex: Greentech, SaaS, E-commerce..." value={sector} onChange={(e) => setSector(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description courte</Label>
            <textarea
              id="description"
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Décrivez votre projet en quelques phrases..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Création en cours..." : "Créer le projet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
