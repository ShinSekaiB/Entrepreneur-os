import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number;
  className?: string;
}

export function ScoreCard({ label, score, className }: ScoreCardProps) {
  const color = score >= 80 ? "border-green-500" : score >= 60 ? "border-yellow-500" : "border-red-500";
  const bg = score >= 80 ? "bg-green-50 dark:bg-green-950" : score >= 60 ? "bg-yellow-50 dark:bg-yellow-950" : "bg-red-50 dark:bg-red-950";

  return (
    <div className={cn("rounded-xl border-l-4 p-4", color, bg, className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{score}/100</p>
    </div>
  );
}
