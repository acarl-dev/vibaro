"use client";

import { useState } from "react";
import Link from "next/link";
import type { PageStatusData } from "@/lib/api/studio";

type PageStatusCardProps = {
  page: PageStatusData | null;
};

export default function PageStatusCard({ page }: PageStatusCardProps) {
  const [copied, setCopied] = useState(false);

  // Build full URL from handle (URL is owned by the frontend, not the API)
  // Use NEXT_PUBLIC_APP_URL (inlined at build time) to avoid SSR/client mismatch
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pageUrl = page?.handle ? `/p/${page.handle}` : null;
  const fullPageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  const handleCopy = async () => {
    if (!fullPageUrl) return;
    try {
      await navigator.clipboard.writeText(fullPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!page) {
    return (
      <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
        <h2 className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>Meine Seite</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--studio-text-secondary)" }}>Noch keine Seite eingerichtet</p>
        <div className="mt-4">
          <Link
            href="/studio/page"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Seite einrichten →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Meine Seite</h2>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold uppercase"
              style={page.is_published
                ? { background: "rgba(34,197,94,0.12)", color: "var(--studio-success)" }
                : { background: "rgba(245,158,11,0.12)", color: "var(--studio-warning)" }
              }
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: page.is_published ? "var(--studio-success)" : "var(--studio-warning)" }}></span>
              {page.is_published ? "Veröffentlicht" : "Nicht veröffentlicht"}
            </span>
          </div>
        </div>
      </div>

      {pageUrl && (
        <div className="mt-4 flex items-center gap-2 rounded px-3 py-2" style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)" }}>
          <span className="flex-1 truncate text-xs font-mono" style={{ color: "var(--studio-text-primary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>
            {fullPageUrl || pageUrl}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded p-1.5 transition-colors"
            style={{ color: "var(--studio-text-secondary)" }}
            title="URL kopieren"
          >
            {copied ? (
              <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded p-1.5 transition-colors"
            style={{ color: "var(--studio-text-secondary)" }}
            title="Seite öffnen"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/studio/page"
          className="text-sm font-medium transition-colors"
          style={{ color: "var(--studio-accent)" }}
        >
          {page.is_published ? "Seite bearbeiten" : "Seite einrichten"} →
        </Link>
      </div>
    </div>
  );
}
