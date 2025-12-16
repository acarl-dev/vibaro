"use client";

import { useState, useEffect } from "react";
import LivePreview from "../../components/LivePreview";

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
  const [displayName, setDisplayName] = useState(initialPage.display_name);
  const [bio, setBio] = useState(initialPage.bio ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Debounced autosave
  useEffect(() => {
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
        });

        if (res.ok) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        }
      } catch (error) {
        console.error("Autosave failed:", error);
        setSaveStatus("idle");
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [displayName, bio, initialPage.display_name, initialPage.bio]);

  const previewPage: ArtistPage = {
    ...initialPage,
    display_name: displayName,
    bio,
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bearbeite deine Profil-Informationen und Bilder.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-300">Basis-Informationen</h2>
              {saveStatus !== "idle" && (
                <span className="text-xs text-zinc-500">
                  {saveStatus === "saving" ? "Speichert..." : "Gespeichert"}
                </span>
              )}
            </div>

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
                  rows={5}
                  maxLength={300}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
                  placeholder="Erzähl kurz über dich..."
                />
                <div className="mt-1 text-right text-xs text-zinc-600">
                  {bio.length}/300
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Bilder</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Hero Image <span className="text-zinc-600">(bevorzugt)</span>
                </label>
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  {initialPage.hero_image_url ? (
                    <>
                      <p className="text-xs text-zinc-400 mb-2">
                        {initialPage.hero_image_url.slice(0, 40)}...
                      </p>
                      <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Ändern (TODO)
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-zinc-600 mb-2">Kein Bild hochgeladen</p>
                      <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Bild hinzufügen (TODO)
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Avatar <span className="text-zinc-600">(Fallback, wenn kein Hero)</span>
                </label>
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  {initialPage.avatar_url ? (
                    <>
                      <p className="text-xs text-zinc-400 mb-2">
                        {initialPage.avatar_url.slice(0, 40)}...
                      </p>
                      <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Ändern (TODO)
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-zinc-600 mb-2">Kein Bild hochgeladen</p>
                      <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Bild hinzufügen (TODO)
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <LivePreview page={previewPage} />
        </div>
      </div>
    </div>
  );
}
