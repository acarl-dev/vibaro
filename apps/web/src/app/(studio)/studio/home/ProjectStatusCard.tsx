"use client";

import Link from "next/link";
import Image from "next/image";
import type { SpotlightData } from "@/lib/api/studio";

type ProjectStatusCardProps = {
  spotlight: SpotlightData | null;
};

const TYPE_LABELS: Record<string, string> = {
  single:     "Single",
  album:      "Album",
  video:      "Video",
  tour:       "Tour",
  event:      "Event",
  merch:      "Merch",
  livestream: "Livestream",
  collab:     "Kollaboration",
  release:    "Release",
};

const STATUS_STYLES: Record<string, string> = {
  active:    "studio-badge-live",
  scheduled: "studio-badge-draft",
  ended:     "studio-badge-ended",
};

const STATUS_LABELS: Record<string, string> = {
  active:    "Aktiv",
  scheduled: "Geplant",
  ended:     "Beendet",
};

function PlatformBadge({ platform }: { platform: string }) {
  const colorMap: Record<string, { bg: string; color: string }> = {
    Spotify:       { bg: "rgba(30,215,96,0.12)",  color: "#1ED760" },
    YouTube:       { bg: "rgba(255,0,0,0.10)",     color: "#FF0000" },
    SoundCloud:    { bg: "rgba(255,85,0,0.12)",    color: "#FF5500" },
    "Apple Music": { bg: "rgba(252,61,57,0.12)",   color: "#FC3D39" },
    TikTok:        { bg: "rgba(105,201,208,0.12)", color: "#69C9D0" },
    Instagram:     { bg: "rgba(225,48,108,0.12)",  color: "#E1306C" },
  };
  const style = colorMap[platform] ?? { bg: "rgba(128,128,128,0.12)", color: "var(--studio-text-secondary)" };
  return (
    <span
      className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {platform}
    </span>
  );
}

export default function ProjectStatusCard({ spotlight }: ProjectStatusCardProps) {
  if (!spotlight) {
    return (
      <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
        <h2 className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>Aktive Phase</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--studio-text-secondary)" }}>Keine aktive Phase</p>
        <div className="mt-4">
          <Link
            href="/studio/share/new"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Phase starten →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "var(--studio-surface)",
        borderLeft: "3px solid var(--studio-accent)",
        borderTop: "1px solid var(--studio-border)",
        borderRight: "1px solid var(--studio-border)",
        borderBottom: "1px solid var(--studio-border)",
      }}
    >
      {/* Label */}
      <h2
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        Aktive Phase
      </h2>

      {/* Cover + Info */}
      <div className="flex gap-4 mb-4">
        {/* Cover Art */}
        <div className="flex-shrink-0">
          {spotlight.cover_image_url ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
              <Image
                src={spotlight.cover_image_url}
                alt={spotlight.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "var(--studio-border)" }}
            >
              {spotlight.type === "video" ? "▶" : "🎵"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            <span className={STATUS_STYLES[spotlight.status] ?? "studio-badge-ended"}>
              {STATUS_LABELS[spotlight.status] ?? spotlight.status}
            </span>
            <span className="studio-badge-ended">
              {TYPE_LABELS[spotlight.type] || spotlight.type}
            </span>
            {spotlight.platform_name && (
              <PlatformBadge platform={spotlight.platform_name} />
            )}
          </div>

          {/* Title */}
          <h3
            className="font-bold text-base leading-tight truncate"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {spotlight.title}
          </h3>

          {/* Artist */}
          {spotlight.artist_name && (
            <p
              className="text-sm mt-0.5 truncate"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              {spotlight.artist_name}
            </p>
          )}
        </div>
      </div>

      {/* Hero Banner hint */}
      {spotlight.show_on_page && (
        <div
          className="rounded px-3 py-2 mb-4"
          style={{ background: "var(--studio-accent-muted)", border: "1px solid var(--studio-accent)" }}
        >
          <p className="text-xs" style={{ color: "var(--studio-accent)" }}>
            <span className="font-semibold">Hero-Banner aktiv</span> – Sichtbar auf deiner Seite
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/studio/share"
          className="text-sm font-medium transition-colors"
          style={{ color: "var(--studio-text-primary)" }}
        >
          Zur Phase
        </Link>
        <Link
          href="/studio/share/distribution"
          className="text-sm font-medium transition-colors"
          style={{ color: "var(--studio-accent)" }}
        >
          Distribution →
        </Link>
      </div>
    </div>
  );
}
