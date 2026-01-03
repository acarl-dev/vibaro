"use client";

import { useState, useRef } from "react";

type GalleryImage = {
  id: number;
  title: string | null;
  image_url: string;
  image_path: string;
  position: number;
};

type GalleryClientProps = {
  initialImages: GalleryImage[];
};

export default function GalleryClient({ initialImages }: GalleryClientProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (images.length >= 16) {
      setError("Maximale Anzahl von 16 Bildern erreicht");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/studio/gallery`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setImages([...images, json.data]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || "Upload fehlgeschlagen");
      }
    } catch {
      setError("Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTitle = async (imageId: number, newTitle: string) => {
    try {
      const res = await fetch(`/api/studio/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle || null }),
      });

      if (res.ok) {
        const json = await res.json();
        setImages(images.map((img) => (img.id === imageId ? json.data : img)));
        setEditingId(null);
        setEditTitle("");
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || "Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Dieses Bild wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/gallery/${imageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages(images.filter((img) => img.id !== imageId));
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditTitle(image.title || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setError("");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine Fotos und Press Shots (max. 16 Bilder).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Bilder ({images.length}/16)</h2>
          {images.length < 16 && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                className="hidden"
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors cursor-pointer ${
                  uploading
                    ? "text-zinc-600 cursor-not-allowed"
                    : "text-zinc-400 hover:text-zinc-100 hover:border-zinc-600"
                }`}
              >
                {uploading ? "⏳ Hochladen..." : "+ Bild hinzufügen"}
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="text-xs text-zinc-600 mb-3">Noch keine Bilder hinzugefügt</p>
            <label
              htmlFor="gallery-upload"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Erstes Bild hochladen
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800"
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(image)}
                    className="w-8 h-8 rounded-full bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center justify-center"
                    title="Titel bearbeiten"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="w-8 h-8 rounded-full bg-zinc-800/90 text-zinc-300 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                    title="Löschen"
                  >
                    ✕
                  </button>
                </div>

                {/* Title overlay at bottom */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs text-white truncate">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Title Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Bildtitel bearbeiten</h3>
            <input
              type="text"
              placeholder="Titel (optional)"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateTitle(editingId, editTitle)}
                className="px-4 py-2 text-sm bg-zinc-50 text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
