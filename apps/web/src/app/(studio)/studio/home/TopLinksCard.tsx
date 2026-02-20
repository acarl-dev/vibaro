"use client";

import { useState } from "react";
import Link from "next/link";
import type { TopLinkData } from "@/lib/api/studio";

type TopLinksCardProps = {
  links: TopLinkData[];
  stats: { total_clicks_7d: number; trend: number };
};

export default function TopLinksCard({ links, stats }: TopLinksCardProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (link: TopLinkData) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Performance (7 Tage)</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: "var(--studio-text-primary)" }}>{stats.total_clicks_7d}</span>
            <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>Klicks</span>
            {stats.trend !== 0 && (
              <span className="text-xs font-medium" style={{ color: stats.trend > 0 ? "var(--studio-success)" : "var(--studio-accent)" }}>
                {stats.trend > 0 ? "+" : ""}{stats.trend}%
              </span>
            )}
          </div>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>Noch keine Tracking-Links erstellt</p>
          <Link
            href="/studio/share"
            className="mt-3 inline-flex items-center text-sm font-medium transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Jetzt erstellen →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded p-3 transition-colors"
                style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface-elevated)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--studio-text-primary)" }}>{link.label}</p>
                  <p className="text-xs" style={{ color: "var(--studio-text-secondary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>
                    {link.platform && link.placement
                      ? `${link.platform} · ${link.placement}`
                      : link.short_code}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>{link.clicks}</span>
                  <button
                    onClick={() => handleCopy(link)}
                    className="rounded p-1.5 transition-colors"
                    style={{ color: "var(--studio-text-secondary)" }}
                    title="Link kopieren"
                  >
                    {copiedId === link.id ? (
                      <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--studio-border)" }}>
            <Link
              href="/studio/results"
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--studio-accent)" }}
            >
              Alle Ergebnisse ansehen →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
