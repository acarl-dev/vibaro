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

  // Always request JSON from Laravel
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Add Authorization if token exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Add Content-Type if body exists and not already set (but NOT for FormData or streams with explicit Content-Type)
  if (
    init?.body &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${baseUrl}${path}`;

  return fetch(url, {
    ...init,
    headers,
  });
}

/**
 * Get the current user's artist page ID.
 * Throws if the user is unauthenticated or has no artist page.
 */
export async function getMyArtistPageId(): Promise<number> {
  const response = await backendFetch("/api/v1/artist-pages/me");

  if (!response.ok) {
    throw new Error(`Failed to fetch artist page: ${response.status}`);
  }

  const json = await response.json();
  const id = json?.data?.id;

  if (!id) {
    throw new Error("Artist page ID not found");
  }

  return id;
}
