"use client";

import { useState } from "react";
import LivePreviewPanel from "@/app/(studio)/studio/page/LivePreviewPanel";
import { studioFetch } from "@/lib/api/client-fetch";

type PreviewStepProps = {
  artistPageId: number | null;
  displayName: string;
  handle: string;
  onFinish: () => void;
  onBack: () => void;
  finishing: boolean;
  finishError: string | null;
};

const NEXT_HINTS = [
  "Füge einen echten Release-Link hinzu",
  "Lade euer Bandlogo hoch",
  "Teile eure Seite mit euren Fans",
];

export default function PreviewStep({
  artistPageId,
  displayName,
  handle,
  onFinish,
  onBack,
  finishing,
  finishError,
}: PreviewStepProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [editField, setEditField] = useState<"bio" | "name" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [localDisplayName, setLocalDisplayName] = useState(displayName);

  const base =
    process.env.NEXT_PUBLIC_WEB_URL ??
    (typeof window !== "undefined" ? window.location.origin : "https://vibaro.app");
  const externalUrl = `${base}/p/${handle}`;

  function openEdit(field: "bio" | "name") {
    setEditValue(field === "name" ? localDisplayName : "");
    setEditError(null);
    setEditField(editField === field ? null : field);
  }

  async function saveEdit() {
    if (!artistPageId || !editField) return;
    setEditSaving(true);
    setEditError(null);
    const body =
      editField === "name"
        ? { display_name: editValue.trim() || localDisplayName }
        : { bio: editValue.trim() };
    try {
      const res = await studioFetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setEditError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        return;
      }
      if (editField === "name" && editValue.trim()) setLocalDisplayName(editValue.trim());
      setEditField(null);
      setReloadKey((k) => k + 1);
    } catch {
      setEditError("Netzwerkfehler.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/40">
        <button
          type="button"
          onClick={onBack}
          disabled={finishing}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40 shrink-0"
        >
          ← Zurück
        </button>

        <div className="text-center px-4">
          <p className="text-base font-semibold text-zinc-50 tracking-tight">Das ist eure Seite.</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            <span className="text-zinc-400">{localDisplayName}</span>
            <span className="mx-1.5 text-zinc-700">·</span>
            vibaro.app/p/{handle}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-50 px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors whitespace-nowrap"
          >
            Zur Seite ↗
          </a>
          <button
            type="button"
            onClick={onFinish}
            disabled={finishing}
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {finishing ? "Wird gestartet…" : "Im Studio bearbeiten →"}
          </button>
          {finishError && <p className="text-xs text-red-400">{finishError}</p>}
        </div>
      </div>

      {/* Quick-edit strip */}
      <div className="flex-shrink-0 border-b border-zinc-800/40 bg-zinc-900/50 px-6 py-4">
        <p className="text-xs text-zinc-400 mb-3">
          Passe Name und Bio direkt hier an – ohne das Studio zu öffnen:
        </p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openEdit("name")}
            className={[
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              editField === "name"
                ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                : "border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
            ].join(" ")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
            Bandname
          </button>
          <button
            type="button"
            onClick={() => openEdit("bio")}
            className={[
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              editField === "bio"
                ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                : "border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
            ].join(" ")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
            Bio
          </button>
        </div>
      </div>

      {/* Inline edit panel */}
      {editField && (
        <div className="flex-shrink-0 border-b border-zinc-800/30 bg-zinc-900/60 px-6 py-3 space-y-2">
          {editField === "bio" ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 resize-none"
              placeholder={`${localDisplayName} ist eine Band aus der modernen Musikszene.`}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              placeholder={localDisplayName}
              autoFocus
            />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveEdit}
              disabled={editSaving}
              className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-40"
            >
              {editSaving ? "Speichere…" : "Speichern"}
            </button>
            <button
              type="button"
              onClick={() => setEditField(null)}
              className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              Abbrechen
            </button>
            {editError && <p className="text-xs text-red-400 ml-auto">{editError}</p>}
          </div>
        </div>
      )}

      {/* Live preview */}
      <div className="flex-1 min-h-0">
        <LivePreviewPanel
          previewPath={`/p/${handle}`}
          externalUrl={externalUrl}
          reloadKey={reloadKey}
          hideExternalLink
        />
      </div>

      {/* Next-step hints */}
      <div className="flex-shrink-0 border-t border-zinc-800/40 px-6 py-3 flex items-center gap-5 overflow-x-auto">
        <span className="text-[11px] text-zinc-700 whitespace-nowrap shrink-0">Als nächstes:</span>
        {NEXT_HINTS.map((hint) => (
          <span key={hint} className="text-[11px] text-zinc-600 whitespace-nowrap">
            · {hint}
          </span>
        ))}
      </div>
    </div>
  );
}

