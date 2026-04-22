"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import StudioTabPage from "../../components/StudioTabPage";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  hero_focal_x: number | null;
  hero_focal_y: number | null;
};

type ProfileClientProps = {
  initialPage: ArtistPage;
};

export default function ProfileClient({ initialPage }: ProfileClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const maxBioLength = 400;
  const [displayName, setDisplayName] = useState(initialPage.display_name);
  const [bio, setBio] = useState(initialPage.bio ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [focalMode, setFocalMode] = useState(false);
  const [focalX, setFocalX] = useState(initialPage.hero_focal_x ?? 50);
  const [focalY, setFocalY] = useState(initialPage.hero_focal_y ?? 35);
  const [focalSaving, setFocalSaving] = useState(false);

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
        const res = await fetch("/api/studio/artist-pages", {
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
    if (file.size > 10 * 1024 * 1024) {
      showToast("Datei zu groß. Maximal 10 MB erlaubt.", "error");
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
        showToast("Header-Bild erfolgreich hochgeladen.", "success");
      } else {
        const body = await res.json().catch(() => null);
        const errorMsg = body?.error?.message as string | undefined;
        const fields = body?.error?.fields as Record<string, string[]> | undefined;
        const firstFieldError = fields ? Object.values(fields).flat()[0] : undefined;

        // Surface a friendly German message for file-size rejections
        if (
          res.status === 422 &&
          (firstFieldError?.toLowerCase().includes("kilobytes") ||
            firstFieldError?.toLowerCase().includes("size") ||
            firstFieldError?.toLowerCase().includes("too large"))
        ) {
          showToast("Datei zu groß. Maximal 10 MB erlaubt.", "error");
        } else {
          showToast(errorMsg ?? firstFieldError ?? "Upload fehlgeschlagen", "error");
        }
      }
    } catch {
      showToast("Netzwerkfehler. Bitte versuche es erneut.", "error");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleHeroDelete = async () => {
    if (!confirm("Hero-Bild wirklich entfernen?")) return;

    setHeroUploading(true);
    try {
      const res = await fetch("/api/studio/delete-hero", {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        showToast("Löschen fehlgeschlagen", "error");
      }
    } catch (err) {
      showToast("Netzwerkfehler", "error");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast("Datei zu groß. Maximal 5 MB erlaubt.", "error");
      return;
    }

    setLogoUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/studio/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh();
        showToast("Logo erfolgreich hochgeladen.", "success");
      } else {
        showToast("Upload fehlgeschlagen", "error");
      }
    } catch {
      showToast("Netzwerkfehler. Bitte versuche es erneut.", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!confirm("Logo wirklich entfernen?")) return;

    setLogoUploading(true);
    try {
      const res = await fetch("/api/studio/delete-logo", { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        showToast("Logo entfernt.", "success");
      } else {
        showToast("Löschen fehlgeschlagen", "error");
      }
    } catch {
      showToast("Netzwerkfehler", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  const saveFocalPoint = async (x: number, y: number) => {
    setFocalX(x);
    setFocalY(y);
    setFocalSaving(true);
    try {
      const res = await fetch("/api/studio/update-hero-focal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_focal_x: x, hero_focal_y: y }),
      });
      if (res.ok) {
        showToast("Fokuspunkt gespeichert.", "success");
      } else {
        showToast("Fehler beim Speichern.", "error");
      }
    } catch {
      showToast("Fehler beim Speichern.", "error");
    } finally {
      setFocalSaving(false);
      setFocalMode(false);
    }
  };

  return (
    <StudioTabPage
      title="Header"
      description="Header-Bild, Fokuspunkt, Künstlername und Bio"
      action={saveStatus !== "idle" ? (
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
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
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--studio-success)" }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Gespeichert
            </>
          )}
        </div>
      ) : undefined}
    >
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
                style={{ objectPosition: `${focalX}% ${focalY}%` }}
              />
              {/* Focal Point Crosshair */}
              <div
                className="absolute pointer-events-none z-20 transition-all duration-150"
                style={{ left: `${focalX}%`, top: `${focalY}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-black/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              {/* Focal Mode Overlay – captures click position */}
              {focalMode && (
                <div
                  className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/60 cursor-crosshair z-30"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    saveFocalPoint(x, y);
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs font-medium">
                      Klicke auf den gewünschten Fokuspunkt
                    </div>
                  </div>
                </div>
              )}

              {/* Edit/Delete Buttons */}
              <div className="absolute top-4 right-4 z-[40] flex gap-2">
                <button
                  onClick={() => setFocalMode(!focalMode)}
                  disabled={heroUploading || focalSaving}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border text-xs text-white transition-colors disabled:opacity-50 ${
                    focalMode
                      ? "bg-blue-600/90 border-blue-400/40 hover:bg-blue-600"
                      : "bg-black/60 border-white/10 hover:bg-black/80"
                  }`}
                >
                  {focalSaving ? (
                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    </svg>
                  )}
                  {focalMode ? "Abbrechen" : "Fokuspunkt"}
                </button>
                <label className="cursor-pointer">
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
                        Ändern
                      </>
                    )}
                  </div>
                </label>

                <button
                  onClick={handleHeroDelete}
                  disabled={heroUploading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/80 backdrop-blur-sm border border-red-500/20 text-xs text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Entfernen
                </button>
              </div>


            </div>
          ) : (
            <div className="relative aspect-[21/9] bg-zinc-900">
              {/* Upload Area */}
              <label className="absolute inset-0 cursor-pointer hover:bg-zinc-800/50 transition-colors flex flex-col items-center justify-center text-zinc-500">
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
                    <span className="text-xs mt-1">JPG, PNG oder WebP (max. 10 MB)</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Logo Upload Section */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">Logo</p>
              <p className="text-xs text-zinc-500 mt-0.5">Wird im Header-Badge angezeigt. Ersetzt Avatar als Logo-Quelle.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-black border border-zinc-700 overflow-hidden flex items-center justify-center">
              {initialPage.logo_url ? (
                <img src={initialPage.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white hover:bg-zinc-700 transition-colors cursor-pointer">
                  {logoUploading ? (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {initialPage.logo_url ? "Austauschen" : "Logo hochladen"}
                    </>
                  )}
                </div>
              </label>
              {initialPage.logo_url && (
                <button
                  onClick={handleLogoDelete}
                  disabled={logoUploading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-xs text-red-400 hover:bg-red-600/30 transition-colors disabled:opacity-50"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Entfernen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name & Bio Section – always visible below the hero */}
        <div
          className="px-6 py-5 flex flex-col gap-5"
          style={{ borderBottom: "1px solid var(--studio-border)" }}
        >
          {/* Künstlername */}
          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              Künstlername
            </label>
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
                className="w-full text-xl font-bold tracking-tight bg-transparent focus:outline-none py-1"
                style={{
                  color: "var(--studio-text-primary)",
                  borderBottom: "2px solid var(--studio-accent)",
                }}
                placeholder="Dein Künstlername"
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="group w-full text-left py-1 transition-colors"
                style={{ borderBottom: "2px solid var(--studio-border)" }}
              >
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ color: displayName ? "var(--studio-text-primary)" : "var(--studio-text-secondary)" }}
                >
                  {displayName || "Klicke hier, um deinen Namen einzugeben…"}
                </span>
              </button>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--studio-text-secondary)" }}
              >
                Bio
              </label>
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--studio-text-secondary)" }}
              >
                {bio.length}/{maxBioLength}
              </span>
            </div>
            {editingBio ? (
              <textarea
                ref={bioTextareaRef}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => setEditingBio(false)}
                maxLength={maxBioLength}
                rows={3}
                className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed focus:outline-none resize-none overflow-hidden"
                style={{
                  background: "var(--studio-surface-elevated)",
                  border: "2px solid var(--studio-accent)",
                  color: "var(--studio-text-primary)",
                }}
                placeholder="Erzähl kurz über dich…"
              />
            ) : (
              <button
                onClick={() => setEditingBio(true)}
                className="w-full text-left rounded-lg px-4 py-3 text-sm leading-relaxed transition-colors"
                style={{
                  background: "var(--studio-surface-elevated)",
                  border: "1px solid var(--studio-border)",
                  color: bio ? "var(--studio-text-primary)" : "var(--studio-text-secondary)",
                  minHeight: "72px",
                }}
              >
                <span className={bio ? "whitespace-pre-wrap" : "italic"}>
                  {bio || "Klicke hier, um deine Bio hinzuzufügen…"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-8">
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-zinc-300 font-medium mb-1">Fokuspunkt setzen</p>
                <p className="text-xs text-zinc-500">
                  Klicke auf „Fokuspunkt“, um festzulegen, welcher Bereich des Bilds immer sichtbar bleibt – unabhängig von der Bildschirmgröße.
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
            <span>Nutze deinen echten Künstlernamen oder Bandnamen als Display Name</span>
          </li>
        </ul>
      </div>
    </StudioTabPage>
  );
}
