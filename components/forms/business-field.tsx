"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BusinessFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  subQuestions?: string[];
  examples?: string[];
  placeholder?: string;
  required?: boolean;
  minWords?: number;
  rows?: number;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function BusinessField({
  id,
  label,
  value,
  onChange,
  subQuestions = [],
  examples = [],
  placeholder,
  required = false,
  minWords = 50,
  rows = 3,
}: BusinessFieldProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const wordCount = countWords(value);
  const progressPct = Math.min(100, Math.round((wordCount / minWords) * 100));
  const isGood = wordCount >= minWords;
  const isWarning = wordCount >= minWords * 0.5 && wordCount < minWords;
  const isBad = wordCount < minWords * 0.5;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {examples.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setHelpOpen(!helpOpen)}
          >
            {helpOpen ? "✕" : "💡 Aide"}
          </Button>
        )}
      </div>

      {helpOpen && (
        <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-3 border">
          {subQuestions.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Questions pour vous guider :</p>
              <ul className="list-disc list-inside space-y-0.5">
                {subQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
          {examples.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Exemple de réponse :</p>
              {examples.map((ex, i) => (
                <p key={i} className="italic bg-background rounded px-2 py-1">&ldquo;{ex}&rdquo;</p>
              ))}
            </div>
          )}
        </div>
      )}

      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        required={required}
        aria-describedby={helpOpen ? `${id}-help` : undefined}
      />

      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex-1">
          <Progress
            value={progressPct}
            className={cn(
              "h-1.5",
              isGood && "bg-green-200",
              isWarning && "bg-yellow-200",
              isBad && "bg-red-200"
            )}
          />
        </div>
        <span
          className={cn(
            "shrink-0 tabular-nums",
            isGood && "text-green-600",
            isWarning && "text-yellow-600",
            isBad && "text-red-500"
          )}
        >
          {wordCount} / {minWords} mots
        </span>
        <span className="shrink-0 tabular-nums">{value.length} car.</span>
      </div>
    </div>
  );
}
