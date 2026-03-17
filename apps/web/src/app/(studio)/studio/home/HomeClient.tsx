"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  StudioHomeData,
  PreviousSpotlightData,
  TrafficSnapshotData,
  CompletenessItem,
} from "@/lib/api/studio.types";
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

// 0. PAGE READINESS CARD

function CompletenessGroup({
  title,
  items,
}: {
  title: string;
  items: CompletenessItem[];
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--studio-text-secondary)",
          opacity: 0.55,
          marginBottom: "8px",
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {items.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: item.done
                ? "var(--studio-text-primary)"
                : "var(--studio-text-secondary)",
              opacity: item.done ? 1 : 0.65,
            }}
          >
            <span
              aria-hidden
              style={{
                width: "16px",
                height: "16px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                background: item.done
                  ? "rgba(34,197,94,0.12)"
                  : "transparent",
                border: item.done
                  ? "1px solid rgba(34,197,94,0.3)"
                  : "1px solid var(--studio-border)",
              }}
            >
              {item.done && (
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="var(--studio-success)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

function PageReadinessCard({
  page,
}: {
  page: StudioHomeData["page"];
}) {
  if (!page?.completeness) return null;

  const { basis, praesenz } = page.completeness;
  const all = [...basis, ...praesenz];
  const doneCount = all.filter((x) => x.done).length;
  const totalCount = all.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  const isComplete = doneCount === totalCount;
  const basisAllDone = basis.every((x) => x.done);

  return (
    <div
      style={{
        background: "var(--studio-surface-elevated)",
        border: "1px solid var(--studio-border)",
        borderRadius: "20px",
        padding: "24px 24px 20px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--studio-text-primary)",
              marginBottom: "3px",
            }}
          >
            Deine Seite
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--studio-text-secondary)",
              opacity: 0.7,
            }}
          >
            {isComplete
              ? "Alle Bereiche ausgefüllt."
              : `${pct}\u202f% bereit\u00a0·\u00a0${totalCount - doneCount} ${totalCount - doneCount === 1 ? "Bereich fehlt" : "Bereiche fehlen"}`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Published / draft badge */}
          <span
            style={{
              background: page.is_published
                ? "rgba(34,197,94,0.1)"
                : "rgba(245,158,11,0.1)",
              color: page.is_published
                ? "var(--studio-success)"
                : "var(--studio-warning)",
              border: `1px solid ${
                page.is_published
                  ? "rgba(34,197,94,0.25)"
                  : "rgba(245,158,11,0.25)"
              }`,
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            {page.is_published ? "Live" : "Entwurf"}
          </span>
        </div>
      </div>

      {/* Completeness groups */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ gap: "20px", marginBottom: "20px" }}
      >
        <CompletenessGroup title="Basis" items={basis} />
        <CompletenessGroup title="Präsenz" items={praesenz} />
      </div>

      {/* Footer actions */}
      <div
        style={{
          borderTop: "1px solid var(--studio-border)",
          paddingTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {!page.is_published && (
          <Link
            href="/studio/page"
            style={{
              background: basisAllDone
                ? "var(--studio-accent)"
                : "var(--studio-surface)",
              color: basisAllDone ? "#fff" : "var(--studio-text-secondary)",
              border: basisAllDone
                ? "none"
                : "1px solid var(--studio-border)",
              padding: "9px 16px",
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "13px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {basisAllDone ? "Jetzt veröffentlichen" : "Seite vervollständigen →"}
          </Link>
        )}

        <Link
          href="/studio/page"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--studio-text-secondary)",
            textDecoration: "none",
            marginLeft: page.is_published ? "0" : "auto",
            opacity: 0.7,
          }}
        >
          Seite bearbeiten →
        </Link>
      </div>

      {/* Draft notice */}
      {!page.is_published && (
        <p
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "var(--studio-text-secondary)",
            opacity: 0.55,
          }}
        >
          Deine Seite ist aktuell nicht öffentlich sichtbar.
          {basisAllDone
            ? " Alles Nötige ist ausgefüllt – du kannst sie jetzt veröffentlichen."
            : " Fülle zuerst alle Basis-Felder aus."}
        </p>
      )}
    </div>
  );
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background icon */}
      <div
        style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none", userSelect: "none" }}
        aria-hidden
      >
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--studio-text-primary)" }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1.3, color: "var(--studio-text-primary)", marginBottom: "8px" }}>
            Keine aktive Phase
          </h2>
          <p style={{ fontSize: "14px", color: "var(--studio-text-secondary)", opacity: 0.8 }}>
            Starte eine Phase, um deine Seite gezielt zu pushen.
          </p>
        </div>

        {/* Clickable feature bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "28px" }}>
          {([
            { label: "Links automatisch generieren", href: "/studio/share/distribution" },
            { label: "QR-Code für Flyer & Poster", href: "/studio/share/qr" },
            { label: "Performance & Phasenvergleich", href: "/studio/share/performance" },
          ] as const).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "8px", padding: "9px 12px", borderRadius: "10px",
                background: "var(--studio-bg)", border: "1px solid var(--studio-border)",
                textDecoration: "none", color: "var(--studio-text-secondary)",
                fontSize: "13px", fontWeight: 500,
              }}
            >
              <span>{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link
            href="/studio/share/new"
            style={{ background: "var(--studio-accent)", color: "#fff", padding: "10px 18px", borderRadius: "10px", fontWeight: 500, fontSize: "14px", textDecoration: "none", display: "inline-block" }}
          >
            Neue Phase starten
          </Link>
          <Link
            href="/studio/page"
            style={{ fontSize: "13px", fontWeight: 500, color: "var(--studio-text-secondary)", textDecoration: "none" }}
          >
            Seite bearbeiten →
          </Link>
        </div>
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
          Distribution
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

type ActionItem = { label: string; sub: string; href: string; muted?: boolean; warn?: boolean };

function QuickActionCard({ label, sub, href, muted = false, warn = false }: ActionItem) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "110px",
        background: hovered ? "var(--studio-surface-elevated)" : "var(--studio-surface)",
        border: `1px solid ${hovered ? "var(--studio-accent-muted)" : "var(--studio-border)"}`,
        borderRadius: "16px", padding: "20px", textDecoration: "none", cursor: "pointer",
        transition: "background 150ms ease, border-color 150ms ease",
        opacity: muted ? 0.55 : 1,
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "12px", color: warn ? "var(--studio-warning)" : "var(--studio-text-secondary)", opacity: warn ? 1 : 0.7 }}>{sub}</p>
    </Link>
  );
}

function QuickActions({ hasActivePhase }: { hasActivePhase: boolean }) {
  const actions: ActionItem[] = [
    { label: "Seite bearbeiten", sub: "Inhalte & Layout", href: "/studio/page" },
    { label: "Neue Phase starten", sub: "Push starten & Links erzeugen", href: "/studio/share/new", muted: hasActivePhase },
    { label: "Distribution", sub: "Story · Bio · Ads Links", href: "/studio/share/distribution" },
    {
      label: "QR-Code",
      sub: hasActivePhase ? "Für Flyer & Poster" : "Erfordert aktive Phase",
      href: hasActivePhase ? "/studio/share/qr" : "/studio/share/new",
      warn: !hasActivePhase,
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px" }}>
      {actions.map((a) => <QuickActionCard key={a.label} {...a} />)}
    </div>
  );
}

// 4. TRAFFIC SNAPSHOT

function SnapStatCell({
  label, value, trend,
}: {
  label: string;
  value: string;
  trend?: { pct: number } | null;
}) {
  return (
    <div
      style={{
        background: "var(--studio-bg)",
        border: "1px solid var(--studio-border)",
        borderRadius: "12px",
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.6, marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1, color: "var(--studio-text-primary)" }}>
          {value}
        </span>
        {trend != null && (
          <span style={{ fontSize: "11px", fontWeight: 600, color: trend.pct >= 0 ? "var(--studio-success)" : "#ef4444" }}>
            {trend.pct >= 0 ? "↑" : "↓"} {Math.abs(trend.pct)}%
          </span>
        )}
      </div>
    </div>
  );
}

function TrafficSnapshot({
  snap,
  stats,
  page,
}: {
  snap: TrafficSnapshotData;
  stats: StudioHomeData["stats"];
  page: StudioHomeData["page"];
}) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  const visitors = snap.visitors_7d;
  const clicks = stats.total_clicks_7d;
  const conversion = visitors > 0 && clicks > 0 ? parseFloat((clicks / visitors * 100).toFixed(1)) : null;

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      {/* Header */}
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

      {/* Stat cells */}
      <div className="grid grid-cols-3" style={{ gap: "10px", marginBottom: "16px" }}>
        <SnapStatCell
          label="Besucher"
          value={fmt(visitors)}
          trend={snap.trend_pct !== null ? { pct: snap.trend_pct } : null}
        />
        <SnapStatCell
          label="Klicks"
          value={fmt(clicks)}
          trend={stats.trend !== 0 ? { pct: stats.trend } : null}
        />
        <SnapStatCell
          label="Conversion"
          value={conversion !== null ? `${conversion}%` : "—"}
        />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        {snap.top_platform && (
          <span style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
            Top: {plat(snap.top_platform)}
          </span>
        )}
        <Link href="/studio/results" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none", marginLeft: "auto" }}>
          Zur Analyse →
        </Link>
      </div>
    </div>
  );
}

