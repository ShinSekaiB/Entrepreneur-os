import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
  { href: "/projects", label: "Mes projets", icon: "☰" },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-64 border-r bg-card p-4 flex flex-col gap-2", className)}>
      <div className="mb-6 px-2">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          Entrepreneur OS
        </Link>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button key={item.href} variant="ghost" className="justify-start gap-3" asChild>
            <Link href={item.href}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
