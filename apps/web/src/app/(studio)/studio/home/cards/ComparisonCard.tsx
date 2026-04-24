"use client";

import Link from "next/link";
import type { StudioHomeData, PreviousSpotlightData } from "@/lib/api/studio.types";

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function ComparisonRow({ label, title, visitors, clicks, conversion, isCurrent = false }: { label: string; title: string; visitors: number; clicks: number; conversion: number | null; isCurrent?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "baseline", padding: "10px 12px", borderRadius: "10px", background: isCurrent ? "var(--studio-surface-elevated)" : "transparent", flexWrap: "wrap" }}>
      <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.6, minWidth: "52px", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-primary)" }}>{title}</span>
      <span style={{ fontSize: "13px", color: "var(--studio-text-secondary)" }}>
        {fmt(visitors)} Besucher · {fmt(clicks)} Klicks{conversion !== null && ` · ${conversion}%`}
      </span>
    </div>
  );
}

export default function ComparisonCard({ current, previous }: { current: StudioHomeData["spotlight"]; previous: PreviousSpotlightData | null }) {
  const cs = current?.phase_stats;
  const ps = previous?.phase_stats;

  let highlightBadge: { label: string; positive: boolean } | null = null;
  if (cs && ps && ps.visitors > 0 && cs.visitors > 0) {
    const pct = Math.round(((cs.visitors - ps.visitors) / ps.visitors) * 100);
    if (pct !== 0) highlightBadge = { label: `${pct > 0 ? "+" : ""}${pct}% Besucher`, positive: pct > 0 };
  }
  if (!highlightBadge && cs?.conversion != null && ps?.conversion != null) {
    const pp = parseFloat((cs.conversion - ps.conversion).toFixed(1));
    if (pp !== 0) highlightBadge = { label: `${pp > 0 ? "+" : ""}${pp} pp Conversion`, positive: pp > 0 };
  }

  if (!previous) {
    return (
      <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "4px" }}>Vergleich</p>
        <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6, marginBottom: "12px" }}>Aktuell vs letzte Phase</p>
        <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.5 }}>
          Noch kein Vergleich möglich — beende eine Phase, um sie mit der nächsten zu vergleichen.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>Vergleich</p>
          <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6, marginTop: "3px" }}>Aktive Phase vs letzte abgeschlossene Phase</p>
        </div>
        {highlightBadge && (
          <span style={{ background: highlightBadge.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: highlightBadge.positive ? "var(--studio-success)" : "#ef4444", border: `1px solid ${highlightBadge.positive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
            {highlightBadge.label}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {current && cs && <ComparisonRow label="Aktuell" title={current.title} visitors={cs.visitors} clicks={cs.clicks} conversion={cs.conversion} isCurrent />}
        {ps && <ComparisonRow label="Vorher" title={previous.title} visitors={ps.visitors} clicks={ps.clicks} conversion={ps.conversion} />}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Link href="/studio/results" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}>Vergleich in der Analyse ansehen</Link>
      </div>
    </div>
  );
}
