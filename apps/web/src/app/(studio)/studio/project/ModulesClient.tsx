"use client";

import Link from "next/link";
import StudioPageHeader from "../../components/StudioPageHeader";
import {
  Mic,
  Disc,
  ShoppingBag,
  BarChart2,
  Headphones,
  ChevronRight,
} from "../../components/StudioIcons";

type ModuleStatus = "available" | "coming_soon";

type ModuleDef = {
  id: string;
  icon: React.FC<{ size?: number; className?: string }>;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  features: string[];
  effect: string;
  status: ModuleStatus;
  href?: string;
  accentVar: string; // CSS custom property name for the accent strip
};

// Each module gets a distinct hue via a local CSS variable defined on the card.
// This keeps the color definition co-located and avoids scattered hex strings.
const MODULES: ModuleDef[] = [
  {
    id: "live",
    icon: Mic,
    emoji: "🎤",
    label: "LIVE",
    tagline: "Tour- & Gig-Phase",
    description: "Mach deine nächste Show zum Mittelpunkt deiner Seite.",
    features: [
      "Nächste Show als Hero mit Countdown",
      "Kartenansicht aller Tour-Dates",
      "Show-Reminder per E-Mail",
      "Klick-Tracking pro Show",
    ],
    effect: "Tickets rücken in den Fokus. Die Seite fühlt sich aktiv an.",
    status: "coming_soon",
    accentVar: "--mod-live",
  },
  {
    id: "release",
    icon: Disc,
    emoji: "💿",
    label: "RELEASE",
    tagline: "Single · EP · Album",
    description: "Strukturiere deinen Release von Pre-Save bis Chartwoche.",
    features: [
      "Release-Cover als Hero",
      "Pre-Release & Post-Release Modus",
      "Pre-Save Integration",
      "Plattform-Klickverteilung",
    ],
    effect: "Streaming wird gezielt geführt – nicht dem Zufall überlassen.",
    status: "coming_soon",
    accentVar: "--mod-release",
  },
  {
    id: "merch",
    icon: ShoppingBag,
    emoji: "🛒",
    label: "MERCH",
    tagline: "Drop · Produktfokus",
    description: "Push dein Merch aktiv – nicht nur als Link in der Bio.",
    features: [
      "Featured Drop mit Timer",
      "Limitierte Stückzahl Anzeige",
      "Direktlink zum Shop",
      "Drop-Performance-Übersicht",
    ],
    effect: "Merch wird aktiv gepusht, nicht nur verlinkt.",
    status: "coming_soon",
    accentVar: "--mod-merch",
  },
  {
    id: "campaign",
    icon: BarChart2,
    emoji: "📣",
    label: "CAMPAIGN",
    tagline: "Werbemaßnahmen strukturieren",
    description: "Tracke woher dein Traffic kommt und welche Kampagne gewinnt.",
    features: [
      "Plattform-Kampagnenlinks (Story, Bio, Ads)",
      "Tracking pro Plattform",
      "Vergleich Kampagnen A vs B",
      "Traffic-Quelle Übersicht",
    ],
    effect: "Für Bands, die Releases gezielt pushen wollen.",
    status: "available",
    href: "/studio/project/spotlights",
    accentVar: "--mod-campaign",
  },
  {
    id: "studio",
    icon: Headphones,
    emoji: "🎧",
    label: "STUDIO",
    tagline: "Zwischenphasen & Fanbindung",
    description: "Halte Kernfans zwischen Releases mit Behind-the-Scenes engaged.",
    features: [
      '"Im Studio"-Status & Tagebuch',
      "Snippet-Teaser & Countdowns",
      "Mailinglist-Fokus",
      "Behind-the-Scenes Galerie",
    ],
    effect: "Bindet Kernfans – auch wenn gerade keine Single draußen ist.",
    status: "coming_soon",
    accentVar: "--mod-studio",
  },
];

// Module hues (HSL-based, defined once here so no scattered hex):
const MODULE_HUES: Record<string, string> = {
  "--mod-live":     "142",  // green
  "--mod-release":  "265",  // purple
  "--mod-merch":    "28",   // orange
  "--mod-campaign": "210",  // blue  (matches existing studio accent family)
  "--mod-studio":   "240",  // indigo
};

