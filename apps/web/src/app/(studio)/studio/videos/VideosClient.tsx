"use client";

import { useState } from "react";
import StudioTabPage from "../../components/StudioTabPage";
import StudioButton from "../../components/StudioButton";
import { Plus, Pencil, X } from "../../components/StudioIcons";
import { studioFetch } from "@/lib/api/client-fetch";

type Video = {
  id: number;
  title: string;
  platform: string;
  video_id: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  position: number;
  is_featured: boolean;
};

type VideosClientProps = {
  initialVideos: Video[];
};

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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
      const res = await studioFetch(`/api/studio/videos`, {
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
      const res = await studioFetch(`/api/studio/videos/${videoId}`, {
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
      const res = await studioFetch(`/api/studio/videos/${videoId}`, {
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

  const handleToggleFeatured = async (videoId: number) => {
    try {
      const res = await studioFetch(`/api/studio/videos/${videoId}/featured`, {
        method: "POST",
      });

      if (res.ok) {
        const json = await res.json();
        setVideos(videos.map((v) => ({
          ...v,
          is_featured: v.id === videoId ? json.data.is_featured : false,
        })));
      }
    } catch {
      setError("Featured-Status konnte nicht geändert werden");
    }
  };

  // Drag & Drop Reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragLeaveItem = () => {
    setDragOverIndex(null);
  };

  const handleDropItem = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder locally
    const reorderedVideos = [...videos];
    const [removed] = reorderedVideos.splice(draggedIndex, 1);
    reorderedVideos.splice(dropIndex, 0, removed);

    // Update positions
    const updatedVideos = reorderedVideos.map((vid, idx) => ({
      ...vid,
      position: idx,
    }));

    setVideos(updatedVideos);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Save new order to backend
    try {
      const videoIds = updatedVideos.map(v => v.id);
      await studioFetch('/api/studio/videos/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_ids: videoIds }),
      });
    } catch (err) {
      console.error('Failed to save order:', err);
      setError('Reihenfolge konnte nicht gespeichert werden');
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <StudioTabPage
      title="Videos"
      description="Verwalte deine Musikvideos und anderen Video-Content (max. 8 Videos)."
    >
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-zinc-300">Deine Videos ({videos.length}/8)</h2>
            {videos.length > 1 && (
              <p className="text-xs text-zinc-500 mt-1">
                💡 Ziehe Videos, um die Reihenfolge zu ändern
              </p>
            )}
          </div>
          {!isCreating && !editingId && videos.length < 8 && (
            <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
              <Plus size={14} />
              + Neues Video
            </StudioButton>
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
                <StudioButton variant="primary" size="sm" onClick={handleCreate}>
                  Erstellen
                </StudioButton>
                <StudioButton variant="secondary" size="sm" onClick={cancelEdit}>
                  Abbrechen
                </StudioButton>
              </div>
            </div>
          )}

          {/* Videos List */}
          {videos.length === 0 && !isCreating ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Videos hinzugefügt</p>
              <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
                Erstes Video hinzufügen
              </StudioButton>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div 
                  key={video.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOverItem(e, index)}
                  onDragLeave={handleDragLeaveItem}
                  onDrop={(e) => handleDropItem(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all ${
                    draggedIndex === index
                      ? "opacity-50 scale-95"
                      : dragOverIndex === index
                      ? "ring-2 ring-emerald-500/50"
                      : ""
                  }`}
                >
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
                        <StudioButton variant="primary" size="sm" onClick={() => handleUpdate(video.id)}>
                          Speichern
                        </StudioButton>
                        <StudioButton variant="secondary" size="sm" onClick={cancelEdit}>
                          Abbrechen
                        </StudioButton>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden group cursor-move relative">
                      {/* Drag handle indicator */}
                      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-zinc-950 pointer-events-none">
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
                        
                        {/* Featured Badge */}
                        {video.is_featured && (
                          <div className="absolute top-3 left-12 flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 border border-emerald-500/30">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md animate-pulse" />
                              <div className="relative w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-[10px] font-medium tracking-wider uppercase text-emerald-400/90">
                              Hero
                            </span>
                          </div>
                        )}
                        
                        {/* Platform Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-950/80 text-xs text-zinc-300">
                          {video.platform}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 pointer-events-auto">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-zinc-100 truncate">{video.title}</p>
                            {video.description && (
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{video.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleFeatured(video.id)}
                              className={`text-xs p-1 transition-colors ${
                                video.is_featured 
                                  ? 'text-emerald-400 hover:text-emerald-300' 
                                  : 'text-zinc-600 hover:text-emerald-400'
                              }`}
                              title={video.is_featured ? "Als Hero entfernen" : "Als Hero markieren"}
                            >
                              ★
                            </button>
                            <StudioButton variant="secondary" size="icon" onClick={() => startEdit(video)} title="Bearbeiten">
                              <Pencil size={13} />
                            </StudioButton>
                            <StudioButton variant="danger" size="icon" onClick={() => handleDelete(video.id)} title="Löschen">
                              <X size={13} />
                            </StudioButton>
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
    </StudioTabPage>
  );
}
