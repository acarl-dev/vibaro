"use client";

import Link from "next/link";
import ProjectStatusCard from "./ProjectStatusCard";
import TopLinksCard from "./TopLinksCard";
import PageStatusCard from "./PageStatusCard";
import type { StudioHomeData } from "@/lib/api/studio";

type HomeClientProps = {
  data: StudioHomeData;
};

// ─── Contextual tips ──────────────────────────────────────────────────────────
type Tip = { emoji: string; title: string; text: string; href: string };

function buildTips(data: StudioHomeData): Tip[] {
  const tips: (Tip & { priority: number })[] = [];

  if (!data.page?.is_published) {
    tips.push({
      priority: 1,
      emoji: "📢",
      title: "Seite veröffentlichen",
      text: "Deine Seite ist noch im Entwurf-Modus. Veröffentliche sie, damit Fans dich finden.",
      href: "/studio/page",
    });
  }

  if (!data.spotlight) {
    tips.push({
      priority: 2,
      emoji: "⚡",
      title: "Phase starten",
      text: "Starte eine Phase (Release, Live, Merch …) um deine Seite gezielt zu pushen.",
      href: "/studio/share/new",
    });
  }

  if (data.top_links.length === 0) {
    tips.push({
      priority: 3,
      emoji: "🔗",
      title: "Erste Tracking-Links anlegen",
      text: "Mit Links siehst du genau, woher dein Traffic kommt – Instagram, Spotify, Newsletter.",
      href: "/studio/share",
    });
  }

  if (data.stats.trend < -5) {
    tips.push({
      priority: 1,
      emoji: "📉",
      title: "Klicks gesunken",
      text: "Deine Klickzahlen sind diese Woche deutlich gesunken. Ein Story-Post oder neuer Link kann helfen.",
      href: "/studio/share",
    });
  }

  // Always-on best-practice tips (fill up if nothing urgent)
  tips.push(
    {
      priority: 10,
      emoji: "🎯",
      title: "Tipp: Ein Fokus zur Zeit",
      text: "Aktiviere immer nur eine Phase. Fans folgen einem klaren Signal besser als vielen gleichzeitig.",
      href: "/studio/share",
    },
    {
      priority: 10,
      emoji: "📊",
      title: "Tipp: Quellen trennen",
      text: "Erstelle für jede Plattform einen eigenen Link – so erkennst du sofort, welche Quelle am besten funktioniert.",
      href: "/studio/share",
    },
    {
      priority: 11,
      emoji: "🖼",
      title: "Tipp: Hero-Bild nutzen",
      text: "Ein starkes Hero-Bild auf deiner Seite steigert die Verweildauer und den ersten Eindruck deutlich.",
      href: "/studio/page/profile",
    }
  );

  if (data.tip) {
    tips.push({
      priority: 8,
      emoji: "💡",
      title: "Hinweis",
      text: data.tip.message,
      href: data.tip.action,
    });
  }

  return tips
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .map(({ priority: _p, ...t }) => t);
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Seite bearbeiten",
    href: "/studio/page",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7"/><path d="M14 2l4 4"/><path d="M18 6l-9 9-4 1 1-4 9-9"/>
      </svg>
    ),
  },
  {
    label: "Distribution",
    href: "/studio/share/distribution",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-5v12L3 13"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>
    ),
  },
  {
    label: "Ergebnisse",
    href: "/studio/results",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    label: "Phase",
    href: "/studio/share",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
] as const;

// ─── Tips Panel ───────────────────────────────────────────────────────────────
function TipsPanel({ tips }: { tips: Tip[] }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}
    >
      <div
        className="px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--studio-border)" }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Tipps & Hinweise
        </h2>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--studio-border)" }}>
        {tips.map((tip, i) => (
          <div key={i} className="px-5 py-4">
            <div className="flex gap-3">
              <span className="text-lg flex-shrink-0 leading-none mt-0.5">{tip.emoji}</span>
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--studio-text-primary)" }}
                >
                  {tip.title}
                </p>
                <p
                  className="text-xs leading-relaxed mb-2"
                  style={{ color: "var(--studio-text-secondary)" }}
                >
                  {tip.text}
                </p>
                <Link
                  href={tip.href}
                  className="text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "var(--studio-accent)" }}
                >
                  Jetzt erledigen →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({
  value,
  label,
  trend,
}: {
  value: string | number;
  label: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div
      className="rounded-lg px-5 py-4 flex-1"
      style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
    >
      <div
        className="text-2xl font-bold leading-none"
        style={{ color: "var(--studio-text-primary)" }}
      >
        {value === "" || value == null ? "—" : value}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
          {label}
        </span>
        {trend && (
          <span
            className="text-[10px] font-semibold"
            style={{ color: trend.positive ? "var(--studio-success)" : "#f87171" }}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeClient({ data }: HomeClientProps) {
  const tips = buildTips(data);
  const greeting = data.page?.display_name ? `Hi, ${data.page.display_name.split(" ")[0]}` : "Dashboard";
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = data.page?.handle ? `${origin}/p/${data.page.handle}` : null;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="text-lg font-bold uppercase tracking-[0.08em]"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {greeting}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--studio-text-secondary)" }}>
            Dein Studio-Überblick auf einen Blick.
          </p>
        </div>
        {/* Page status chip */}
        {data.page && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={pageUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
              style={
                data.page.is_published
                  ? { background: "rgba(34,197,94,0.12)", color: "var(--studio-success)", border: "1px solid rgba(34,197,94,0.25)" }
                  : { background: "rgba(245,158,11,0.12)", color: "var(--studio-warning)", border: "1px solid rgba(245,158,11,0.25)" }
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: data.page.is_published ? "var(--studio-success)" : "var(--studio-warning)" }}
              />
              {data.page.is_published ? "Live" : "Entwurf"}
              {pageUrl && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              )}
            </a>
          </div>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className="flex gap-3 mb-5 flex-wrap sm:flex-nowrap">
        <StatPill
          value={data.stats.total_clicks_7d}
          label="Klicks (7 Tage)"
          trend={
            data.stats.trend !== 0
              ? { value: `${data.stats.trend > 0 ? "+" : ""}${data.stats.trend}%`, positive: data.stats.trend > 0 }
              : undefined
          }
        />
        <StatPill value={data.top_links.length || "—"} label="Tracking-Links" />
        <StatPill
          value={
            data.spotlight
              ? data.spotlight.status === "active"
                ? "Aktiv"
                : "Geplant"
              : "—"
          }
          label="Aktives Modul"
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: "var(--studio-surface)",
              border: "1px solid var(--studio-border)",
              color: "var(--studio-text-secondary)",
            }}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          <ProjectStatusCard spotlight={data.spotlight} />
          <TopLinksCard links={data.top_links} stats={data.stats} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <PageStatusCard page={data.page} />
          <TipsPanel tips={tips} />
        </div>
      </div>
    </div>
  );
}