function moduleAccentStyle(accentVar: string) {
  const hue = MODULE_HUES[accentVar] ?? "210";
  return {
    "--mod-hue": hue,
    "--mod-accent": `hsl(${hue} 70% 55%)`,
    "--mod-accent-bg": `hsl(${hue} 70% 55% / 0.08)`,
    "--mod-accent-border": `hsl(${hue} 70% 55% / 0.25)`,
  } as React.CSSProperties;
}

export default function ModulesClient() {
  return (
    <div>
      <StudioPageHeader
        title="MODULE"
        subtitle="Wähle ein Modul, das deine aktuelle Phase widerspiegelt – und richte deine Seite darauf aus."
      />

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod) => (
          <ModuleCard key={mod.id} mod={mod} />
        ))}
      </div>

      {/* Footer hint */}
      <p
        className="mt-8 text-xs leading-relaxed"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        Immer nur ein Modul aktiv. Das aktive Modul bestimmt den Fokus deiner Seite und deiner Kampagnen-Links.
      </p>
    </div>
  );
}

function ModuleCard({ mod }: { mod: ModuleDef }) {
  const Icon = mod.icon;
  const isAvailable = mod.status === "available";

  return (
    <div
      style={{
        ...moduleAccentStyle(mod.accentVar),
        background: "var(--studio-surface)",
        border: "1px solid var(--studio-border)",
        borderRadius: "12px",
        overflow: "hidden",
        opacity: isAvailable ? 1 : 0.82,
      }}
    >
      {/* Accent top bar */}
      <div
        style={{
          height: "3px",
          background: isAvailable ? "var(--mod-accent)" : "var(--studio-border)",
        }}
      />

      {/* Header */}
      <div
        className="flex items-start justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--studio-border)" }}
      >
        <div className="flex items-center gap-3">
          {/* Icon bubble */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
            style={{
              background: isAvailable ? "var(--mod-accent-bg)" : "var(--studio-bg)",
              border: "1px solid",
              borderColor: isAvailable ? "var(--mod-accent-border)" : "var(--studio-border)",
              color: isAvailable ? "var(--mod-accent)" : "var(--studio-text-secondary)",
            }}
          >
            <Icon size={16} />
          </div>

          <div>
            <h2
              className="text-sm font-bold tracking-[0.08em] uppercase"
              style={{ color: "var(--studio-text-primary)" }}
            >
              {mod.emoji} {mod.label}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              {mod.tagline}
            </p>
          </div>
        </div>

        {/* Status badge */}
        {isAvailable ? (
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "var(--mod-accent-bg)",
              color: "var(--mod-accent)",
              border: "1px solid var(--mod-accent-border)",
            }}
          >
            Verfügbar
          </span>
        ) : (
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "var(--studio-bg)",
              color: "var(--studio-text-secondary)",
              border: "1px solid var(--studio-border)",
            }}
          >
            Bald
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          {mod.description}
        </p>

        {/* Feature list */}
        <ul className="space-y-1.5 mb-5">
          {mod.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span
                className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: isAvailable ? "var(--mod-accent)" : "var(--studio-text-secondary)",
                  opacity: isAvailable ? 1 : 0.5,
                }}
              />
              <span
                className="text-xs leading-relaxed"
                style={{ color: "var(--studio-text-primary)" }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Effect quote */}
        <p
          className="text-xs italic mb-5 leading-relaxed pl-3"
          style={{
            color: "var(--studio-text-secondary)",
            borderLeft: "2px solid",
            borderColor: isAvailable ? "var(--mod-accent)" : "var(--studio-border)",
          }}
        >
          {mod.effect}
        </p>

        {/* CTA */}
        {isAvailable && mod.href ? (
          <Link
            href={mod.href}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--mod-accent)",
              color: "#fff",
            }}
          >
            <span>Modul öffnen</span>
            <ChevronRight size={16} />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
            style={{
              background: "var(--studio-bg)",
              color: "var(--studio-text-secondary)",
              border: "1px solid var(--studio-border)",
            }}
          >
            <span>Bald verfügbar</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
