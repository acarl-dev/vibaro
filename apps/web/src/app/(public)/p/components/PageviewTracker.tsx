"use client";

import { useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fires a single pageview event to the backend on mount.
 * Rendered as a leaf client component inside the public (Server Component) page.
 * No cookies. No sessions. No retry.
 */
export default function PageviewTracker({ handle }: { handle: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !API_BASE || !handle) return;
    fired.current = true;

    const referrer = document.referrer || "";

    fetch(`${API_BASE}/api/v1/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, referrer }),
      // fire-and-forget: don't block rendering, ignore failures
      keepalive: true,
    }).catch(() => {
      // silent – analytics must never break the public page
    });
  }, [handle]);

  return null;
}
