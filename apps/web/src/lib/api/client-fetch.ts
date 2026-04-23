/**
 * Client-side fetch wrapper for authenticated studio/onboarding API calls.
 * Handles 401 responses by redirecting to the login page.
 * Drop-in replacement for fetch() in client components.
 */
export async function studioFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?next=${next}`;
  }

  return response;
}
