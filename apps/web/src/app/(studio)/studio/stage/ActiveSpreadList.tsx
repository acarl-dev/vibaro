"use client";

import { useState } from "react";
import type { TrackingLink } from "@/lib/api/stage";

interface ActiveSpreadListProps {
  links: TrackingLink[];
  onCopy: (url: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function ActiveSpreadList({
  links,
  onCopy,
  onDelete,
}: ActiveSpreadListProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (links.length === 0) return null;

  async function handleCopy(link: TrackingLink) {
    await onCopy(link.tracking_url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(id: number) {
    if (!confirm("Link wirklich entfernen?")) return;
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-zinc-100 mb-4">Aktive Verbreitung</h2>

      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
          >
            {/* Left: label + subtle URL */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {link.label}
              </p>
              <p className="text-xs text-zinc-600 truncate mt-0.5">
                {link.tracking_url}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(link)}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors"
              >
                {copiedId === link.id ? "Kopiert ✓" : "Kopieren"}
              </button>
              <button
                onClick={() => handleDelete(link.id)}
                disabled={deletingId === link.id}
                className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                title="Entfernen"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
