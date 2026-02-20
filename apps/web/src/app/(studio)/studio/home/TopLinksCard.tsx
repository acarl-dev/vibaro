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
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-400">Performance (7 Tage)</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-zinc-100">{stats.total_clicks_7d}</span>
            <span className="text-sm text-zinc-500">Klicks</span>
            {stats.trend !== 0 && (
              <span className={`text-xs font-medium ${stats.trend > 0 ? "text-green-400" : "text-red-400"}`}>
                {stats.trend > 0 ? "+" : ""}{stats.trend}%
              </span>
            )}
          </div>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-zinc-500">Noch keine Tracking-Links erstellt</p>
          <Link
            href="/studio/share"
            className="mt-3 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
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
                className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/50 p-3 hover:bg-zinc-900 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{link.label}</p>
                  <p className="text-xs text-zinc-500">
                    {link.platform && link.placement 
                      ? `${link.platform} · ${link.placement}` 
                      : link.short_code}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-medium text-zinc-400">{link.clicks}</span>
                  <button
                    onClick={() => handleCopy(link)}
                    className="rounded-md p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
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
          
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <Link
              href="/studio/results"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Alle Ergebnisse ansehen →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
