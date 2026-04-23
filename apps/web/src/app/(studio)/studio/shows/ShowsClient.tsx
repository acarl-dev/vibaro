"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import StudioTabPage from "../../components/StudioTabPage";
import StudioButton from "../../components/StudioButton";
import ShowForm, { type ShowFormData } from "./ShowForm";
import { studioFetch } from "@/lib/api/client-fetch";

type Show = {
  id: number;
  starts_at: string;
  venue: string;
  city: string;
  address: string | null;
  ticket_url: string | null;
  price: number | null;
  is_free: boolean;
  support_acts: string[] | null;
  flyer_path: string | null;
  flyer_url?: string | null;
  status: string;
};

type ShowsClientProps = {
  initialShows: Show[];
};

const EMPTY_FORM: ShowFormData = {
  date: "",
  time: "",
  venue: "",
  city: "",
  address: "",
  ticket_url: "",
  price: "",
  is_free: false,
  support_acts: "",
};

function buildPayload(formData: ShowFormData) {
  const starts_at = `${formData.date}T${formData.time}:00`;
  const support_acts = formData.support_acts
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return {
    starts_at,
    venue: formData.venue,
    city: formData.city,
    address: formData.address || null,
    ticket_url: formData.ticket_url || null,
    price: formData.is_free ? null : formData.price ? parseFloat(formData.price) : null,
    is_free: formData.is_free,
    support_acts: support_acts.length > 0 ? support_acts : null,
  };
}

