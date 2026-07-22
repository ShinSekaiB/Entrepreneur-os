"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email) return;
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre espace Entrepreneur OS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleEmailSignIn} disabled={loading}>
            {loading ? "Envoi..." : "Continuer par email"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          {process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID && (
            <Button className="w-full" variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
              Continuer avec Google
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href="/auth/register" className="text-primary hover:underline">
              S&apos;inscrire
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
