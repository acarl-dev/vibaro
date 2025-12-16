"use client";

import { useState } from "react";
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

type Link = {
  id: number;
  title: string;
  url: string;
  position: number;
};

type LinksClientProps = {
  initialPage: ArtistPage;
  initialLinks: Link[];
};

export default function LinksClient({ initialPage, initialLinks }: LinksClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!formData.title || !formData.url) {
      setError("Title und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch("/api/studio/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const newLink = json.data;
        setLinks([...links, newLink]);
        setFormData({ title: "", url: "" });
        setIsCreating(false);
        setError("");
      } else {
        setError("Fehler beim Erstellen");
      }
    } catch {
      setError("Fehler beim Erstellen");
    }
  };

  const handleUpdate = async (linkId: number) => {
    if (!formData.title || !formData.url) {
      setError("Title und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedLink = json.data;
        setLinks(links.map((l) => (l.id === linkId ? updatedLink : l)));
        setEditingId(null);
        setFormData({ title: "", url: "" });
        setError("");
      } else {
        setError("Fehler beim Aktualisieren");
      }
    } catch {
      setError("Fehler beim Aktualisieren");
    }
  };

  const handleDelete = async (linkId: number) => {
    if (!confirm("Diesen Link wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/links/${linkId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLinks(links.filter((l) => l.id !== linkId));
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleMove = async (linkId: number, direction: "up" | "down") => {
    const index = links.findIndex((l) => l.id === linkId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    
    setLinks(newLinks);

    // Update positions on backend
    try {
      await fetch("/api/studio/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link_ids: newLinks.map((l) => l.id),
        }),
      });
    } catch (err) {
      console.error("Fehler beim Umsortieren:", err);
    }
  };

  const startEdit = (link: Link) => {
    setEditingId(link.id);
    setFormData({ title: link.title, url: link.url });
    setIsCreating(false);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: "", url: "" });
    setError("");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Füge Links zu deiner Musik, Social Media oder anderen Projekten hinzu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-300">Deine Links</h2>
              {!isCreating && !editingId && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  + Neuer Link
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Create Form */}
              {isCreating && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Titel"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreate}
                      className="rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
                    >
                      Erstellen
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}

              {/* Links List */}
              {links.length === 0 && !isCreating ? (
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  <p className="text-xs text-zinc-600 mb-2">Noch keine Links hinzugefügt</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Ersten Link hinzufügen
                  </button>
                </div>
              ) : (
                links.map((link, index) => (
                  <div key={link.id}>
                    {editingId === link.id ? (
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        />
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) =>
                            setFormData({ ...formData, url: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(link.id)}
                            className="rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
                          >
                            Speichern
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-100 truncate">
                            {link.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMove(link.id, "up")}
                            disabled={index === 0}
                            className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                            title="Nach oben"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMove(link.id, "down")}
                            disabled={index === links.length - 1}
                            className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                            title="Nach unten"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => startEdit(link)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 p-1"
                            title="Bearbeiten"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-xs text-zinc-500 hover:text-red-400 p-1"
                            title="Löschen"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <LivePreview page={initialPage} links={links} />
        </div>
      </div>
    </div>
  );
}
