"use client";

import Link from "next/link";
import type { SpotlightData } from "@/lib/api/studio";

type ProjectStatusCardProps = {
  spotlight: SpotlightData | null;
};

export default function ProjectStatusCard({ spotlight }: ProjectStatusCardProps) {
  if (!spotlight) {
    return (
      <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
        <h2 className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>Aktuelles Projekt</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--studio-text-secondary)" }}>Noch kein Projekt erstellt</p>
        <div className="mt-4">
          <Link
            href="/studio/project"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Projekt erstellen →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6"
      style={{ background: "var(--studio-surface)", borderLeft: "3px solid var(--studio-accent)", borderTop: "1px solid var(--studio-border)", borderRight: "1px solid var(--studio-border)", borderBottom: "1px solid var(--studio-border)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Aktuelles Projekt</h2>
          <h3 className="mt-1 text-lg font-bold uppercase tracking-wide" style={{ color: "var(--studio-text-primary)" }}>{spotlight.title}</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold uppercase" style={{ background: "rgba(34,197,94,0.12)", color: "var(--studio-success)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--studio-success)" }}></span>
              Aktiv
            </span>
            <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
              {spotlight.type === "release" && "Release"}
              {spotlight.type === "tour" && "Tour"}
              {spotlight.type === "single" && "Single"}
              {spotlight.type === "merch" && "Merch"}
              {spotlight.type === "other" && "Projekt"}
            </span>
          </div>
        </div>
      </div>

      {spotlight.show_on_page && (
        <div className="mt-4 rounded px-3 py-2" style={{ background: "var(--studio-accent-muted)", border: "1px solid var(--studio-accent)" }}>
          <p className="text-xs" style={{ color: "var(--studio-accent)" }}>
            <span className="font-semibold">Hero-Banner aktiv</span> – Sichtbar auf deiner Seite
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <Link href="/studio/project" className="text-sm font-medium transition-colors" style={{ color: "var(--studio-text-primary)" }}>
          Bearbeiten
        </Link>
        <Link href="/studio/share" className="text-sm font-medium transition-colors" style={{ color: "var(--studio-accent)" }}>
          Links teilen →
        </Link>
      </div>
    </div>
  );
}
