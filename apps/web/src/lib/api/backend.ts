import "server-only";
import { cookies } from "next/headers";

/**
 * Get backend base URL from environment
 */
export function getBackendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
  }
  return url;
}

/**
 * Get auth token from cookies (vibaro_token)
 */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("vibaro_token");
  return tokenCookie?.value || null;
}

/**
 * Fetch helper for backend API calls (server-side only)
 * Automatically adds Authorization header if token exists
 */
export async function backendFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const baseUrl = getBackendBaseUrl();
  const token = await getTokenFromCookies();

  const headers = new Headers(init?.headers || {});

  // Add Authorization if token exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Add Content-Type if body exists and not already set (but NOT for FormData)
  if (init?.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${baseUrl}${path}`;

  return fetch(url, {
    ...init,
    headers,
  });
}
