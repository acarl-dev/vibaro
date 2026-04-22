"use client";

import Link from "next/link";
import type { StudioHomeData, CompletenessItem } from "@/lib/api/studio.types";

function CompletenessGroup({ title, items }: { title: string; items: CompletenessItem[] }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.55, marginBottom: "8px" }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {items.map((item) => (
          <div
            key={item.key}
            style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: item.done ? "var(--studio-text-primary)" : "var(--studio-text-secondary)", opacity: item.done ? 1 : 0.65 }}
          >
            <span
              aria-hidden
              style={{ width: "16px", height: "16px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", background: item.done ? "rgba(34,197,94,0.12)" : "transparent", border: item.done ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--studio-border)" }}
            >
              {item.done && (
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="var(--studio-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PageReadinessCard({ page }: { page: StudioHomeData["page"] }) {
  if (!page?.completeness) return null;

  const { basis, praesenz } = page.completeness;
  const all = [...basis, ...praesenz];
  const doneCount = all.filter((x) => x.done).length;
  const totalCount = all.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const isComplete = doneCount === totalCount;
  const basisAllDone = basis.every((x) => x.done);

  return (
    <div style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", borderRadius: "20px", padding: "24px 24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "3px" }}>Deine Seite</h2>
          <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.7 }}>
            {isComplete
              ? "Alle Bereiche ausgef\u00fcllt."
              : `${pct}\u202f% bereit\u00a0·\u00a0${totalCount - doneCount} ${totalCount - doneCount === 1 ? "Bereich fehlt" : "Bereiche fehlen"}`}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              background: page.is_published ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
              color: page.is_published ? "var(--studio-success)" : "var(--studio-warning)",
              border: `1px solid ${page.is_published ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
              padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const,
            }}
          >
            {page.is_published ? "Live" : "Entwurf"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "20px", marginBottom: "20px" }}>
        <CompletenessGroup title="Basis" items={basis} />
        <CompletenessGroup title="Pr\u00e4senz" items={praesenz} />
      </div>

      <div style={{ borderTop: "1px solid var(--studio-border)", paddingTop: "16px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        {!page.is_published && (
          <Link
            href="/studio/page"
            style={{ background: basisAllDone ? "var(--studio-accent)" : "var(--studio-surface)", color: basisAllDone ? "#fff" : "var(--studio-text-secondary)", border: basisAllDone ? "none" : "1px solid var(--studio-border)", padding: "9px 16px", borderRadius: "10px", fontWeight: 500, fontSize: "13px", textDecoration: "none", display: "inline-block" }}
          >
            {basisAllDone ? "Jetzt ver\u00f6ffentlichen" : "Seite vervollst\u00e4ndigen \u2192"}
          </Link>
        )}
        <Link href="/studio/page" style={{ fontSize: "13px", fontWeight: 500, color: "var(--studio-text-secondary)", textDecoration: "none", marginLeft: page.is_published ? "0" : "auto", opacity: 0.7 }}>
          Seite bearbeiten \u2192
        </Link>
      </div>

      {!page.is_published && (
        <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.55 }}>
          Deine Seite ist aktuell nicht \u00f6ffentlich sichtbar.
          {basisAllDone ? " Alles N\u00f6tige ist ausgef\u00fcllt \u2013 du kannst sie jetzt ver\u00f6ffentlichen." : " F\u00fclle zuerst alle Basis-Felder aus."}
        </p>
      )}
    </div>
  );
}
