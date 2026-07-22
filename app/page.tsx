import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">Entrepreneur OS</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg">
        Votre architecte IA pour structurer, analyser et accélérer votre projet entrepreneurial.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/auth/login">Commencer</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/auth/register">Créer un compte</Link>
        </Button>
      </div>
    </div>
  );
}
