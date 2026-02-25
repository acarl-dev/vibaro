"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  StudioHomeData,
  PreviousSpotlightData,
  TrafficSnapshotData,
} from "@/lib/api/studio";
import { PLATFORMS } from "@/lib/platforms";

type HomeClientProps = {
  data: StudioHomeData;
};

// Helpers

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function plat(id: string | null): string {
  if (!id) return "—";
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

function typeBadge(type: string | null): string {
  if (!type) return "";
  const map: Record<string, string> = {
    release: "Release",
    live: "Live",
    merch: "Merch",
    studio: "Studio",
    presave: "Pre-Save",
    tour: "Tour",
  };
  return map[type.toLowerCase()] ?? type;
}

// 1. HERO CARD

function HeroEmpty() {
  return (
    <div
      style={{
        background: "var(--studio-surface-elevated)",
        border: "1px solid var(--studio-border)",
        borderRadius: "20px",
        padding: "32px 28px",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--studio-text-primary)",
            marginBottom: "8px",
          }}
        >
          Keine aktive Phase
        </h2>
        <p style={{ fontSize: "14px", color: "var(--studio-text-secondary)", opacity: 0.8 }}>
          Starte eine Phase, um deine Seite gezielt zu pushen.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
        {[
          "Links automatisch generieren",
          "QR-Code fur Flyer & Poster",
          "Performance & Phasenvergleich",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--studio-border)", fontSize: "14px" }}>-</span>
            <span style={{ fontSize: "14px", color: "var(--studio-text-secondary)" }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link
          href="/studio/share/new"
          style={{
            background: "var(--studio-accent)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Neue Phase starten
        </Link>
        <Link
          href="/studio/page"
          style={{
            background: "transparent",
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-primary)",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Seite bearbeiten
        </Link>
      </div>
    </div>
  );
}

function HeroActive({
  spotlight,
  prevConversion,
}: {
  spotlight: NonNullable<StudioHomeData["spotlight"]>;
  prevConversion: number | null;
}) {
  const stats = spotlight.phase_stats;
  const convDelta =
    stats?.conversion !== null &&
    stats?.conversion !== undefined &&
    prevConversion !== null
      ? parseFloat((stats.conversion - prevConversion).toFixed(1))
      : null;

  return (
    <div
      style={{
        background: "var(--studio-surface-elevated)",
        border: "1px solid var(--studio-border)",
        borderTop: "2px solid var(--studio-accent-muted)",
        borderRadius: "20px",
        padding: "28px",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          {spotlight.type && (
            <span
              style={{
                background: "var(--studio-accent-muted)",
                color: "var(--studio-accent)",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {typeBadge(spotlight.type)}
            </span>
          )}
          <span
            style={{
              background: "var(--studio-surface)",
              border: "1px solid var(--studio-border)",
              color: "var(--studio-text-secondary)",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            Aktiv
          </span>
          {spotlight.starts_at && (
            <span style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
              seit{" "}
              {new Date(spotlight.starts_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
              })}
            </span>
          )}
        </div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--studio-text-primary)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {spotlight.title}
        </h2>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px" }}>
          <HeroStatCell label="Besucher" value={fmt(stats.visitors)} />
          <HeroStatCell label="Klicks" value={fmt(stats.clicks)} />
          <HeroStatCell label="QR-Scans" value={fmt(stats.qr_scans)} />
          <HeroStatCell
            label="Conversion"
            value={stats.conversion !== null ? `${stats.conversion}%` : "-"}
            delta={
              convDelta !== null
                ? { label: `${convDelta > 0 ? "+" : ""}${convDelta} pp`, positive: convDelta >= 0 }
                : undefined
            }
          />
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "28px", flexWrap: "wrap", alignItems: "center" }}>
        <Link
          href="/studio/share"
          style={{ background: "var(--studio-accent)", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
        >
          Zur Phase
        </Link>
        <Link
          href="/studio/share/distribution"
          style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
        >
          Links teilen
        </Link>
        <Link
          href="/studio/share/performance"
          style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
        >
          Performance
        </Link>
        <Link
          href="/studio/share"
          style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#ef4444", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "4px 0" }}
        >
          Phase beenden
        </Link>
      </div>
    </div>
  );
}

function HeroStatCell({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: { label: string; positive: boolean };
}) {
  return (
    <div
      style={{
        background: "var(--studio-bg)",
        border: "1px solid var(--studio-border)",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.7, marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1, color: "var(--studio-text-primary)" }}>
          {value}
        </span>
        {delta && (
          <span style={{ fontSize: "12px", fontWeight: 600, color: delta.positive ? "var(--studio-success)" : "#ef4444" }}>
            {delta.label}
          </span>
        )}
      </div>
    </div>
  );
}

// 2. COMPARISON CARD

function ComparisonCard({
  current,
  previous,
}: {
  current: StudioHomeData["spotlight"];
  previous: PreviousSpotlightData | null;
}) {
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
        <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
          Vergleich — Schliesse mindestens eine Phase ab, um Vergleiche zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>Vergleich</p>
          <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.6, marginTop: "3px" }}>
            Aktive Phase vs letzte abgeschlossene Phase
          </p>
        </div>
        {highlightBadge && (
          <span
            style={{
              background: highlightBadge.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: highlightBadge.positive ? "var(--studio-success)" : "#ef4444",
              border: `1px solid ${highlightBadge.positive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {highlightBadge.label}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {current && cs && (
          <ComparisonRow label="Aktuell" title={current.title} visitors={cs.visitors} clicks={cs.clicks} conversion={cs.conversion} isCurrent />
        )}
        {ps && (
          <ComparisonRow label="Vorher" title={previous.title} visitors={ps.visitors} clicks={ps.clicks} conversion={ps.conversion} />
        )}
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/studio/share/performance" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}>
          Vergleich in Performance ansehen
        </Link>
      </div>
    </div>
  );
}

function ComparisonRow({
  label, title, visitors, clicks, conversion, isCurrent = false,
}: {
  label: string; title: string; visitors: number; clicks: number; conversion: number | null; isCurrent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex", gap: "12px", alignItems: "baseline", padding: "10px 12px", borderRadius: "10px",
        background: isCurrent ? "var(--studio-surface-elevated)" : "transparent",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.6, minWidth: "52px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-primary)" }}>{title}</span>
      <span style={{ fontSize: "13px", color: "var(--studio-text-secondary)" }}>
        {fmt(visitors)} Besucher · {fmt(clicks)} Klicks{conversion !== null && ` · ${conversion}%`}
      </span>
    </div>
  );
}

// 3. QUICK ACTIONS

type ActionItem = { label: string; sub: string; href: string };

function QuickActionCard({ label, sub, href }: ActionItem) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "110px",
        background: "var(--studio-surface)",
        border: `1px solid ${hovered ? "var(--studio-accent-muted)" : "var(--studio-border)"}`,
        borderRadius: "16px", padding: "20px", textDecoration: "none", cursor: "pointer",
        transition: "border-color 150ms ease",
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "13px", color: "var(--studio-text-secondary)", opacity: 0.7 }}>{sub}</p>
    </Link>
  );
}

function QuickActions({ hasActivePhase }: { hasActivePhase: boolean }) {
  const actions: ActionItem[] = [
    { label: "Seite bearbeiten", sub: "Inhalte & Layout", href: "/studio/page" },
    { label: "Neue Phase starten", sub: "Push starten & Links erzeugen", href: "/studio/share/new" },
    { label: "Links teilen", sub: "Distribution & Tracking", href: "/studio/share/distribution" },
    { label: "QR-Code", sub: "Fur Flyer & Poster", href: hasActivePhase ? "/studio/share/qr" : "/studio/share/new" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px" }}>
      {actions.map((a) => <QuickActionCard key={a.label} {...a} />)}
    </div>
  );
}

// 4. TRAFFIC SNAPSHOT

function TrafficSnapshot({ snap, page }: { snap: TrafficSnapshotData; page: StudioHomeData["page"] }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  const rows: { label: string; value: string; positive?: boolean }[] = [
    { label: "Besucher (7 Tage)", value: fmt(snap.visitors_7d) },
    ...(snap.trend_pct !== null ? [{ label: "Trend ggue. Vorwoche", value: `${snap.trend_pct >= 0 ? "+" : ""}${snap.trend_pct}%`, positive: snap.trend_pct >= 0 }] : []),
    ...(snap.top_platform ? [{ label: "Top Plattform", value: plat(snap.top_platform) }] : []),
  ];

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>
          Ueberblick{" "}
          <span style={{ fontSize: "12px", fontWeight: 400, color: "var(--studio-text-secondary)", opacity: 0.6 }}>7 Tage</span>
        </p>
        {pageUrl && page && (
          <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 500, color: "var(--studio-accent)", textDecoration: "none" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: page.is_published ? "var(--studio-success)" : "var(--studio-warning)", display: "inline-block" }} />
            /{page.handle}
          </a>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--studio-text-secondary)" }}>{row.label}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: row.positive === true ? "var(--studio-success)" : row.positive === false ? "#ef4444" : "var(--studio-text-primary)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Link href="/studio/results" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}>
          Zur Analyse
        </Link>
      </div>
    </div>
  );
}

// MAIN

export default function HomeClient({ data }: HomeClientProps) {
  const isActive = data.spotlight?.status === "active";
  const prevConversion = data.previous_spotlight?.phase_stats?.conversion ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {isActive && data.spotlight ? (
        <HeroActive spotlight={data.spotlight} prevConversion={prevConversion} />
      ) : (
        <HeroEmpty />
      )}
      <ComparisonCard current={isActive ? data.spotlight : null} previous={data.previous_spotlight} />
      <QuickActions hasActivePhase={isActive} />
      {data.traffic_snapshot && <TrafficSnapshot snap={data.traffic_snapshot} page={data.page} />}
    </div>
  );
}
