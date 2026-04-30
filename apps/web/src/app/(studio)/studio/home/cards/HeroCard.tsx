"use client";

import Link from "next/link";
import type { StudioHomeData } from "@/lib/api/studio.types";

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function phaseSubline(type: string | null): string {
  if (!type) return "Dein aktueller Fokus steht im Mittelpunkt deiner Seite.";
  const t = type.toLowerCase();
  if (["single", "album", "video", "release"].includes(t))
    return "Dein Release steht im Mittelpunkt deiner Seite.";
  if (["tour", "event", "live"].includes(t))
    return "Deine Shows stehen im Mittelpunkt deiner Seite.";
  if (t === "merch")
    return "Dein Merch steht im Mittelpunkt deiner Seite.";
  if (t === "studio")
    return "Dein Studio-Update steht im Mittelpunkt deiner Seite.";
  return "Dein aktueller Fokus steht im Mittelpunkt deiner Seite.";
}

function HeroStatCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--studio-bg)", border: "1px solid var(--studio-border)", borderRadius: "12px", padding: "14px 16px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.7, marginBottom: "6px" }}>
        {label}
      </div>
      <span style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1, color: "var(--studio-text-primary)" }}>{value}</span>
    </div>
  );
}

export function HeroEmpty() {
  return (
    <div style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", borderRadius: "20px", padding: "40px 32px", position: "relative", overflow: "hidden" }}>
      <div
        style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", opacity: 0.06, pointerEvents: "none", userSelect: "none" }}
        aria-hidden
      >
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--studio-text-primary)" }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.25, color: "var(--studio-text-primary)", marginBottom: "10px" }}>
            Deine Seite steht. Was willst du jetzt pushen?
          </h2>
          <p style={{ fontSize: "14px", color: "var(--studio-text-secondary)", opacity: 0.8, maxWidth: "520px" }}>
            Starte eine Phase, um deine Bandseite auf einen Release, eine Show, Merch oder Studio-Updates auszurichten und später messbar zu sehen, welche Kanäle für diesen Push funktionieren.
          </p>
          <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6, maxWidth: "520px", marginTop: "10px" }}>
            1. Fokus festlegen · 2. Links und QR teilen · 3. Performance prüfen
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          <Link
            href="/studio/share/new"
            style={{ background: "var(--studio-accent)", color: "#fff", padding: "11px 20px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
          >
            Neue Phase starten
          </Link>
          <Link
            href="/studio/page"
            style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "11px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
          >
            Seite weiter ausbauen
          </Link>
        </div>
        <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.5, maxWidth: "480px" }}>
          Du kannst Vibaro auch einfach als Link-in-Bio-Seite nutzen – mit Musik, Videos, Fotos, Shows und Kontaktmöglichkeiten.
        </p>
      </div>
    </div>
  );
}

export function HeroActive({ spotlight }: { spotlight: NonNullable<StudioHomeData["spotlight"]> }) {
  const stats = spotlight.phase_stats;
  const hasData = stats && (stats.visitors > 0 || stats.clicks > 0);

  return (
    <div style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", borderTop: "3px solid var(--studio-accent)", borderRadius: "20px", padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "var(--studio-accent-muted)", color: "var(--studio-accent)", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
            Aktive Phase
          </span>
          {spotlight.starts_at && (
            <span style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
              seit {new Date(spotlight.starts_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            </span>
          )}
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.25, color: "var(--studio-text-primary)", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {spotlight.title}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--studio-text-secondary)", opacity: 0.75 }}>
          {phaseSubline(spotlight.type)}
        </p>
        <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6, marginTop: "10px" }}>
          1. Fokus festlegen · 2. Links und QR teilen · 3. Performance dieser Phase prüfen
        </p>
      </div>
      {hasData && stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: "12px", marginBottom: "24px" }}>
          <HeroStatCell label="Besucher" value={fmt(stats.visitors)} />
          <HeroStatCell label="Klicks" value={fmt(stats.clicks)} />
          <HeroStatCell label="QR-Scans" value={fmt(stats.qr_scans)} />
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.55, marginBottom: "24px" }}>
          Sobald du deine Links teilst, siehst du hier erste Daten.
        </p>
      )}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <Link
          href="/studio/share"
          style={{ background: "var(--studio-accent)", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
        >
          Phase verwalten
        </Link>
        <Link
          href="/studio/share/distribution"
          style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
        >
          Links verteilen
        </Link>
        <Link
          href="/studio/page"
          style={{ marginLeft: "auto", fontSize: "13px", fontWeight: 500, color: "var(--studio-text-secondary)", textDecoration: "none", opacity: 0.75 }}
        >
          Seite bearbeiten →
        </Link>
      </div>
    </div>
  );
}
