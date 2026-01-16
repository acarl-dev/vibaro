"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
};

type ProfileClientProps = {
  initialPage: ArtistPage;
};

export default function ProfileClient({ initialPage }: ProfileClientProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialPage.display_name);
  const [bio, setBio] = useState(initialPage.bio ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounced autosave with race condition prevention
  useEffect(() => {
    const controller = new AbortController();
    
    const timeout = setTimeout(async () => {
      const hasChanges =
        displayName !== initialPage.display_name ||
        bio !== (initialPage.bio ?? "");

      if (!hasChanges) return;

      setSaveStatus("saving");
      try {
        const res = await fetch("/api/studio/artist-page", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            display_name: displayName,
            bio: bio || null,
          }),
          signal: controller.signal,
        });

        if (res.ok && !controller.signal.aborted) {
          setSaveStatus("saved");
          setTimeout(() => {
            if (!controller.signal.aborted) {
              setSaveStatus("idle");
            }
          }, 2000);
        } else if (!controller.signal.aborted) {
          setSaveStatus("idle");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSaveStatus("idle");
        }
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [displayName, bio, initialPage.display_name, initialPage.bio]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingBio && bioTextareaRef.current) {
      const textarea = bioTextareaRef.current;
      textarea.focus();
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editingBio]);

  useEffect(() => {
    if (editingBio && bioTextareaRef.current) {
      const textarea = bioTextareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [bio, editingBio]);

  const handleHeroUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Datei zu groß. Maximal 2 MB erlaubt.");
      return;
    }

    setHeroUploading(true);
    const formData = new FormData();
    formData.append("hero_image", file);

    try {
      const res = await fetch("/api/studio/upload-hero", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(`Upload fehlgeschlagen: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      alert("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setHeroUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profil bearbeiten</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Klicke auf Elemente, um sie direkt zu bearbeiten
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {saveStatus === "saving" && (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Speichert...
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <svg className="h-3 w-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Gespeichert
              </>
            )}
          </div>
        )}
      </div>

      {/* Live Preview with Inline Editing */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 overflow-hidden">
        {/* Hero Image Section with Name & Bio */}
        <div className="relative group">
          {initialPage.hero_image_url ? (
            <div className="relative aspect-[21/9] bg-zinc-900">
              <img
                src={initialPage.hero_image_url}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div
                className="hidden md:block absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0) 45%, rgba(9,9,11,0.35) 55%, rgba(9,9,11,0.65) 70%, rgba(9,9,11,0.85) 82%, rgba(9,9,11,0.95) 92%, rgba(9,9,11,0.98) 100%)",
                }}
              />

              {/* Edit Button */}
              <label className="absolute top-4 right-4 cursor-pointer z-10">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={heroUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHeroUpload(file);
                  }}
                />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white hover:bg-black/80 transition-colors">
                  {heroUploading ? (
                    <>
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Lädt...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Bild ändern
                    </>
                  )}
                </div>
              </label>

              {/* Name & Bio in Hero - Editable (positioned like on public page) */}
              <div
                className="absolute"
                style={{
                  top: "68%",
                  left: 0,
                  right: 0,
                  transform: "translateY(-5%)",
                  paddingBottom: "2rem",
                }}
              >
                <div
                  className="mx-auto"
                  style={{
                    maxWidth: "980px",
                    padding: "0 clamp(16px, 4vw, 48px)",
                  }}
                >
                  {/* Display Name - Editable */}
                  <div className="mb-3">
                    {editingName ? (
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onBlur={() => setEditingName(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingName(false);
                          if (e.key === "Escape") {
                            setDisplayName(initialPage.display_name);
                            setEditingName(false);
                          }
                        }}
                        className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight bg-transparent border-b-2 border-emerald-500 text-white focus:outline-none py-2 w-full"
                        placeholder="Dein Name"
                      />
                    ) : (
                      <h1
                        onClick={() => setEditingName(true)}
                        className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-white cursor-text hover:text-emerald-400 transition-colors border-b-2 border-transparent hover:border-white/30 py-2"
                      >
                        {displayName || "Dein Name"}
                      </h1>
                    )}
                  </div>

                  {/* Bio - Editable */}
                  <div className="w-full">
                    {editingBio ? (
                      <div className="space-y-2 w-full">
                        <textarea
                          ref={bioTextareaRef}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          onBlur={() => setEditingBio(false)}
                          maxLength={300}
                          rows={1}
                          className="w-full rounded-lg border-2 border-emerald-500 bg-black/40 backdrop-blur-sm px-4 py-3 text-sm leading-relaxed text-zinc-200 focus:outline-none resize-none overflow-hidden placeholder:text-zinc-400"
                          style={{ maxWidth: "60ch" }}
                          placeholder="Erzähl kurz über dich..."
                        />
                        <div className="flex items-center justify-between text-xs text-white/70 bg-black/40 backdrop-blur-sm rounded px-3 py-1">
                          <span>Enter = Neue Zeile • ESC = Abbrechen</span>
                          <span>{bio.length}/300</span>
                        </div>
                      </div>
                    ) : (
                      <p
                        onClick={() => setEditingBio(true)}
                        className="mt-3 text-zinc-200 text-sm leading-relaxed cursor-text hover:text-white transition-colors whitespace-pre-wrap w-full"
                        style={{ maxWidth: "60ch" }}
                      >
                        {bio || <span className="text-white/60 italic">Klicke hier, um deine Bio hinzuzufügen...</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <label className="block aspect-[21/9] bg-zinc-900 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={heroUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleHeroUpload(file);
                }}
              />
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                {heroUploading ? (
                  <>
                    <svg className="animate-spin h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Lädt hoch...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Header-Bild hochladen</span>
                    <span className="text-xs mt-1">JPG, PNG oder WebP (max. 2 MB)</span>
                  </>
                )}
              </div>
            </label>
          )}
        </div>

        {/* Info Box */}
        <div className="p-8">
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-zinc-300 font-medium mb-1">So sieht dein Profil aus</p>
                <p className="text-xs text-zinc-500">
                  Dies ist eine Live-Vorschau deines öffentlichen Profils. Klicke auf Name oder Bio im Hero-Bild, um sie zu bearbeiten. Änderungen werden automatisch gespeichert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 rounded-xl border border-zinc-900 bg-zinc-900/20 p-6">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Tipps für ein starkes Profil</h3>
        <ul className="space-y-2 text-xs text-zinc-500">
          <li className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Verwende ein professionelles Header-Bild (empfohlen: 2100x900px)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Schreibe eine prägnante Bio, die deine Musik und Persönlichkeit beschreibt</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Nutze deinen echten Künstlernamen als Display Name</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Klicke auf Name oder Bio im Hero-Bild, um sie direkt zu bearbeiten</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
