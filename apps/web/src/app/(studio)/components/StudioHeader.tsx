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

  const isReady = !!(page.handle && page.display_name && page.bio);
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
            href={page.is_published ? `/p/${page.handle}` : "#"}
            target={page.is_published ? "_blank" : undefined}
            rel={page.is_published ? "noopener noreferrer" : undefined}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              page.is_published
                ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-500 cursor-not-allowed"
            }`}
            {...(!page.is_published && {
              onClick: (e: React.MouseEvent) => e.preventDefault(),
              title: "Veröffentliche deine Seite, um die Vorschau zu sehen",
            })}
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
