"use client";

import { useState } from "react";
import Link from "next/link";
import type { PageStatusData } from "@/lib/api/studio";

type PageStatusCardProps = {
  page: PageStatusData | null;
};

export default function PageStatusCard({ page }: PageStatusCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!page?.url) return;
    
    try {
      await navigator.clipboard.writeText(page.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!page) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-zinc-400">Meine Seite</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              page.is_published 
                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                : "bg-zinc-800 text-zinc-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${page.is_published ? "bg-green-400" : "bg-zinc-500"}`}></span>
              {page.is_published ? "Veröffentlicht" : "Unveröffentlicht"}
            </span>
          </div>
        </div>
      </div>

      {page.is_published && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <span className="flex-1 text-sm text-zinc-300 truncate font-mono text-xs">
            {page.url}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
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
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
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
          className="text-sm font-medium text-zinc-100 hover:text-white transition-colors"
        >
          {page.is_published ? "Seite bearbeiten" : "Seite einrichten"} →
        </Link>
      </div>
    </div>
  );
}
