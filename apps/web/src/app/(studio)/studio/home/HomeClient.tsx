"use client";

import Link from "next/link";
import type { StudioHomeData, PhaseStatsData, PreviousSpotlightData, TrafficSnapshotData } from "@/lib/api/studio";
import { PLATFORMS } from "@/lib/platforms";

type HomeClientProps = {
  data: StudioHomeData;
};

function platformLabel(id: string | null): string {
  if (!id) return "—";
  const p = PLATFORMS.find((pl) => pl.id === id);
  return p?.label ?? id;
}

// ─── 1. Active Phase Hero Card ────────────────────────────────────────────────
function ActivePhaseCard({ spotlight }: { spotlight: StudioHomeData["spotlight"] }) {
  if (!spotlight || spotlight.status !== "active") {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Aktive Phase
        </p>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Keine aktive Phase. Starte eine Phase, um deine Seite gezielt zu pushen.
        </p>
        <Link href="/studio/share/new" className="studio-btn studio-btn-primary inline-flex">
          Neue Phase starten
        </Link>
      </div>
    );
  }

  const stats = spotlight.phase_stats;

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{
        background: "var(--studio-surface)",
        border: "1px solid var(--studio-accent)",
        boxShadow: "0 0 0 1px color-mix(in srgb, var(--studio-accent) 20%, transparent)",
      }}
    >
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: "var(--studio-accent)", color: "#fff" }}
            >
              Aktiv
            </span>
            {spotlight.type && (
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--studio-text-secondary)" }}
              >
                {spotlight.type}
              </span>
            )}
          </div>
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {spotlight.title}
          </h2>
        </div>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Besucher" value={stats.visitors} />
          <StatBox label="Klicks" value={stats.clicks} />
          <StatBox label="QR-Scans" value={stats.qr_scans} accent={stats.qr_scans > 0} />
          <StatBox
            label="Conversion"
            value={stats.conversion !== null ? `${stats.conversion}%` : "—"}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/studio/share" className="studio-btn studio-btn-primary text-sm">
          Zur Phase
        </Link>
        <Link href="/studio/share/distribution" className="studio-btn studio-btn-secondary text-sm">
          Links teilen
        </Link>
        <Link href="/studio/share/performance" className="studio-btn studio-btn-secondary text-sm">
          Performance
        </Link>
        <Link
          href={`/studio/share?end=${spotlight.id}`}
          className="text-xs ml-auto"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Phase beenden
        </Link>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{ background: "var(--studio-bg)", border: "1px solid var(--studio-border)" }}
    >
      <div
        className="text-2xl font-bold leading-none mb-1"
        style={{ color: accent ? "var(--studio-accent)" : "var(--studio-text-primary)" }}
      >
        {value === 0 || value === "" ? (accent ? "0" : "—") : value}
      </div>
      <div className="text-[11px]" style={{ color: "var(--studio-text-secondary)" }}>
        {label}
      </div>
    </div>
  );
}

// ─── 2. Last Phase Snapshot ───────────────────────────────────────────────────
function LastPhaseSnapshot({
  previous,
  current,
}: {
  previous: PreviousSpotlightData | null;
  current: StudioHomeData["spotlight"];
}) {
  if (!previous) return null;
  const s = previous.phase_stats;

  // Optional delta badge: previous vs current visitors
  let deltaBadge: string | null = null;
  if (current?.phase_stats && current.phase_stats.visitors > 0 && s.visitors > 0) {
    const diff = Math.round(
      ((current.phase_stats.visitors - s.visitors) / s.visitors) * 100
    );
    deltaBadge = diff > 0 ? `+${diff}% Besucher` : `${diff}% Besucher`;
  }

  return (
    <div
      className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--studio-text-secondary)" }}>
          Letzte Phase
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
          {previous.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)" }}>
          {s.visitors} Besucher · {s.clicks} Klicks
          {s.conversion !== null && ` · ${s.conversion}% Conversion`}
        </p>
      </div>
      {deltaBadge && (
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: deltaBadge.startsWith("+")
              ? "rgba(34,197,94,0.1)"
              : "rgba(239,68,68,0.1)",
            color: deltaBadge.startsWith("+") ? "var(--studio-success)" : "var(--studio-error, #ef4444)",
            border: `1px solid ${deltaBadge.startsWith("+") ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}
        >
          {deltaBadge} ggü. aktuell
        </span>
      )}
    </div>
  );
}

// ─── 3. Quick Actions ─────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Seite bearbeiten",
    href: "/studio/page",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7"/><path d="M14 2l4 4"/><path d="M18 6l-9 9-4 1 1-4 9-9"/>
      </svg>
    ),
  },
  {
    label: "Neue Phase starten",
    href: "/studio/share/new",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: "Links teilen",
    href: "/studio/share/distribution",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  {
    label: "Analyse ansehen",
    href: "/studio/results",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
] as const;

function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-xs font-semibold text-center transition-colors"
          style={{
            background: "var(--studio-surface)",
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-secondary)",
          }}
        >
          <span style={{ color: "var(--studio-accent)" }}>{action.icon}</span>
          {action.label}
        </Link>
      ))}
    </div>
  );
}

// ─── 4. Traffic Snapshot ──────────────────────────────────────────────────────
function TrafficSnapshot({ snap, page }: { snap: TrafficSnapshotData; page: StudioHomeData["page"] }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4"
      style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--studio-text-secondary)" }}>
          Traffic-Snapshot · 7 Tage
        </p>
        <div className="flex flex-wrap gap-5">
          <div>
            <span className="text-lg font-bold" style={{ color: "var(--studio-text-primary)" }}>
              {snap.visitors_7d}
            </span>
            <span className="text-xs ml-1.5" style={{ color: "var(--studio-text-secondary)" }}>
              Besucher
              {snap.trend_pct !== null && (
                <span
                  className="ml-1.5 font-semibold"
                  style={{ color: snap.trend_pct >= 0 ? "var(--studio-success)" : "var(--studio-error, #ef4444)" }}
                >
                  {snap.trend_pct >= 0 ? "↑" : "↓"} {Math.abs(snap.trend_pct)}%
                </span>
              )}
            </span>
          </div>
          {snap.top_platform && (
            <div>
              <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                Top Plattform:{" "}
                <span className="font-semibold" style={{ color: "var(--studio-text-primary)" }}>
                  {platformLabel(snap.top_platform)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      {pageUrl && page && (
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
          style={{ color: "var(--studio-accent)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: page.is_published ? "var(--studio-success)" : "var(--studio-warning)" }}
          />
          /{page.handle}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeClient({ data }: HomeClientProps) {
  const greeting = data.page?.display_name
    ? `Hi, ${data.page.display_name.split(" ")[0]}`
    : "Dashboard";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h1
          className="text-lg font-bold uppercase tracking-[0.08em]"
          style={{ color: "var(--studio-text-primary)" }}
        >
          {greeting}
        </h1>
      </div>

      {/* 1 — Active Phase */}
      <ActivePhaseCard spotlight={data.spotlight} />

      {/* 2 — Last Phase Snapshot */}
      <LastPhaseSnapshot previous={data.previous_spotlight} current={data.spotlight} />

      {/* 3 — Quick Actions */}
      <QuickActions />

      {/* 4 — Traffic Snapshot */}
      {data.traffic_snapshot && (
        <TrafficSnapshot snap={data.traffic_snapshot} page={data.page} />
      )}
    </div>
  );
}
