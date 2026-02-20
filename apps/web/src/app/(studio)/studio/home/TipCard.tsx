"use client";

import Link from "next/link";
import type { TipData } from "@/lib/api/studio";

type TipCardProps = {
  tip: TipData | null;
};

export default function TipCard({ tip }: TipCardProps) {
  if (!tip) {
    return null;
  }

  const getIcon = () => {
    switch (tip.type) {
      case "spotlight":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "publish":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case "links":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-lg p-4" style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded p-2" style={{ background: "var(--studio-accent-muted)", color: "var(--studio-accent)" }}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: "var(--studio-text-primary)" }}>{tip.message}</p>
          <Link
            href={tip.action}
            className="mt-2 inline-flex items-center text-sm font-medium transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Jetzt erledigen →
          </Link>
        </div>
      </div>
    </div>
  );
}
