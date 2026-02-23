"use client";

import { useState } from "react";
import { getSocialIcon, getPlatformName, type SocialPlatform } from "@/lib/social-icons";

type Link = {
  id: number;
  type?: string;
  title: string | null;
  url: string | null;
  position: number;
};

type LinksClientProps = {
  initialLinks: Link[];
};

// Social media platforms that should be displayed as pre-filled fields
const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "instagram",
  "facebook",
  "tiktok",
  "x",
  "youtube",
  "spotify",
  "applemusic",
  "soundcloud",
  "bandcamp",
  "website",
];

export default function LinksClient({ initialLinks }: LinksClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [error, setError] = useState("");

  // New custom link form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleUpdateLink = async (linkId: number, url: string) => {
    const res = await fetch(`/api/studio/links/${linkId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url || null }),
    });

    if (res.ok) {
      const json = await res.json();
      setLinks((prev) => prev.map((l) => (l.id === linkId ? json.data : l)));
      setError("");
    } else {
      throw new Error("Aktualisieren fehlgeschlagen");
    }
  };

  const handleCreateLink = async () => {
    if (!newTitle.trim() && !newUrl.trim()) return;
    setIsCreating(true);
    setError("");
    try {
      const res = await fetch("/api/studio/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim() || null,
          url: newUrl.trim() || null,
          type: "custom",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setLinks([...links, json.data]);
        setNewTitle("");
        setNewUrl("");
        setShowAddForm(false);
      } else {
        const json = await res.json();
        setError(json?.message || "Erstellen fehlgeschlagen");
      }
    } catch {
      setError("Erstellen fehlgeschlagen");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    try {
      const res = await fetch(`/api/studio/links/${linkId}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== linkId));
        setError("");
      } else {
        setError("Löschen fehlgeschlagen");
      }
    } catch {
      setError("Löschen fehlgeschlagen");
    }
  };

  const handleUpdateCustomLink = async (linkId: number, title: string, url: string) => {
    try {
      const res = await fetch(`/api/studio/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null, url: url || null }),
      });

      if (res.ok) {
        const json = await res.json();
        setLinks(links.map((l) => (l.id === linkId ? json.data : l)));
        setError("");
      } else {
        setError("Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  // Group links: social media first, then custom links
  const socialLinks = links.filter((l) => SOCIAL_PLATFORMS.includes(l.type as SocialPlatform));
  const customLinks = links.filter((l) => !SOCIAL_PLATFORMS.includes(l.type as SocialPlatform));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Füge URLs zu deinen Social Media Profilen und Musikplattformen hinzu.
        </p>
      </div>

      <div className="space-y-6">
        {/* Social Media Section */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-zinc-300">Social Media & Musik</h2>
            <p className="text-xs text-zinc-600 mt-1">
              Trage einfach deine URLs ein. Leere Felder werden nicht angezeigt.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex items-center gap-3 sm:gap-2">
                  <div className="flex-shrink-0 text-zinc-400">
                    {getSocialIcon(link.type as SocialPlatform, "w-5 h-5")}
                  </div>

                  {/* Platform Name */}
                  <div className="min-w-0 sm:w-32 sm:flex-shrink-0">
                    <p className="text-sm font-medium text-zinc-300">
                      {link.title || getPlatformName(link.type as SocialPlatform)}
                    </p>
                  </div>
                </div>

                {/* URL Input */}
                <SocialLinkInput
                  linkId={link.id}
                  initialUrl={link.url ?? ""}
                  onSave={handleUpdateLink}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Links Section */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-300">Eigene Links</h2>
              <p className="text-xs text-zinc-600 mt-1">
                Füge beliebige Links mit eigenem Titel hinzu.
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Link hinzufügen
              </button>
            )}
          </div>

          <div className="space-y-3">
            {customLinks.map((link) => (
              <CustomLinkRow
                key={link.id}
                link={link}
                onUpdate={handleUpdateCustomLink}
                onDelete={handleDeleteLink}
              />
            ))}

            {customLinks.length === 0 && !showAddForm && (
              <p className="text-xs text-zinc-600 py-2">Noch keine eigenen Links vorhanden.</p>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 space-y-3">
              <p className="text-xs font-medium text-zinc-400">Neuer Link</p>
              <input
                type="text"
                placeholder="Titel (z.B. Meine Website)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <input
                type="url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateLink();
                  if (e.key === "Escape") {
                    setShowAddForm(false);
                    setNewTitle("");
                    setNewUrl("");
                  }
                }}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTitle("");
                    setNewUrl("");
                    setError("");
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateLink}
                  disabled={isCreating || (!newTitle.trim() && !newUrl.trim())}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-zinc-200 disabled:opacity-40 transition-colors"
                >
                  {isCreating ? "Speichern..." : "Speichern"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialLinkInput({
  linkId,
  initialUrl,
  onSave,
}: {
  linkId: number;
  initialUrl: string;
  onSave: (id: number, url: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialUrl);
  const [validationError, setValidationError] = useState(false);

  const handleBlur = () => {
    // Skip if unchanged
    if (value === initialUrl) return;
    // Normalize: prepend https:// if missing
    let normalized = value.trim();
    if (normalized && !/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
      setValue(normalized);
    }
    // Clear error state
    setValidationError(false);
    onSave(linkId, normalized).catch(() => setValidationError(true));
  };

  return (
    <div className="flex-1">
      <input
        type="url"
        placeholder="https://..."
        value={value}
        onChange={(e) => { setValue(e.target.value); setValidationError(false); }}
        onBlur={handleBlur}
        className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 ${
          validationError
            ? "border-red-800 focus:border-red-600 focus:ring-red-600"
            : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
        }`}
      />
      {validationError && (
        <p className="mt-1 text-xs text-red-400">Ungültige URL – bitte mit https:// beginnen.</p>
      )}
    </div>
  );
}

function CustomLinkRow({
  link,
  onUpdate,
  onDelete,
}: {
  link: { id: number; title: string | null; url: string | null };
  onUpdate: (id: number, title: string, url: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [title, setTitle] = useState(link.title || "");
  const [url, setUrl] = useState(link.url || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBlur = () => {
    onUpdate(link.id, title, url);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(link.id);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          className="w-full sm:w-40 sm:flex-shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />
        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleBlur}
          className="w-full flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex-shrink-0 rounded-lg p-2 text-zinc-600 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-40"
        title="Link löschen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
