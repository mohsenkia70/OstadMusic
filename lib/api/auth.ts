import { apiRequest } from "./client";
import type { AuthResponse, LoginRequest } from "./types";

export function loginRequest(credentials: LoginRequest) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false, // no token exists yet — this call gets us one
  });
}
