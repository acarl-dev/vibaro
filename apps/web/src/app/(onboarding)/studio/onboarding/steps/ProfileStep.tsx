"use client";

import type { DragEvent } from "react";
import { useRef } from "react";
import { StepHeader, FieldLabel, ActionRow } from "./onboarding-shared";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type ProfileStepProps = {
  bio: string;
  setBio: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  profileSaveStatus: SaveStatus;
  profileError: string | null;
  heroPreviewUrl: string | null;
  setHeroPreviewUrl: (url: string | null) => void;
  heroUploading: boolean;
  heroUploadError: string | null;
  setHeroUploadError: (e: string | null) => void;
  onBioChange: (bio: string) => void;
  onHeroFile: (file: File) => void;
  onContinue: () => void;
  onBack: () => void;
};

export default function ProfileStep({
  bio,
  setBio,
  genre,
  setGenre,
  profileSaveStatus,
  profileError,
  heroPreviewUrl,
  setHeroPreviewUrl,
  heroUploading,
  heroUploadError,
  setHeroUploadError,
  onBioChange,
  onHeroFile,
  onContinue,
  onBack,
}: ProfileStepProps) {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = [false, (_: boolean) => {}]; // local visual state not needed in parent

  const canContinue = bio.trim().length >= 10 && !!heroPreviewUrl && !heroUploading;

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void onHeroFile(file);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <StepHeader
          currentStep="profile"
          title="Erz\u00e4hl von dir."
          description="Ein paar S\u00e4tze, die Besucher deiner Seite lesen werden."
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <FieldLabel>Bio</FieldLabel>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                onBioChange(e.target.value);
              }}
              rows={4}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors resize-none placeholder:text-zinc-700"
              placeholder="Singer-Songwriter aus Berlin. Indie-Folk mit elektronischen Elementen \u2013 Musik, die Raum l\u00e4sst."
              autoFocus
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-700">Mindestens 10 Zeichen</p>
              <span className="text-xs text-zinc-700">{bio.length} Z.</span>
            </div>
            {profileError && <p className="text-xs text-red-400">{profileError}</p>}
          </div>

          <div className="space-y-2">
            <FieldLabel>Genre</FieldLabel>
            <input
              type="text"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
              placeholder="z.B. Indie-Folk, Electronic, Hip-Hop"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <p className="text-xs text-zinc-700">Erscheint als Tag auf deiner Seite.</p>
          </div>

          <div className="space-y-2">
            <FieldLabel>Headerbild</FieldLabel>
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onHeroFile(file);
                e.target.value = "";
              }}
            />

            {heroPreviewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreviewUrl} alt="Headerbild Vorschau" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-zinc-950/60 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    className="rounded-lg bg-zinc-800/90 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
                  >
                    Ersetzen
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHeroPreviewUrl(null); setHeroUploadError(null); }}
                    className="rounded-lg bg-zinc-800/90 px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700 transition-colors"
                  >
                    Entfernen
                  </button>
                </div>
                {heroUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70">
                    <span className="text-xs text-zinc-300">L\u00e4dt hoch\u2026</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => heroInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && heroInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 px-4 py-8 text-center cursor-pointer transition-colors select-none"
              >
                {heroUploading ? (
                  <p className="text-xs text-zinc-500">L\u00e4dt hoch\u2026</p>
                ) : (
                  <>
                    <svg className="text-zinc-600" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <div>
                      <p className="text-sm text-zinc-400">Hierher ziehen oder klicken</p>
                      <p className="text-xs text-zinc-700 mt-0.5">JPG, PNG, WebP · max. 10 MB · Empfohlen: 1500×500 px</p>
                    </div>
                  </>
                )}
              </div>
            )}
            {heroUploadError && <p className="text-xs text-red-400">{heroUploadError}</p>}
          </div>

          {profileSaveStatus !== "idle" && (
            <div className="flex items-center gap-2 text-xs">
              {profileSaveStatus === "saving" && <span className="text-zinc-600">Speichere\u2026</span>}
              {profileSaveStatus === "saved" && <span className="text-emerald-600">\u2713 Gespeichert</span>}
              {profileSaveStatus === "error" && <span className="text-red-400">Fehler beim Speichern</span>}
            </div>
          )}

          <ActionRow onBack={onBack}>
            <button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Weiter \u2192
            </button>
          </ActionRow>
        </div>
      </div>
    </div>
  );
}
