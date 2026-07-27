export type Role = "Teacher" | "Student" | string;

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export type AuthResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  role: Role;
  accessToken: string;
  expiresAtUtc: string;
};

/**
 * Generic shape for API errors. Adjust field names here if your friend's
 * error responses look different (e.g. { error: "..." } or ASP.NET's default
 * ProblemDetails shape with a "title"/"errors" object) — everything that
 * reads errors goes through getErrorMessage() below, so you only have to fix
 * it in one place.
 */
export type ApiErrorBody = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