// 5. PAGE STATUS CARD

function PageStatusCard({ page }: { page: StudioHomeData["page"] }) {
  const [copied, setCopied] = useState(false);
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  function handleCopy() {
    if (!pageUrl) return;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!page || !pageUrl) return null;

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>Seite</p>
        <span
          style={{
            background: page.is_published ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
            color: page.is_published ? "var(--studio-success)" : "var(--studio-warning)",
            border: `1px solid ${page.is_published ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
            padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em",
          }}
        >
          {page.is_published ? "Live" : "Entwurf"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ fontSize: "12px", color: "var(--studio-text-secondary)", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pageUrl}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent", border: "1px solid var(--studio-border)",
            color: copied ? "var(--studio-success)" : "var(--studio-text-secondary)",
            padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
            cursor: "pointer", flexShrink: 0, transition: "color 150ms ease",
          }}
        >
          {copied ? "Kopiert ✓" : "Kopieren"}
        </button>
      </div>
      <a
        href={pageUrl} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}
      >
        Vorschau öffnen →
      </a>
    </div>
  );
}

// MAIN

export default function HomeClient({ data }: HomeClientProps) {
  const isActive = data.spotlight?.status === "active";
  const prevConversion = data.previous_spotlight?.phase_stats?.conversion ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {data.page?.completeness && (
        <div style={{ marginBottom: "20px" }}>
          <PageReadinessCard page={data.page} />
        </div>
      )}
      <div style={{ marginBottom: "32px" }}>
        {isActive && data.spotlight ? (
          <HeroActive spotlight={data.spotlight} prevConversion={prevConversion} />
        ) : (
          <HeroEmpty />
        )}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <ComparisonCard current={isActive ? data.spotlight : null} previous={data.previous_spotlight} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <QuickActions hasActivePhase={isActive} />
      </div>
      {data.traffic_snapshot && (
        <div style={{ marginBottom: "20px" }}>
          <TrafficSnapshot snap={data.traffic_snapshot} stats={data.stats} page={data.page} />
        </div>
      )}
      <PageStatusCard page={data.page} />
    </div>
  );
}
