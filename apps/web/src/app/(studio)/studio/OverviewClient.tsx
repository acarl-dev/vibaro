"use client";

import { useState, useEffect } from "react";
import LivePreview from "../components/LivePreview";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
};

type Link = {
  id: number;
  title: string;
  url: string;
  position: number;
};

type OverviewClientProps = {
  initialPage: ArtistPage;
  initialLinks: Link[];
};

export default function OverviewClient({ initialPage, initialLinks }: OverviewClientProps) {
  const [displayName, setDisplayName] = useState(initialPage.display_name);
  const [bio, setBio] = useState(initialPage.bio ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [logoUploading, setLogoUploading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);

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

  const isReady = !!(
    initialPage.handle &&
    displayName.trim().length > 0 &&
    bio.trim().length > 0
  );

  const previewPage: ArtistPage = {
    ...initialPage,
    display_name: displayName,
    bio,
  };

  const handleLogoUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Datei zu gro\u00df. Maximal 2 MB erlaubt.");
      return;
    }

    setLogoUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/studio/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Upload error:", error);
        alert(`Upload fehlgeschlagen: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleHeroUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Datei zu gro\u00df. Maximal 2 MB erlaubt.");
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
        window.location.reload();
      } else {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Upload error:", error);
        alert(`Upload fehlgeschlagen: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setHeroUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Deine Seite</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bearbeite deine Inhalte und sieh dir das Ergebnis direkt an.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Profil-Basics</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-xs font-medium text-zinc-400 mb-1"
                >
                  Display Name *
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-xs font-medium text-zinc-400 mb-1"
                >
                  Bio * <span className="text-zinc-600">(max. 300 Zeichen)</span>
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  maxLength={300}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
                  placeholder="Erzähl kurz über dich..."
                />
                <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    {saveStatus === "saving" && "Speichert..."}
                    {saveStatus === "saved" && "Gespeichert"}
                  </span>
                  <span>{bio.length}/300</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Logo
                </label>
                {initialPage.avatar_url ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={initialPage.avatar_url}
                      alt="Logo"
                      className="h-16 w-16 rounded-lg object-cover border border-zinc-800"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-2">Logo hochgeladen</p>
                      <label className="inline-block">
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
                        <span className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
                          {logoUploading ? "Lädt hoch..." : "Ändern"}
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="block">
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
                    <div className="cursor-pointer flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors">
                      <span className="text-xs text-zinc-500">
                        {logoUploading ? "Lädt hoch..." : "+ Logo hochladen"}
                      </span>
                    </div>
                  </label>
                )}
                <p className="mt-2 text-xs text-zinc-600">JPG, PNG oder WebP (max. 2 MB)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Header-Bild
                </label>
                {initialPage.hero_image_url ? (
                  <div>
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 mb-2">
                      <img
                        src={initialPage.hero_image_url}
                        alt="Header-Bild"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <label className="inline-block">
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
                      <span className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
                        {heroUploading ? "Lädt hoch..." : "Ändern"}
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="block">
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
                    <div className="cursor-pointer flex items-center justify-center aspect-[16/9] rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors">
                      <span className="text-xs text-zinc-500">
                        {heroUploading ? "Lädt hoch..." : "+ Header-Bild hochladen"}
                      </span>
                    </div>
                  </label>
                )}
                <p className="mt-2 text-xs text-zinc-600">JPG, PNG oder WebP (max. 2 MB)</p>
              </div>
            </div>
          </div>

          {/* Publishing Readiness */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">
              Veröffentlichungs-Status
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {initialPage.handle ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Handle</span>
              </div>
              <div className="flex items-center gap-2">
                {displayName ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Display Name</span>
              </div>
              <div className="flex items-center gap-2">
                {bio ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Bio</span>
              </div>
            </div>

            {!isReady && (
              <p className="mt-4 text-xs text-zinc-600">
                Fülle die erforderlichen Felder aus, um zu veröffentlichen.
              </p>
            )}
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <LivePreview page={previewPage} links={initialLinks} />
        </div>
      </div>
    </div>
  );
}
