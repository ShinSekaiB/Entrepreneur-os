import type { Project, Analysis, Recommendation, Task, BusinessData, MarketingData } from "@prisma/client";

export type ProjectWithRelations = Project & {
  businessData: BusinessData | null;
  marketingData: MarketingData | null;
  analyses: Analysis[];
  recommendations: Recommendation[];
  tasks: Task[];
};

export type AnalysisResult = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: {
    title: string;
    description: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    category: string;
  }[];
};

export type AIStreamCallbacks = {
  onToken: (token: string) => void;
  onComplete: (full: string) => void;
  onError: (error: Error) => void;
};

export type Message = {
  role: "user" | "assistant";
  content: string;
};
