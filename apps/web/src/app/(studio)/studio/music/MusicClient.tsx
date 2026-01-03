"use client";

import { useState } from "react";

type FeaturedTrack = {
  id: number;
  title: string;
  artist_name: string | null;
  platform: "spotify" | "soundcloud" | "youtube";
  platform_url: string;
  embed_id: string | null;
  position: number;
};

type MusicClientProps = {
  initialTracks: FeaturedTrack[];
};

const platformLabels = {
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  youtube: "YouTube",
};

export default function MusicClient({ initialTracks }: MusicClientProps) {
  const [tracks, setTracks] = useState<FeaturedTrack[]>(initialTracks);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist_name: "",
    platform: "spotify" as "spotify" | "soundcloud" | "youtube",
    platform_url: "",
  });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!formData.title || !formData.platform_url) {
      setError("Titel und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/featured-tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          artist_name: formData.artist_name || null,
          platform: formData.platform,
          platform_url: formData.platform_url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTracks([...tracks, json.data].sort((a, b) => a.position - b.position));
        setFormData({ title: "", artist_name: "", platform: "spotify", platform_url: "" });
        setIsCreating(false);
        setError("");
      } else {
        const json = await res.json();
        setError(json.error?.message || "Erstellen fehlgeschlagen");
      }
    } catch {
      setError("Erstellen fehlgeschlagen");
    }
  };

  const handleUpdate = async (trackId: number) => {
    if (!formData.title || !formData.platform_url) {
      setError("Titel und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/featured-tracks/${trackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          artist_name: formData.artist_name || null,
          platform: formData.platform,
          platform_url: formData.platform_url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTracks(tracks.map((t) => (t.id === trackId ? json.data : t)));
        setEditingId(null);
        setFormData({ title: "", artist_name: "", platform: "spotify", platform_url: "" });
        setError("");
      } else {
        setError("Aktualisierung fehlgeschlagen");
      }
    } catch {
      setError("Aktualisierung fehlgeschlagen");
    }
  };

  const handleDelete = async (trackId: number) => {
    if (!confirm("Track wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/featured-tracks/${trackId}`, {
        method: "DELETE",
      });

      if (res.ok || res.status === 204) {
        setTracks(tracks.filter((t) => t.id !== trackId));
      }
    } catch {
      setError("Löschen fehlgeschlagen");
    }
  };

  const startEditing = (track: FeaturedTrack) => {
    setEditingId(track.id);
    setFormData({
      title: track.title,
      artist_name: track.artist_name || "",
      platform: track.platform,
      platform_url: track.platform_url,
    });
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ title: "", artist_name: "", platform: "spotify", platform_url: "" });
    setError("");
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setFormData({ title: "", artist_name: "", platform: "spotify", platform_url: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Music</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Wähle bis zu 5-7 Tracks aus, die auf deiner Seite abgespielt werden können.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create Button */}
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
          >
            + Track hinzufügen
          </button>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="mb-4 text-lg font-medium">Neuer Track</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                  placeholder="Lost in the City"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Artist Name (optional)</label>
                <input
                  type="text"
                  value={formData.artist_name}
                  onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                  placeholder="Emily J. ft. John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Plattform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as "spotify" | "soundcloud" | "youtube",
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                >
                  <option value="spotify">Spotify</option>
                  <option value="soundcloud">SoundCloud</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">URL *</label>
                <input
                  type="url"
                  value={formData.platform_url}
                  onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                  placeholder="https://open.spotify.com/track/..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  Erstellen
                </button>
                <button
                  onClick={cancelCreating}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracks List */}
        {tracks.length === 0 && !isCreating ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-6 py-12 text-center">
            <p className="text-sm text-zinc-400">Noch keine Tracks hinzugefügt.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6"
              >
                {editingId === track.id ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Track bearbeiten</h3>
                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">Titel *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">Artist Name</label>
                      <input
                        type="text"
                        value={formData.artist_name}
                        onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">Plattform *</label>
                      <select
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platform: e.target.value as "spotify" | "soundcloud" | "youtube",
                          })
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                      >
                        <option value="spotify">Spotify</option>
                        <option value="soundcloud">SoundCloud</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">URL *</label>
                      <input
                        type="url"
                        value={formData.platform_url}
                        onChange={(e) =>
                          setFormData({ ...formData, platform_url: e.target.value })
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm focus:border-zinc-700 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleUpdate(track.id)}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">{track.title}</h3>
                      {track.artist_name && (
                        <p className="text-sm text-zinc-400">{track.artist_name}</p>
                      )}
                      <p className="mt-2 text-xs text-zinc-500">
                        {platformLabels[track.platform]} • {track.platform_url}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(track)}
                        className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
