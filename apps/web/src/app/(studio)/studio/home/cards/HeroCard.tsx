"use client";

import Link from "next/link";
import type { StudioHomeData } from "@/lib/api/studio.types";

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function typeBadge(type: string | null): string {
  if (!type) return "";
  const map: Record<string, string> = { single: "Single", album: "Album", tour: "Tour", event: "Event", video: "Video", merch: "Merch", livestream: "Livestream", collab: "Collab" };
  return map[type.toLowerCase()] ?? type;
}

function HeroStatCell({ label, value, delta }: { label: string; value: string; delta?: { label: string; positive: boolean } }) {
  return (
    <div style={{ background: "var(--studio-bg)", border: "1px solid var(--studio-border)", borderRadius: "12px", padding: "16px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.7, marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1, color: "var(--studio-text-primary)" }}>{value}</span>
        {delta && <span style={{ fontSize: "12px", fontWeight: 600, color: delta.positive ? "var(--studio-success)" : "#ef4444" }}>{delta.label}</span>}
      </div>
    </div>
  );
}

export function HeroEmpty() {
  return (
    <div style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", borderRadius: "20px", padding: "32px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none", userSelect: "none" }} aria-hidden>
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--studio-text-primary)" }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1.3, color: "var(--studio-text-primary)", marginBottom: "8px" }}>Keine aktive Phase</h2>
          <p style={{ fontSize: "14px", color: "var(--studio-text-secondary)", opacity: 0.8 }}>Starte eine Phase, um deine Seite gezielt zu pushen.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "28px" }}>
          {([
            { label: "Links automatisch generieren", href: "/studio/share/distribution" },
            { label: "QR-Code f\u00fcr Flyer & Poster", href: "/studio/share/qr" },
            { label: "Performance & Phasenvergleich", href: "/studio/share/performance" },
          ] as const).map(({ label, href }) => (
            <Link key={href} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: "var(--studio-bg)", border: "1px solid var(--studio-border)", textDecoration: "none", color: "var(--studio-text-secondary)", fontSize: "13px", fontWeight: 500 }}>
              <span>{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/studio/share/new" style={{ background: "var(--studio-accent)", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>Neue Phase starten</Link>
          <Link href="/studio/page" style={{ fontSize: "13px", fontWeight: 500, color: "var(--studio-text-secondary)", textDecoration: "none" }}>Seite bearbeiten \u2192</Link>
        </div>
      </div>
    </div>
  );
}

export function HeroActive({ spotlight, prevConversion }: { spotlight: NonNullable<StudioHomeData["spotlight"]>; prevConversion: number | null }) {
  const stats = spotlight.phase_stats;
  const convDelta = stats?.conversion !== null && stats?.conversion !== undefined && prevConversion !== null
    ? parseFloat((stats.conversion - prevConversion).toFixed(1)) : null;

  return (
    <div style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", borderTop: "2px solid var(--studio-accent-muted)", borderRadius: "20px", padding: "28px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          {spotlight.type && (
            <span style={{ background: "var(--studio-accent-muted)", color: "var(--studio-accent)", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              {typeBadge(spotlight.type)}
            </span>
          )}
          <span style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", color: "var(--studio-text-secondary)", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 500, opacity: 0.8 }}>Aktiv</span>
          {spotlight.starts_at && (
            <span style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
              seit {new Date(spotlight.starts_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            </span>
          )}
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1.3, color: "var(--studio-text-primary)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {spotlight.title}
        </h2>
      </div>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px" }}>
          <HeroStatCell label="Besucher" value={fmt(stats.visitors)} />
          <HeroStatCell label="Klicks" value={fmt(stats.clicks)} />
          <HeroStatCell label="QR-Scans" value={fmt(stats.qr_scans)} />
          <HeroStatCell label="Conversion" value={stats.conversion !== null ? `${stats.conversion}%` : "-"} delta={convDelta !== null ? { label: `${convDelta > 0 ? "+" : ""}${convDelta} pp`, positive: convDelta >= 0 } : undefined} />
        </div>
      )}
      <div style={{ display: "flex", gap: "10px", marginTop: "28px", flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/studio/share" style={{ background: "var(--studio-accent)", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>Zur Phase</Link>
        <Link href="/studio/share/distribution" style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>Distribution</Link>
        <Link href="/studio/share/performance" style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>Performance</Link>
        <Link href="/studio/share" style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#ef4444", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "4px 0" }}>Phase beenden</Link>
      </div>
    </div>
  );
}
