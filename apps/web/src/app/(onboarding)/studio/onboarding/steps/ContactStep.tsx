"use client";

import { useState, useRef } from "react";
import { studioFetch } from "@/lib/api/client-fetch";
import { getInitials } from "@/app/(public)/p/components/helpers";
import PhaseHero from "@/components/public-page/PhaseHero";
import type { SpotlightItem } from "@/app/(public)/p/components/types";

type PreviewStepProps = {
  artistPageId: number | null;
  displayName: string;
  handle: string;
  initialBio?: string;
  activeSpotlight?: SpotlightItem | null;
  onFinish: () => void;
  onBack: () => void;
  finishing: boolean;
  finishError: string | null;
};

export default function PreviewStep({
  artistPageId,
  displayName,
  handle,
  initialBio,
  activeSpotlight,
  onFinish,
  onBack,
  finishing,
  finishError,
}: PreviewStepProps) {
  const [editField, setEditField] = useState<"bio" | "name" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localBio, setLocalBio] = useState(initialBio ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [focalMode, setFocalMode] = useState(false);
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(35);
  const [focalSaving, setFocalSaving] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  function openEdit(field: "bio" | "name") {
    setEditValue(field === "name" ? localDisplayName : localBio);
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
      if (editField === "bio") setLocalBio(editValue.trim());
      setEditField(null);
    } catch {
      setEditError("Netzwerkfehler.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleHeroUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setHeroError("Datei zu groß. Maximal 10 MB erlaubt.");
      return;
    }
    setHeroUploading(true);
    setHeroError(null);
    const formData = new FormData();
    formData.append("hero_image", file);
    try {
      const res = await fetch("/api/studio/upload-hero", { method: "POST", body: formData });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const fields = (json as { error?: { fields?: Record<string, string[]> } } | null)?.error?.fields;
        const msg = (json as { error?: { message?: string } } | null)?.error?.message;
        setHeroError(fields ? Object.values(fields).flat()[0] : (msg ?? "Upload fehlgeschlagen."));
        return;
      }
      const url = (json as { data?: { hero_image_url?: string } } | null)?.data?.hero_image_url ?? null;
      if (url) setHeroImageUrl(url);
    } catch {
      setHeroError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setHeroUploading(false);
    }
  }

  async function saveFocalPoint(x: number, y: number) {
    setFocalX(x);
    setFocalY(y);
    setFocalSaving(true);
    try {
      const res = await fetch("/api/studio/update-hero-focal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_focal_x: x, hero_focal_y: y }),
      });
      if (!res.ok) setHeroError("Fokuspunkt konnte nicht gespeichert werden.");
    } catch {
      setHeroError("Netzwerkfehler.");
    } finally {
      setFocalSaving(false);
      setFocalMode(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050507" }}>
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          type="button"
          onClick={onBack}
          disabled={finishing}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40 shrink-0"
        >
          ← Zurück
        </button>
        <div className="text-center px-4">
          <p className="text-base font-semibold text-zinc-50 tracking-tight">Das ist eure Bandseite mit aktuellem Fokus.</p>
          <p className="text-xs text-zinc-500 mt-0.5">Im Studio verteilt ihr Links und prüft später, was funktioniert.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onFinish}
            disabled={finishing}
            className="rounded-full bg-zinc-50 px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {finishing ? "Wird gestartet…" : "Fertig →"}
          </button>
          {finishError && <p className="text-xs text-red-400">{finishError}</p>}
        </div>
      </div>

      {/* Editable stage-hero preview */}
      <div className="flex-1 overflow-y-auto">
        <header className="stage-hero">
          <div className="stage-hero__container">

            {/* Banner — clickable to upload/change image */}
            <div className="stage-hero__bannerWrap">
              <div className="stage-hero__banner" style={{ position: "relative" }}>
                {heroImageUrl ? (
                  <>
                    <img
                      className="stage-hero__img"
                      src={heroImageUrl}
                      alt="Header"
                      style={{ objectPosition: `${focalX}% ${focalY}%` }}
                    />
                    {/* Focal click overlay */}
                    {focalMode && (
                      <div
                        className="absolute inset-0 z-20 cursor-crosshair"
                        style={{ background: "rgba(59,130,246,0.08)", border: "2px solid rgba(96,165,250,0.5)" }}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          void saveFocalPoint(
                            Math.round(((e.clientX - rect.left) / rect.width) * 100),
                            Math.round(((e.clientY - rect.top) / rect.height) * 100),
                          );
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs font-medium">
                            Klicke auf den gewünschten Fokuspunkt
                          </div>
                        </div>
                        {/* Focal crosshair dot */}
                        <div
                          className="absolute pointer-events-none"
                          style={{ left: `${focalX}%`, top: `${focalY}%`, transform: "translate(-50%,-50%)" }}
                        >
                          <div className="w-5 h-5 rounded-full border-2 border-white bg-black/40 shadow-lg" />
                        </div>
                      </div>
                    )}
                    {/* Image action buttons — top-right corner */}
                    <div className="absolute top-3 right-3 z-30 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFocalMode((v) => !v)}
                        disabled={focalSaving}
                        className={[
                          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur-sm border transition-colors disabled:opacity-40",
                          focalMode
                            ? "bg-blue-600/90 border-blue-400/40 text-white"
                            : "bg-black/60 border-white/10 text-white hover:bg-black/80",
                        ].join(" ")}
                      >
                        {focalSaving
                          ? <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          : null}
                        {focalMode ? "Abbrechen" : "Bildausschnitt anpassen"}
                      </button>
                      <label className="cursor-pointer">
                        <input
                          ref={heroFileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={heroUploading}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleHeroUpload(f); }}
                        />
                        <div className={[
                          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-black/60 backdrop-blur-sm border border-white/10 text-white transition-colors",
                          heroUploading ? "opacity-40 cursor-not-allowed" : "hover:bg-black/80 cursor-pointer",
                        ].join(" ")}>
                          {heroUploading
                            ? <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                            : null}
                          {heroUploading ? "Lädt hoch…" : "Bild ändern"}
                        </div>
                      </label>
                    </div>
                    {heroError && (
                      <p className="absolute bottom-2 left-2 z-40 text-xs text-red-400 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                        {heroError}
                      </p>
                    )}
                  </>
                ) : (
                  /* Empty banner — clickable upload zone */
                  <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={heroUploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleHeroUpload(f); }}
                    />
                    {heroUploading ? (
                      <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    ) : (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium">{heroUploading ? "Lädt hoch…" : "Header-Bild hochladen"}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>JPG, PNG, WebP · max. 10 MB</p>
                    </div>
                    {heroError && <p className="text-xs text-red-400 mt-1">{heroError}</p>}
                  </label>
                )}
              </div>

              {/* Logo badge — initials only at onboarding */}
              <div className="stage-hero__logoWrap">
                <div className="stage-hero__logoBadge">
                  <span className="text-white font-light" style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
                    {getInitials(localDisplayName)}
                  </span>
                </div>
              </div>
            </div>

            {/* Name Dock — inline editable */}
            <div className="stage-hero__transition">
              <div className="stage-hero__nameDock">

                {/* Band name */}
                {editField === "name" ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") void saveEdit(); if (e.key === "Escape") setEditField(null); }}
                      autoFocus
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "2px solid rgba(255,255,255,0.3)",
                        outline: "none",
                        width: "100%",
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        lineHeight: 0.92,
                        fontSize: "clamp(40px, 5.2vw, 84px)",
                      }}
                    />
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button type="button" onClick={saveEdit} disabled={editSaving}
                        className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-40">
                        {editSaving ? "Speichere…" : "Speichern"}
                      </button>
                      <button type="button" onClick={() => setEditField(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Abbrechen</button>
                      {editError && <p className="text-xs text-red-400">{editError}</p>}
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => openEdit("name")} className="group w-full" title="Bandname bearbeiten">
                    <h1 className="stage-hero__title" style={{ display: "inline-flex", alignItems: "center", gap: "0.4em" }}>
                      {localDisplayName}
                      <svg className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ width: "0.5em", height: "0.5em" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                    </h1>
                  </button>
                )}

                {/* Bio */}
                {editField === "bio" ? (
                  <div className="space-y-3" style={{ marginTop: "clamp(32px, 4vw, 56px)" }}>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Escape") setEditField(null); }}
                      rows={3}
                      autoFocus
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.2)",
                        outline: "none",
                        width: "100%",
                        maxWidth: "80ch",
                        margin: "0 auto",
                        display: "block",
                        textAlign: "center",
                        color: "rgba(255,255,255,0.40)",
                        fontSize: "clamp(11px, 0.9vw, 13px)",
                        lineHeight: 1.45,
                        letterSpacing: "0.01em",
                        resize: "none",
                      }}
                      placeholder="Beschreibe eure Band..."
                    />
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" onClick={saveEdit} disabled={editSaving}
                        className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-40">
                        {editSaving ? "Speichere…" : "Speichern"}
                      </button>
                      <button type="button" onClick={() => setEditField(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Abbrechen</button>
                      {editError && <p className="text-xs text-red-400">{editError}</p>}
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => openEdit("bio")} className="group w-full" title="Bio bearbeiten" style={{ marginTop: "clamp(32px, 4vw, 56px)" }}>
                    {localBio ? (
                      <p className="stage-hero__subtitle" style={{ display: "inline-flex", alignItems: "flex-start", gap: "0.4em" }}>
                        <span>{localBio}</span>
                        <svg className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity mt-0.5" style={{ width: "10px", height: "10px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                      </p>
                    ) : (
                      <span
                        className="inline-flex items-center gap-2 text-xs font-medium transition-colors"
                        style={{
                          color: "rgba(255,255,255,0.50)",
                          border: "1px dashed rgba(255,255,255,0.22)",
                          borderRadius: "6px",
                          padding: "6px 14px",
                        }}
                      >
                        <svg style={{ width: "12px", height: "12px", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                        Bio hinzufügen
                      </span>
                    )}
                  </button>
                )}

              </div>
            </div>

          </div>
        </header>

        {/* Phase / Spotlight preview */}
        {activeSpotlight && (
          <PhaseHero spotlight={activeSpotlight} />
        )}

        {/* Studio CTA */}
        <div className="px-6 py-6 flex items-start gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-zinc-600" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Eure Bandseite ist startklar. Im <span className="text-zinc-400 font-medium">Vibaro Studio</span> legt ihr als Nächstes euren Fokus fest, verteilt Links oder QR-Codes und prüft später die Performance dieser Phase.
          </p>
        </div>
      </div>
    </div>
  );
}

