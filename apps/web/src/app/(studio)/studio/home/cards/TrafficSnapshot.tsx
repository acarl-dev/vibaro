"use client";

import Link from "next/link";
import type { StudioHomeData, TrafficSnapshotData } from "@/lib/api/studio.types";
import { PLATFORMS } from "@/lib/platforms";

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function plat(id: string | null): string {
  if (!id) return "—";
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

function SnapStatCell({ label, value, trend }: { label: string; value: string; trend?: { pct: number } | null }) {
  return (
    <div style={{ background: "var(--studio-bg)", border: "1px solid var(--studio-border)", borderRadius: "12px", padding: "14px 16px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.6, marginBottom: "6px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1, color: "var(--studio-text-primary)" }}>{value}</span>
        {trend != null && (
          <span style={{ fontSize: "11px", fontWeight: 600, color: trend.pct >= 0 ? "var(--studio-success)" : "#ef4444" }}>
            {trend.pct >= 0 ? "↑" : "↓"} {Math.abs(trend.pct)}%
          </span>
        )}
      </div>
    </div>
  );
}

type TrafficSnapshotProps = {
  snap: TrafficSnapshotData;
  stats: StudioHomeData["stats"];
  page: StudioHomeData["page"];
  hasActivePhase: boolean;
};

export default function TrafficSnapshot({ snap, stats, page, hasActivePhase }: TrafficSnapshotProps) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;
  const visitors = snap.visitors_7d;
  const clicks = stats.total_clicks_7d;
  const hasData = visitors > 0 || clicks > 0;

  if (!hasData) {
    return (
      <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "6px" }}>
          Noch keine Daten
        </p>
        <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.65, marginBottom: "16px" }}>
          Teile deine Links oder starte eine Phase, damit du siehst, was funktioniert.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {hasActivePhase ? (
            <Link
              href="/studio/share/distribution"
              style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, textDecoration: "none", display: "inline-block" }}
            >
              Links teilen
            </Link>
          ) : (
            <Link
              href="/studio/share/new"
              style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, textDecoration: "none", display: "inline-block" }}
            >
              Phase starten
            </Link>
          )}
        </div>
      </div>
    );
  }

  const conversion = visitors > 0 && clicks > 0 ? parseFloat((clicks / visitors * 100).toFixed(1)) : null;

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>
          Überblick
          <span style={{ fontSize: "12px", fontWeight: 400, color: "var(--studio-text-secondary)", opacity: 0.6, marginLeft: "8px" }}>7 Tage</span>
        </p>
        {pageUrl && page && (
          <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 500, color: "var(--studio-accent)", textDecoration: "none" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: page.is_published ? "var(--studio-success)" : "var(--studio-warning)", display: "inline-block" }} />
            /{page.handle}
          </a>
        )}
      </div>
      <div className="grid grid-cols-3" style={{ gap: "10px", marginBottom: "16px" }}>
        <SnapStatCell label="Besucher" value={fmt(visitors)} trend={snap.trend_pct !== null ? { pct: snap.trend_pct } : null} />
        <SnapStatCell label="Klicks" value={fmt(clicks)} trend={stats.trend !== 0 ? { pct: stats.trend } : null} />
        <SnapStatCell label="Conversion" value={conversion !== null ? `${conversion}%` : "—"} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        {snap.top_platform && (
          <span style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>Top: {plat(snap.top_platform)}</span>
        )}
        <Link href="/studio/results" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none", marginLeft: "auto" }}>
          Zur Analyse →
        </Link>
      </div>
    </div>
  );
}
