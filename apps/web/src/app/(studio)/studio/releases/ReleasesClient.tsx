"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type Release = {
  id: number;
  title: string;
  release_date: string;
  url: string | null;
  cover_path: string | null;
  is_featured: boolean;
};

type ReleasesClientProps = {
  initialReleases: Release[];
};

export default function ReleasesClient({ initialReleases }: ReleasesClientProps) {
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    release_date: "",
    url: "",
    is_featured: false,
  });
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState<number | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    if (!formData.title || !formData.release_date) {
      setError("Titel und Release-Datum sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/releases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          release_date: formData.release_date,
          url: formData.url || null,
          is_featured: formData.is_featured,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        let newRelease = json.data;
        
        // Upload cover if selected
        if (coverFile) {
          await handleCoverUpload(newRelease.id, coverFile);
          // Refresh release data to get cover_path
          const refreshRes = await fetch(`/api/studio/releases`);
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const updatedRelease = refreshJson.data.find((r: Release) => r.id === newRelease.id);
            if (updatedRelease) newRelease = updatedRelease;
          }
        }
        
        setReleases([newRelease, ...releases].sort((a, b) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        ));
        setFormData({ title: "", release_date: "", url: "", is_featured: false });
        setCoverFile(null);
        setCoverPreview(null);
        setIsCreating(false);
        setError("");
      } else {
        setError("Erstellen fehlgeschlagen");
      }
    } catch {
      setError("Erstellen fehlgeschlagen");
    }
  };

  const handleUpdate = async (releaseId: number) => {
    if (!formData.title || !formData.release_date) {
      setError("Titel und Release-Datum sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/releases/${releaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          release_date: formData.release_date,
          url: formData.url || null,
          is_featured: formData.is_featured,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        let updatedRelease = json.data;
        
        // Upload cover if selected
        if (coverFile) {
          await handleCoverUpload(releaseId, coverFile);
          // Refresh release data to get cover_path
          const refreshRes = await fetch(`/api/studio/releases`);
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const refreshedRelease = refreshJson.data.find((r: Release) => r.id === releaseId);
            if (refreshedRelease) updatedRelease = refreshedRelease;
          }
        }
        
        setReleases(releases.map((r) => (r.id === releaseId ? updatedRelease : r)).sort((a, b) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        ));
        setEditingId(null);
        setFormData({ title: "", release_date: "", url: "", is_featured: false });
        setCoverFile(null);
        setCoverPreview(null);
        setError("");
      } else {
        setError("Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  const handleDelete = async (releaseId: number) => {
    if (!confirm("Dieses Release wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/releases/${releaseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReleases(releases.filter((r) => r.id !== releaseId));
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    }
  };

  const startEdit = (release: Release) => {
    setEditingId(release.id);
    setFormData({
      title: release.title,
      release_date: release.release_date,
      url: release.url || "",
      is_featured: release.is_featured,
    });
    setIsCreating(false);
    setError("");
    setCoverFile(null);
    setCoverPreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: "", release_date: "", url: "", is_featured: false });
    setError("");
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = async (releaseId: number, file: File) => {
    setUploadingCover(releaseId);
    const formData = new FormData();
    formData.append("cover", file);

    try {
      const res = await fetch(`/api/studio/releases/${releaseId}/upload-cover`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setReleases(releases.map((r) => 
          r.id === releaseId ? { ...r, cover_path: json.data.cover_path } : r
        ));
      }
    } catch {
      // Silent error handling
    } finally {
      setUploadingCover(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCoverDelete = async (releaseId: number) => {
    try {
      const res = await fetch(`/api/studio/releases/${releaseId}/cover`, {
        method: "DELETE",
      });

      if (res.ok || res.status === 204) {
        setReleases(releases.map((r) => 
          r.id === releaseId ? { ...r, cover_path: null } : r
        ));
      }
    } catch {
      // Silent error handling
    }
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d. MMMM yyyy", { locale: de });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Releases</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Präsentiere deine Alben, EPs und Singles.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Releases</h2>
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              + Neues Release
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
                placeholder="Titel (z.B. 'Mein neues Album')"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <input
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                placeholder="Release-Datum"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
              <input
                type="url"
                placeholder="Link (Spotify, Apple Music, etc.)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                />
                Als Featured markieren
              </label>
              
              {/* Cover Upload */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Cover (optional)</label>
                {coverPreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverSelect(file);
                      }}
                      className="hidden"
                      id="cover-create"
                    />
                    <label
                      htmlFor="cover-create"
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
                    >
                      🎨 Cover hinzufügen
                    </label>
                  </div>
                )}
              </div>

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

          {/* Releases List */}
          {releases.length === 0 && !isCreating ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Releases hinzugefügt</p>
              <button
                onClick={() => setIsCreating(true)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Erstes Release hinzufügen
              </button>
            </div>
          ) : (
            releases.map((release) => (
              <div key={release.id}>
                {editingId === release.id ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Titel"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <input
                      type="date"
                      value={formData.release_date}
                      onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    />
                    <input
                      type="url"
                      placeholder="Link (optional)"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <label className="flex items-center gap-2 text-xs text-zinc-400">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                      />
                      Als Featured markieren
                    </label>
                    
                    {/* Cover Upload in Edit */}
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Cover (optional)</label>
                      {release.cover_path && !coverPreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${release.cover_path}`}
                            alt="Current cover" 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            onClick={() => handleCoverDelete(release.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ) : coverPreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                          <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              setCoverFile(null);
                              setCoverPreview(null);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCoverSelect(file);
                            }}
                            className="hidden"
                            id={`cover-edit-${release.id}`}
                          />
                          <label
                            htmlFor={`cover-edit-${release.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
                          >
                            🎨 Cover hinzufügen
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(release.id)}
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
                  <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    {release.cover_path && (
                      <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-zinc-950">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${release.cover_path}`}
                          alt="Release cover"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleCoverDelete(release.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center"
                          title="Cover löschen"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-zinc-100 flex-1">{release.title}</p>
                        {release.is_featured && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{formatReleaseDate(release.release_date)}</p>
                      {release.url && (
                        <a
                          href={release.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-200 underline mt-1 inline-block"
                        >
                          🎵 Anhören
                        </a>
                      )}
                      {!release.cover_path && (
                        <div className="mt-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCoverUpload(release.id, file);
                            }}
                            className="hidden"
                            id={`cover-upload-${release.id}`}
                          />
                          <label
                            htmlFor={`cover-upload-${release.id}`}
                            className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer inline-block"
                          >
                            {uploadingCover === release.id ? "⏳ Hochladen..." : "🎨 Cover hinzufügen"}
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(release)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 p-1"
                        title="Bearbeiten"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(release.id)}
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
  );
}
