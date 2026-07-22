export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_ERROR",
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} introuvable`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non autorisé") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès refusé") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class AIError extends AppError {
  constructor(message: string, public retryable: boolean = true) {
    super(message, "AI_ERROR", 502);
    this.name = "AIError";
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("Limite de requêtes dépassée", "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: { message: error.message, code: error.code, details: error.details },
      status: error.status,
    };
  }
  console.error("Unhandled error:", error);
  return {
    error: { message: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
    status: 500,
  };
}