export default function ShowsClient({ initialShows }: ShowsClientProps) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ShowFormData>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [uploadingFlyer, setUploadingFlyer] = useState<number | null>(null);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortByDate = (list: Show[]) =>
    [...list].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

  const handleFlyerSelect = (file: File) => {
    setFlyerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFlyerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFlyerUpload = async (showId: number, file: File) => {
    setUploadingFlyer(showId);
    const data = new FormData();
    data.append("flyer", file);
    try {
      const res = await studioFetch(`/api/studio/shows/${showId}/upload-flyer`, {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        const flyerSrc =
          json.data.flyer_url ||
          (json.data.flyer_path
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${json.data.flyer_path}`
            : null);
        setShows((prev) =>
          prev.map((s) =>
            s.id === showId ? { ...s, flyer_path: json.data.flyer_path, flyer_url: flyerSrc } : s
          )
        );
      }
    } catch {
      // silent
    } finally {
      setUploadingFlyer(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFlyerDelete = async (showId: number) => {
    try {
      const res = await studioFetch(`/api/studio/shows/${showId}/flyer`, { method: "DELETE" });
      if (res.ok) {
        setShows((prev) => prev.map((s) => (s.id === showId ? { ...s, flyer_path: null } : s)));
      }
    } catch {
      // silent
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFlyerFile(null);
    setFlyerPreview(null);
    setError("");
  };

  const handleCreate = async () => {
    if (!formData.date || !formData.time || !formData.venue || !formData.city) {
      setError("Datum, Uhrzeit, Venue und Stadt sind erforderlich");
      return;
    }
    try {
      const res = await studioFetch("/api/studio/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!res.ok) { setError("Erstellen fehlgeschlagen"); return; }
      const json = await res.json();
      let newShow: Show = json.data;
      if (flyerFile) {
        await handleFlyerUpload(newShow.id, flyerFile);
        const refreshRes = await studioFetch("/api/studio/shows");
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const updated = refreshJson.data.find((s: Show) => s.id === newShow.id);
          if (updated) newShow = updated;
        }
      }
      setShows((prev) => sortByDate([...prev, newShow]));
      resetForm();
      setIsCreating(false);
    } catch {
      setError("Erstellen fehlgeschlagen");
    }
  };

  const handleUpdate = async (showId: number) => {
    if (!formData.date || !formData.time || !formData.venue || !formData.city) {
      setError("Datum, Uhrzeit, Venue und Stadt sind erforderlich");
      return;
    }
    try {
      const res = await studioFetch(`/api/studio/shows/${showId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!res.ok) { setError("Aktualisieren fehlgeschlagen"); return; }
      const json = await res.json();
      let updatedShow: Show = json.data;
      if (flyerFile) {
        await handleFlyerUpload(showId, flyerFile);
        const refreshRes = await studioFetch("/api/studio/shows");
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const refreshed = refreshJson.data.find((s: Show) => s.id === showId);
          if (refreshed) updatedShow = refreshed;
        }
      }
      setShows((prev) => sortByDate(prev.map((s) => (s.id === showId ? updatedShow : s))));
      setEditingId(null);
      resetForm();
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  const handleDelete = async (showId: number) => {
    if (!confirm("Diese Show wirklich l\u00f6schen?")) return;
    try {
      const res = await studioFetch(`/api/studio/shows/${showId}`, { method: "DELETE" });
      if (res.ok) setShows((prev) => prev.filter((s) => s.id !== showId));
    } catch {
      // silent
    }
  };

  const startEdit = (show: Show) => {
    const date = new Date(show.starts_at);
    setEditingId(show.id);
    setIsCreating(false);
    setFormData({
      date: format(date, "yyyy-MM-dd"),
      time: format(date, "HH:mm"),
      venue: show.venue,
      city: show.city,
      address: show.address || "",
      ticket_url: show.ticket_url || "",
      price: show.price?.toString() || "",
      is_free: show.is_free,
      support_acts: show.support_acts?.join(", ") || "",
    });
    setFlyerFile(null);
    setFlyerPreview(null);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const getFlyerSrc = (show: Show): string | null => {
    if (show.flyer_url) return show.flyer_url;
    if (show.flyer_path) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      return base ? `${base}/storage/${show.flyer_path}` : `/storage/${show.flyer_path}`;
    }
    return null;
  };

  const formatShowDate = (dateString: string) =>
    format(new Date(dateString), "EEE, d. MMM yyyy \u2022 HH:mm", { locale: de });

  return (
    <StudioTabPage title="Shows" description="Verwalte deine kommenden Konzerte und Auftritte.">
      <div className="mb-4 rounded-lg bg-blue-900/20 border border-blue-800/50 p-3 text-xs text-blue-300">
        💡 <span className="font-medium">Info:</span> Shows werden auf deiner \u00f6ffentlichen Seite
        nicht mehr angezeigt, sobald das Veranstaltungsdatum vorbei ist.
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Shows</h2>
          {!isCreating && !editingId && (
            <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
              + Neue Show
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
              <ShowForm
                formData={formData}
                onChange={setFormData}
                flyerPreview={flyerPreview}
                onFlyerSelect={handleFlyerSelect}
                onFlyerClear={() => { setFlyerFile(null); setFlyerPreview(null); }}
                onSubmit={handleCreate}
                onCancel={cancelEdit}
                submitLabel="Erstellen"
              />
            </div>
          )}

          {shows.length === 0 && !isCreating ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Shows hinzugef\u00fcgt</p>
              <StudioButton variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
                Erste Show hinzuf\u00fcgen
              </StudioButton>
            </div>
          ) : (
            shows.map((show) => (
              <div key={show.id} className={editingId === show.id ? "col-span-full" : ""}>
                {editingId === show.id ? (
                  <ShowForm
                    formData={formData}
                    onChange={setFormData}
                    flyerPreview={flyerPreview}
                    onFlyerSelect={handleFlyerSelect}
                    onFlyerClear={() => { setFlyerFile(null); setFlyerPreview(null); }}
                    existingFlyerSrc={getFlyerSrc(show)}
                    onExistingFlyerDelete={() => handleFlyerDelete(show.id)}
                    onSubmit={() => handleUpdate(show.id)}
                    onCancel={cancelEdit}
                    submitLabel="Speichern"
                  />
                ) : (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex h-full flex-col">
                    <div className="mb-4 overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-950">
                      {getFlyerSrc(show) ? (
                        <img src={getFlyerSrc(show)!} alt="Show flyer" className="h-56 w-full object-contain" />
                      ) : (
                        <div className="h-56 w-full bg-zinc-900/40 flex items-center justify-center text-zinc-600 text-2xl">\u266a</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-1">{formatShowDate(show.starts_at)}</p>
                      <p className="text-sm font-medium text-zinc-100 truncate">{show.venue}</p>
                      <p className="text-xs text-zinc-500 truncate">{show.city}</p>
                      {show.price !== null || show.is_free ? (
                        <p className="text-xs text-zinc-500 mt-1">{show.is_free ? "Freier Eintritt" : `${show.price} \u20ac`}</p>
                      ) : null}
                      {show.support_acts && show.support_acts.length > 0 && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">Support: {show.support_acts.join(", ")}</p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      {!show.flyer_path ? (
                        <div>
                          <input ref={fileInputRef} type="file" accept="image/*"
                            onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleFlyerUpload(show.id, file); }}
                            className="hidden" id={`flyer-upload-${show.id}`} />
                          <label htmlFor={`flyer-upload-${show.id}`} className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer inline-block">
                            {uploadingFlyer === show.id ? "\u23f3 Hochladen..." : "📎 Flyer hinzuf\u00fcgen"}
                          </label>
                        </div>
                      ) : (
                        <StudioButton variant="danger" size="sm" onClick={() => handleFlyerDelete(show.id)}>Flyer l\u00f6schen</StudioButton>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        <StudioButton variant="secondary" size="sm" onClick={() => startEdit(show)}>Bearbeiten</StudioButton>
                        <StudioButton variant="danger" size="sm" onClick={() => handleDelete(show.id)}>L\u00f6schen</StudioButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </StudioTabPage>
  );
}
