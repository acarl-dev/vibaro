"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArtistPageData } from "../layout";

type StudioHeaderProps = {
  page: ArtistPageData;
};

export default function StudioHeader({ page }: StudioHeaderProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const isReady = !!(
    page.handle &&
    page.display_name.trim().length > 0 &&
    page.bio &&
    page.bio.trim().length > 0
  );
  const canPublish = !page.is_published && isReady;
  const canUnpublish = page.is_published;

  const statusLabel = page.is_published ? "Veröffentlicht" : "Entwurf";
  const statusClasses = page.is_published
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
    : "border-zinc-700 bg-zinc-900/70 text-zinc-300";

  const handlePublish = async () => {
    if (!canPublish) return;
    
    setIsPublishing(true);
    try {
      const res = await fetch("/api/studio/publish", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!canUnpublish) return;
    
    setIsPublishing(true);
    try {
      const res = await fetch("/api/studio/unpublish", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/studio"
          className="text-lg font-semibold tracking-tight hover:text-zinc-300 transition-colors"
        >
          vibaro
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <div
            className={`${statusClasses} inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                page.is_published ? "bg-emerald-400" : "bg-zinc-500"
              }`}
            />
            <span>{statusLabel}</span>
          </div>

          <Link
            href={`/p/${page.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
          >
            Vorschau
          </Link>

          <button
            onClick={page.is_published ? handleUnpublish : handlePublish}
            disabled={isPublishing || (!canPublish && !canUnpublish)}
            className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !page.is_published && !isReady
                ? "Füge Handle, Display Name und Bio hinzu"
                : undefined
            }
          >
            {isPublishing
              ? "..."
              : page.is_published
                ? "Zurückziehen"
                : "Veröffentlichen"}
          </button>
        </div>
      </div>
    </header>
  );
}
