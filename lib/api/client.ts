import { API_BASE_URL } from "./config";
import { ApiError, type ApiErrorBody } from "./types";
import { useAuthStore } from "@/lib/store/auth-store";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Set to false for endpoints that don't need the Authorization header (e.g. login). */
  auth?: boolean;
};

function extractErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === "object") {
    const b = body as ApiErrorBody;
    if (b.message) return b.message;
    if (b.title) return b.title;
    if (b.errors) {
      const first = Object.values(b.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
    }
  }
  if (typeof body === "string" && body.trim().length > 0) return body;
  if (status === 401) return "ایمیل/موبایل یا رمز عبور اشتباه است.";
  if (status === 404) return "منبع موردنظر پیدا نشد.";
  if (status >= 500) return "خطایی در سرور رخ داد. کمی بعد دوباره تلاش کن.";
  return "خطایی رخ داد. لطفاً دوباره تلاش کن.";
}

/**
 * Generic API request helper — use this for ANY endpoint your friend's backend
 * exposes, not just auth. It automatically:
 *   - prefixes the path with API_BASE_URL
 *   - serializes `body` as JSON and sets the right headers
 *   - attaches `Authorization: Bearer <token>` from the auth store (unless `auth: false`)
 *   - parses the JSON response and throws a typed ApiError on failure
 *
 * Example:
 *   const teachers = await apiRequest<TeacherDto[]>("/teachers");
 *   const created = await apiRequest<BookingDto>("/bookings", { method: "POST", body: { teacherId } });
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("اتصال به سرور برقرار نشد. اینترنت یا آدرس API را بررسی کن.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(response.status, payload), response.status, payload);
  }

  // Handle 204 No Content and similar empty-but-ok responses
  return payload as T;
}
