"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import StudioTabPage from "../../components/StudioTabPage";
import StudioButton from "../../components/StudioButton";

type Release = {
  id: number;
  title: string;
  release_date: string | null;
  url: string | null;
  cover_path: string | null;
  release_type?: "album" | "single" | null;
  is_featured: boolean;
};

type ReleasesClientProps = {
  initialReleases: Release[];
};

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, T>);
  }
  return [];
}

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

  useEffect(() => {
    if (initialReleases.length > 0) return;

    let isMounted = true;

    const loadReleases = async () => {
      try {
        const res = await fetch("/api/studio/releases", { method: "GET" });
        if (!res.ok) return;
        const json = await res.json();
        const items = normalizeArray<Release>(json?.data);
        if (isMounted) {
          setReleases(items);
        }
      } catch {
        // Silent fail
      }
    };

    void loadReleases();

    return () => {
      isMounted = false;
    };
  }, [initialReleases.length]);

  const handleCreate = async () => {
    const title = formData.title.trim();
    const url = formData.url.trim();
    if (!title && !url) {
      setError("Titel oder Link sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/releases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          release_date: formData.release_date || null,
          url: url || null,
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
    const title = formData.title.trim();
    const url = formData.url.trim();
    if (!title && !url) {
      setError("Titel oder Link sind erforderlich");
      return;
    }

    try {
      const res = await fetch(`/api/studio/releases/${releaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          release_date: formData.release_date || null,
          url: url || null,
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
      release_date: release.release_date ?? "",
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
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return format(date, "d. MMMM yyyy", { locale: de });
  };

  const getCoverSrc = (release: Release): string | null => {
    if (!release.cover_path) return null;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    return base ? `${base}/storage/${release.cover_path}` : `/storage/${release.cover_path}`;
  };

  return (
    <StudioTabPage
      title="Releases"
      description="Präsentiere deine Alben, EPs und Singles."
    >
      <div className="mb-4 rounded-lg bg-blue-900/20 border border-blue-800/50 p-3 text-xs text-blue-300">
        💡 <span className="font-medium">Info:</span> Markierte Releases erscheinen als „New Release“ ganz oben auf deiner Künstlerseite.
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Releases</h2>
          {!isCreating && !editingId && (
            <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
              + Neues Release
            </StudioButton>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Form */}
          {isCreating && (
            <div className="col-span-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
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
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                  />
                  Als "New Release" hervorheben
                </label>
                <p className="text-[10px] text-zinc-600 ml-5">Wird prominent ganz oben auf deiner Künstlerseite angezeigt</p>
              </div>
              
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
                <StudioButton variant="primary" size="sm" onClick={handleCreate}>
                  Erstellen
                </StudioButton>
                <StudioButton variant="secondary" size="sm" onClick={cancelEdit}>
                  Abbrechen
                </StudioButton>
              </div>
            </div>
          )}

          {/* Releases List */}
          {releases.length === 0 && !isCreating ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Releases hinzugefügt</p>
              <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
                Erstes Release hinzufügen
              </StudioButton>
            </div>
          ) : (
            releases.map((release) => {
              const coverSrc = getCoverSrc(release);
              return (
                <div key={release.id} className={editingId === release.id ? "col-span-full" : ""}>
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
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                        />
                        Als "New Release" hervorheben
                      </label>
                      <p className="text-[10px] text-zinc-600 ml-5">Wird prominent ganz oben auf deiner Künstlerseite angezeigt</p>
                    </div>
                    
                    {/* Cover Upload in Edit */}
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Cover (optional)</label>
                      {release.cover_path && !coverPreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                          {coverSrc && (
                            <img 
                              src={coverSrc}
                              alt="Current cover" 
                              className="w-full h-full object-cover" 
                            />
                          )}
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
                      <StudioButton variant="primary" size="sm" onClick={() => handleUpdate(release.id)}>
                        Speichern
                      </StudioButton>
                      <StudioButton variant="secondary" size="sm" onClick={cancelEdit}>
                        Abbrechen
                      </StudioButton>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex h-full flex-col">
                    <div className="relative mb-4 overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-950">
                      <div className="relative w-full pb-[100%]">
                        {coverSrc ? (
                          <img
                            src={coverSrc}
                            alt="Release cover"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-900/40 flex items-center justify-center text-zinc-600 text-2xl">
                            ♪
                          </div>
                        )}
                      </div>
                      {release.release_type && (
                        <div className="absolute top-2 left-2 rounded bg-zinc-900/80 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-200">
                          {release.release_type}
                        </div>
                      )}
                      {release.is_featured && (
                        <div className="absolute top-2 right-2 text-2xl text-yellow-400">
                          ★
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">{release.title}</p>
                      {formatReleaseDate(release.release_date ?? "") && (
                        <p className="text-xs text-zinc-500 mt-1">{formatReleaseDate(release.release_date ?? "")}</p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      {!release.cover_path ? (
                        <div>
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
                      ) : (
                        <StudioButton variant="danger" size="sm" onClick={() => handleCoverDelete(release.id)} title="Cover löschen">
                          Cover löschen
                        </StudioButton>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        <StudioButton variant="secondary" size="sm" onClick={() => startEdit(release)}>
                          Bearbeiten
                        </StudioButton>
                        <StudioButton variant="danger" size="sm" onClick={() => handleDelete(release.id)}>
                          Löschen
                        </StudioButton>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </StudioTabPage>
  );
}
