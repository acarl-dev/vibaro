"use client";

import Link from "next/link";
import type { SpotlightData } from "@/lib/api/studio";

type ProjectStatusCardProps = {
  spotlight: SpotlightData | null;
};

export default function ProjectStatusCard({ spotlight }: ProjectStatusCardProps) {
  if (!spotlight) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Aktuelles Projekt</h2>
            <p className="mt-1 text-zinc-500 text-sm">Noch kein Spotlight erstellt</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/studio/project"
            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Spotlight erstellen →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-zinc-400">Aktuelles Projekt</h2>
          <h3 className="mt-1 text-lg font-semibold text-zinc-100">{spotlight.title}</h3>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
              Aktiv
            </span>
            <span className="text-zinc-500">
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
        <div className="mt-4 rounded-md bg-blue-500/10 border border-blue-500/20 px-3 py-2">
          <p className="text-xs text-blue-300">
            <span className="font-medium">Hero-Banner aktiv:</span> Sichtbar auf deiner Seite
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          href="/studio/project"
          className="text-sm font-medium text-zinc-100 hover:text-white transition-colors"
        >
          Bearbeiten
        </Link>
        <Link
          href="/studio/share"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Links teilen →
        </Link>
      </div>
    </div>
  );
}
