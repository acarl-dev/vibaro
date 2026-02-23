"use client";

import { useState } from "react";
import StudioTabPage from "../../components/StudioTabPage";

type FeaturedTrack = {
  id: number;
  title: string;
  artist_name: string | null;
  platform:
    | "spotify"
    | "youtubemusic"
    | "soundcloud";
  platform_url: string;
  embed_id: string | null;
  position: number;
};

type MusicClientProps = {
  initialTracks: FeaturedTrack[];
};

const platformLabels = {
  spotify: "Spotify",
  youtubemusic: "YouTube Music",
  soundcloud: "SoundCloud",
};

const buildDefaultTitle = (platform: FeaturedTrack["platform"]) =>
  `${platformLabels[platform]} Track`;

const getEmbedId = (platform: FeaturedTrack["platform"], url: string, embedId?: string | null) => {
  if (embedId) return embedId;

  if (platform === "spotify") {
    const match = url.match(
      /spotify\.com\/(?:intl-[a-z]{2}(?:-[A-Z]{2})?|[a-z]{2}(?:-[A-Z]{2})?)?\/(?:embed\/)?track\/([a-zA-Z0-9]+)/
    );
    return match?.[1] ?? null;
  }

  if (platform === "youtubemusic") {
    const match = url.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    return match?.[1] ?? null;
  }

  return null;
};

