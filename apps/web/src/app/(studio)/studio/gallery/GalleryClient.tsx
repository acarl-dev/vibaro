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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `${file.name}: Ungültiges Format (nur JPEG, PNG, WebP erlaubt)` };
    }

    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      return { valid: false, error: `${file.name}: Zu groß (${sizeMB}MB, max. 5MB)` };
    }

    return { valid: true };
  };

  const handleUpload = async (file: File) => {
    // Validate file before upload
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error! };
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/studio/gallery`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      } else {
        const errorData = await res.json();
        const errorMsg = errorData.error?.message || "Upload fehlgeschlagen";
        return { success: false, error: `${file.name}: ${errorMsg}` };
      }
    } catch {
      return { success: false, error: `${file.name}: Upload fehlgeschlagen` };
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Bitte nur Bilddateien hochladen");
      return;
    }

    const maxImages = 16;
    const availableSlots = maxImages - images.length;

    if (availableSlots <= 0) {
      setError("Maximale Anzahl von 16 Bildern erreicht");
      return;
    }

    // Limit to available slots
    const filesToUpload = imageFiles.slice(0, availableSlots);
    if (imageFiles.length > availableSlots) {
      setError(`Nur ${availableSlots} von ${imageFiles.length} Bildern hochgeladen (Maximum 16 erreicht)`);
    }

    setUploading(true);
    setError("");

    // Upload all files in parallel
    const uploadPromises = filesToUpload.map(file => handleUpload(file));
    const results = await Promise.all(uploadPromises);

    // Collect successful uploads and errors
    const successfulUploads = results.filter(r => r.success).map(r => r.data!);
    const errors = results.filter(r => !r.success).map(r => r.error!);

    // Update images with successful uploads
    if (successfulUploads.length > 0) {
      setImages([...images, ...successfulUploads]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    // Show errors if any
    if (errors.length > 0) {
      setError(errors.join("\n"));
    }

    setUploading(false);
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
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Delete error:", res.status, errorData);
        setError(errorData.error?.message || "Löschen fehlgeschlagen");
      }
    } catch (err) {
      console.error("Delete exception:", err);
      setError("Löschen fehlgeschlagen");
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
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  const maxImages = 16;
                  const availableSlots = maxImages - images.length;

                  if (availableSlots <= 0) {
                    setError("Maximale Anzahl von 16 Bildern erreicht");
                    return;
                  }

                  const filesToUpload = files.slice(0, availableSlots);
                  if (files.length > availableSlots) {
                    setError(`Nur ${availableSlots} von ${files.length} Bildern hochgeladen (Maximum 16 erreicht)`);
                  }

                  setUploading(true);
                  setError("");

                  const uploadPromises = filesToUpload.map(file => handleUpload(file));
                  const results = await Promise.all(uploadPromises);

                  const successfulUploads = results.filter(r => r.success).map(r => r.data!);
                  const errors = results.filter(r => !r.success).map(r => r.error!);

                  if (successfulUploads.length > 0) {
                    setImages([...images, ...successfulUploads]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }

                  if (errors.length > 0) {
                    setError(errors.join("\n"));
                  }

                  setUploading(false);
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
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400 whitespace-pre-line">
            {error}
          </div>
        )}

        {images.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-lg border-2 border-dashed bg-zinc-900/50 p-12 text-center transition-colors ${
              isDragging
                ? "border-zinc-600 bg-zinc-800/50"
                : "border-zinc-800"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-zinc-600 mb-1">
                {isDragging ? "Dateien hier ablegen..." : "Noch keine Bilder hinzugefügt"}
              </p>
              <p className="text-xs text-zinc-700 mb-3">
                Bilder hierher ziehen oder
              </p>
              <label
                htmlFor="gallery-upload"
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Datei auswählen
              </label>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-lg transition-colors ${
              isDragging ? "ring-2 ring-zinc-600 ring-inset bg-zinc-800/30" : ""
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 rounded-lg bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                <div className="text-center">
                  <svg className="w-16 h-16 text-zinc-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-zinc-400">Dateien hier ablegen</p>
                </div>
              </div>
            )}
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
