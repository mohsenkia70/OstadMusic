import { API_BASE_URL } from "./config";
import { ApiError, type ApiErrorBody } from "./types";
import { useAuthStore } from "@/lib/store/auth-store";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
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
  if (status === 403) return "شما دسترسی به این بخش را ندارید.";
  if (status === 404) return "منبع موردنظر پیدا نشد.";
  if (status >= 500) return "خطایی در سرور رخ داد. کمی بعد دوباره تلاش کن.";
  return "خطایی رخ داد. لطفاً دوباره تلاش کن.";
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
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
    throw new ApiError(
      "اتصال به سرور برقرار نشد. اینترنت یا آدرس API را بررسی کن.",
      0
    );
  }

  // ✅ اگه 401 گرفتیم و auth=true بود، یعنی توکن expire شده
  // کاربر رو logout کن
  if (response.status === 401 && auth) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("نشست شما منقضی شده. لطفاً دوباره وارد شوید.", 401);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(response.status, payload),
      response.status,
      payload
    );
  }

  return payload as T;
}