"use client";

import { useState, useEffect } from "react";

type Video = {
  id: number;
  title: string;
  platform: string;
  video_id: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  position: number;
};

type VideosClientProps = {
  initialVideos: Video[];
};

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    platform: "youtube",
    description: "",
  });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!formData.title || !formData.url) {
      setError("Titel und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          platform: formData.platform,
          description: formData.description || null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setVideos([...videos, json.data]);
        setFormData({ title: "", url: "", platform: "youtube", description: "" });
        setIsCreating(false);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || "Erstellen fehlgeschlagen");
      }
    } catch {
      setError("Erstellen fehlgeschlagen");
    }
  };

  const handleUpdate = async (videoId: number) => {
    if (!formData.title || !formData.url) {
      setError("Titel und URL sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          platform: formData.platform,
          description: formData.description || null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setVideos(videos.map((v) => (v.id === videoId ? json.data : v)));
        setEditingId(null);
        setFormData({ title: "", url: "", platform: "youtube", description: "" });
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || "Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  const handleDelete = async (videoId: number) => {
    if (!confirm("Dieses Video wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/videos/${videoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== videoId));
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    }
  };

  const startEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      url: video.url,
      platform: video.platform,
      description: video.description || "",
    });
    setIsCreating(false);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: "", url: "", platform: "youtube", description: "" });
    setError("");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine Musikvideos und anderen Video-Content (max. 8 Videos).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Videos ({videos.length}/8)</h2>
          {!isCreating && !editingId && videos.length < 8 && (
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              + Neues Video
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
                placeholder="Video-Titel"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
              </select>
              <input
                type="url"
                placeholder="Video-URL (z.B. https://www.youtube.com/watch?v=...)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <textarea
                placeholder="Beschreibung (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
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

          {/* Videos List */}
          {videos.length === 0 && !isCreating ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Videos hinzugefügt</p>
              <button
                onClick={() => setIsCreating(true)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Erstes Video hinzufügen
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((video) => (
                <div key={video.id}>
                  {editingId === video.id ? (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      <select
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                      </select>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(video.id)}
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
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden group">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-zinc-950">
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        )}
                        {/* Platform Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-950/80 text-xs text-zinc-300">
                          {video.platform}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-zinc-100 truncate">{video.title}</p>
                            {video.description && (
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{video.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(video)}
                              className="text-xs text-zinc-500 hover:text-zinc-300 p-1"
                              title="Bearbeiten"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="text-xs text-zinc-500 hover:text-red-400 p-1"
                              title="Löschen"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