export default function MusicClient({ initialTracks }: MusicClientProps) {
  const [tracks, setTracks] = useState<FeaturedTrack[]>(initialTracks);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist_name: "",
    platform: "spotify" as
      | "spotify"
      | "youtubemusic"
      | "soundcloud",
    platform_url: "",
  });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!formData.platform_url) {
      setError("URL ist erforderlich");
      return;
    }

    const resolvedTitle = formData.title?.trim() || buildDefaultTitle(formData.platform);

    try {
      const res = await fetch(`/api/studio/featured-tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resolvedTitle,
          artist_name: null,
          platform: formData.platform,
          platform_url: formData.platform_url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTracks([...tracks, json.data].sort((a, b) => a.position - b.position));
        setFormData({
          title: "",
          artist_name: "",
          platform: "spotify",
          platform_url: "",
        });
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
    if (!formData.platform_url) {
      setError("URL ist erforderlich");
      return;
    }

    const resolvedTitle = formData.title?.trim() || buildDefaultTitle(formData.platform);

    try {
      const res = await fetch(`/api/studio/featured-tracks/${trackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resolvedTitle,
          platform: formData.platform,
          platform_url: formData.platform_url,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTracks(tracks.map((t) => (t.id === trackId ? json.data : t)));
        setEditingId(null);
        setFormData({
          title: "",
          artist_name: "",
          platform: "spotify",
          platform_url: "",
        });
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

  const startCreatingFor = (platform: FeaturedTrack["platform"]) => {
    if (editingId) return;
    setIsCreating(true);
    setFormData({
      title: buildDefaultTitle(platform),
      artist_name: "",
      platform,
      platform_url: "",
    });
    setError("");
  };

  return (
    <StudioTabPage
      title="Musik"
      description="Wähle bis zu 5-7 Tracks aus, die auf deiner Seite abgespielt werden können."
    >
      {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create Buttons */}
        {!isCreating && !editingId && (
          <div className="mb-6">
            <p className="studio-subtitle mb-3 text-sm">
              Wähle die Plattform, für die du einen Player hinzufügen möchtest.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => startCreatingFor("spotify")}
                className="studio-btn studio-btn-secondary rounded-full text-xs"
              >
                Spotify
              </button>
              <button
                onClick={() => startCreatingFor("youtubemusic")}
                className="studio-btn studio-btn-secondary rounded-full text-xs"
              >
                YouTube Music
              </button>
              <button
                onClick={() => startCreatingFor("soundcloud")}
                className="studio-btn studio-btn-secondary rounded-full text-xs"
              >
                SoundCloud
              </button>
            </div>
          </div>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="studio-card mb-6">
            <h3 className="studio-h2 mb-4 text-base">Neuer Track</h3>
            <div className="space-y-4">
              <div>
                <label className="studio-subtitle mb-2 block text-sm">Plattform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as
                        | "spotify"
                        | "youtubemusic"
                        | "soundcloud",
                      title:
                        formData.title?.trim() === buildDefaultTitle(formData.platform)
                          ? buildDefaultTitle(
                              e.target.value as FeaturedTrack["platform"]
                            )
                          : formData.title,
                    })
                  }
                  className="studio-input w-full px-3 py-2 text-sm"
                >
                  <option value="spotify">Spotify</option>
                  <option value="youtubemusic">YouTube Music</option>
                  <option value="soundcloud">SoundCloud</option>
                </select>
              </div>

              <div>
                <label className="studio-subtitle mb-2 block text-sm">URL *</label>
                <input
                  type="url"
                  value={formData.platform_url}
                  onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
                  className="studio-input w-full px-3 py-2 text-sm"
                  placeholder="https://open.spotify.com/track/..."
                />
                <p className="studio-subtitle mt-2 text-xs">
                  Wir erzeugen den Player automatisch aus der URL.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  className="studio-btn studio-btn-primary"
                >
                  Erstellen
                </button>
                <button
                  onClick={cancelCreating}
                  className="studio-btn studio-btn-secondary"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracks List */}
        {tracks.length === 0 && !isCreating ? (
          <div className="studio-card px-6 py-12 text-center">
            <p className="studio-subtitle text-sm">Noch keine Tracks hinzugefügt.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="studio-card p-4"
              >
                {editingId === track.id ? (
                  <div className="space-y-4">
                    <h3 className="studio-h2 text-base">Track bearbeiten</h3>
                    <div>
                      <label className="studio-subtitle mb-2 block text-sm">Plattform *</label>
                      <select
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platform: e.target.value as
                              | "spotify"
                              | "youtubemusic"
                              | "soundcloud",
                            title:
                              formData.title?.trim() === buildDefaultTitle(formData.platform)
                                ? buildDefaultTitle(
                                    e.target.value as FeaturedTrack["platform"]
                                  )
                                : formData.title,
                          })
                        }
                        className="studio-input w-full px-3 py-2 text-sm"
                      >
                        <option value="spotify">Spotify</option>
                        <option value="youtubemusic">YouTube Music</option>
                        <option value="soundcloud">SoundCloud</option>
                      </select>
                    </div>

                    <div>
                      <label className="studio-subtitle mb-2 block text-sm">URL *</label>
                      <input
                        type="url"
                        value={formData.platform_url}
                        onChange={(e) =>
                          setFormData({ ...formData, platform_url: e.target.value })
                        }
                        className="studio-input w-full px-3 py-2 text-sm"
                      />
                      <p className="studio-subtitle mt-2 text-xs">
                        Wir erzeugen den Player automatisch aus der URL.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleUpdate(track.id)}
                        className="studio-btn studio-btn-primary"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="studio-btn studio-btn-secondary"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 space-y-3">
                      <div className="h-[152px] overflow-hidden rounded-lg" style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface-elevated)" }}>
                        {track.platform === "spotify" && (
                          <iframe
                            src={`https://open.spotify.com/embed/track/${getEmbedId(
                              track.platform,
                              track.platform_url,
                              track.embed_id
                            )}?utm_source=generator&theme=0`}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title={track.title}
                            className="w-full"
                          />
                        )}

                        {track.platform === "soundcloud" && (
                          <iframe
                            width="100%"
                            height="152"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                              track.platform_url
                            )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                            title={track.title}
                            className="w-full"
                          />
                        )}

                        {track.platform === "youtubemusic" && getEmbedId(track.platform, track.platform_url, track.embed_id) && (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${getEmbedId(
                              track.platform,
                              track.platform_url,
                              track.embed_id
                            )}`}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={track.title}
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(track)}
                        className="studio-btn studio-btn-secondary"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="studio-btn studio-btn-danger"
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
    </StudioTabPage>
  );
}
