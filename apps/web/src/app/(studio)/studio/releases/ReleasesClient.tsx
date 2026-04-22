"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import StudioTabPage from "../../components/StudioTabPage";
import StudioButton from "../../components/StudioButton";
import ReleaseForm, { type ReleaseFormData } from "./ReleaseForm";

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

const EMPTY_FORM: ReleaseFormData = {
  title: "",
  release_date: "",
  url: "",
  is_featured: false,
};

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") return Object.values(value as Record<string, T>);
  return [];
}

function buildPayload(formData: ReleaseFormData) {
  const title = formData.title.trim();
  const url = formData.url.trim();
  return {
    title: title || null,
    release_date: formData.release_date || null,
    url: url || null,
    is_featured: formData.is_featured,
  };
}

export default function ReleasesClient({ initialReleases }: ReleasesClientProps) {
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ReleaseFormData>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState<number | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialReleases.length > 0) return;
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/studio/releases");
        if (!res.ok) return;
        const json = await res.json();
        const items = normalizeArray<Release>(json?.data);
        if (isMounted) setReleases(items);
      } catch { /* silent */ }
    };
    void load();
    return () => { isMounted = false; };
  }, [initialReleases.length]);

  const sortByDate = (list: Release[]) =>
    [...list].sort(
      (a, b) => new Date(b.release_date ?? 0).getTime() - new Date(a.release_date ?? 0).getTime()
    );

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview(null);
    setError("");
  };

  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = async (releaseId: number, file: File) => {
    setUploadingCover(releaseId);
    const data = new FormData();
    data.append("cover", file);
    try {
      const res = await fetch(`/api/studio/releases/${releaseId}/upload-cover`, {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        setReleases((prev) =>
          prev.map((r) => (r.id === releaseId ? { ...r, cover_path: json.data.cover_path } : r))
        );
      }
    } catch { /* silent */ } finally {
      setUploadingCover(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCoverDelete = async (releaseId: number) => {
    try {
      const res = await fetch(`/api/studio/releases/${releaseId}/cover`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setReleases((prev) => prev.map((r) => (r.id === releaseId ? { ...r, cover_path: null } : r)));
      }
    } catch { /* silent */ }
  };

  const handleCreate = async () => {
    if (!formData.title.trim() && !formData.url.trim()) {
      setError("Titel oder Link sind erforderlich");
      return;
    }
    try {
      const res = await fetch("/api/studio/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!res.ok) { setError("Erstellen fehlgeschlagen"); return; }
      const json = await res.json();
      let newRelease: Release = json.data;
      if (coverFile) {
        await handleCoverUpload(newRelease.id, coverFile);
        const refreshRes = await fetch("/api/studio/releases");
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const updated = refreshJson.data.find((r: Release) => r.id === newRelease.id);
          if (updated) newRelease = updated;
        }
      }
      setReleases((prev) => sortByDate([newRelease, ...prev]));
      resetForm();
      setIsCreating(false);
    } catch { setError("Erstellen fehlgeschlagen"); }
  };

  const handleUpdate = async (releaseId: number) => {
    if (!formData.title.trim() && !formData.url.trim()) {
      setError("Titel oder Link sind erforderlich");
      return;
    }
    try {
      const res = await fetch(`/api/studio/releases/${releaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!res.ok) { setError("Aktualisieren fehlgeschlagen"); return; }
      const json = await res.json();
      let updatedRelease: Release = json.data;
      if (coverFile) {
        await handleCoverUpload(releaseId, coverFile);
        const refreshRes = await fetch("/api/studio/releases");
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const refreshed = refreshJson.data.find((r: Release) => r.id === releaseId);
          if (refreshed) updatedRelease = refreshed;
        }
      }
      setReleases((prev) => sortByDate(prev.map((r) => (r.id === releaseId ? updatedRelease : r))));
      setEditingId(null);
      resetForm();
    } catch { setError("Aktualisieren fehlgeschlagen"); }
  };

  const handleDelete = async (releaseId: number) => {
    if (!confirm("Dieses Release wirklich l\u00f6schen?")) return;
    try {
      const res = await fetch(`/api/studio/releases/${releaseId}`, { method: "DELETE" });
      if (res.ok) setReleases((prev) => prev.filter((r) => r.id !== releaseId));
    } catch { /* silent */ }
  };

  const startEdit = (release: Release) => {
    setEditingId(release.id);
    setIsCreating(false);
    setFormData({
      title: release.title,
      release_date: release.release_date ?? "",
      url: release.url || "",
      is_featured: release.is_featured,
    });
    setCoverFile(null);
    setCoverPreview(null);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
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
    <StudioTabPage title="Releases" description="Pr\u00e4sentiere deine Alben, EPs und Singles.">
      <div className="mb-4 rounded-lg bg-blue-900/20 border border-blue-800/50 p-3 text-xs text-blue-300">
        💡 <span className="font-medium">Info:</span> Markierte Releases erscheinen als \u201eNew Release\u201c ganz oben auf deiner K\u00fcnstlerseite.
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
          {isCreating && (
            <div className="col-span-full">
              <ReleaseForm
                formData={formData}
                onChange={setFormData}
                coverPreview={coverPreview}
                onCoverSelect={handleCoverSelect}
                onCoverClear={() => { setCoverFile(null); setCoverPreview(null); }}
                onSubmit={handleCreate}
                onCancel={cancelEdit}
                submitLabel="Erstellen"
              />
            </div>
          )}

          {releases.length === 0 && !isCreating ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Releases hinzugef\u00fcgt</p>
              <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
                Erstes Release hinzuf\u00fcgen
              </StudioButton>
            </div>
          ) : (
            releases.map((release) => {
              const coverSrc = getCoverSrc(release);
              return (
                <div key={release.id} className={editingId === release.id ? "col-span-full" : ""}>
                  {editingId === release.id ? (
                    <ReleaseForm
                      formData={formData}
                      onChange={setFormData}
                      coverPreview={coverPreview}
                      onCoverSelect={handleCoverSelect}
                      onCoverClear={() => { setCoverFile(null); setCoverPreview(null); }}
                      existingCoverSrc={coverSrc}
                      onExistingCoverDelete={() => handleCoverDelete(release.id)}
                      onSubmit={() => handleUpdate(release.id)}
                      onCancel={cancelEdit}
                      submitLabel="Speichern"
                    />
                  ) : (
                    /* Release Card */
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex h-full flex-col">
                      <div className="relative mb-4 overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-950">
                        <div className="relative w-full pb-[100%]">
                          {coverSrc ? (
                            <img src={coverSrc} alt="Release cover" className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-zinc-900/40 flex items-center justify-center text-zinc-600 text-2xl">\u266a</div>
                          )}
                        </div>
                        {release.release_type && (
                          <div className="absolute top-2 left-2 rounded bg-zinc-900/80 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-200">
                            {release.release_type}
                          </div>
                        )}
                        {release.is_featured && (
                          <div className="absolute top-2 right-2 text-2xl text-yellow-400">\u2605</div>
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
                                if (file) void handleCoverUpload(release.id, file);
                              }}
                              className="hidden"
                              id={`cover-upload-${release.id}`}
                            />
                            <label
                              htmlFor={`cover-upload-${release.id}`}
                              className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer inline-block"
                            >
                              {uploadingCover === release.id ? "\u23f3 Hochladen..." : "🎨 Cover hinzuf\u00fcgen"}
                            </label>
                          </div>
                        ) : (
                          <StudioButton variant="danger" size="sm" onClick={() => handleCoverDelete(release.id)}>
                            Cover l\u00f6schen
                          </StudioButton>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          <StudioButton variant="secondary" size="sm" onClick={() => startEdit(release)}>Bearbeiten</StudioButton>
                          <StudioButton variant="danger" size="sm" onClick={() => handleDelete(release.id)}>L\u00f6schen</StudioButton>
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
