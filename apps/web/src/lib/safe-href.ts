const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

/**
 * Defense-in-depth for public links.
 * Backend validation stays the source of truth.
 */
export function safeHref(rawHref: string | null | undefined): string | null {
  if (typeof rawHref !== "string") {
    return null;
  }

  const href = rawHref.trim();
  if (!href || CONTROL_CHARACTERS.test(href) || href.startsWith("//")) {
    return null;
  }

  const schemeMatch = href.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):([\s\S]*)$/);
  if (!schemeMatch) {
    return null;
  }

  const scheme = schemeMatch[1].toLowerCase();
  if (!["https", "http", "mailto", "tel"].includes(scheme)) {
    return null;
  }

  if (scheme === "https" || scheme === "http") {
    try {
      const parsed = new URL(href);
      if (!parsed.hostname) {
        return null;
      }
    } catch {
      return null;
    }
  }

  if ((scheme === "mailto" || scheme === "tel") && !schemeMatch[2]?.trim()) {
    return null;
  }

  return href;
}
