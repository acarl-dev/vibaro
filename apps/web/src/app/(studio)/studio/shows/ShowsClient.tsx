"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type ArtistSuggestion = {
  id: number;
  handle: string;
  display_name: string;
  avatar_url: string | null;
};

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
  status: string;
};

type ShowsClientProps = {
  initialShows: Show[];
};

export default function ShowsClient({ initialShows }: ShowsClientProps) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    venue: "",
    city: "",
    address: "",
    ticket_url: "",
    price: "",
    is_free: false,
    support_acts: "",
  });
  const [error, setError] = useState("");
  const [uploadingFlyer, setUploadingFlyer] = useState<number | null>(null);
  const [supportActSuggestions, setSupportActSuggestions] = useState<ArtistSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    if (!formData.date || !formData.time || !formData.venue || !formData.city) {
      setError("Datum, Uhrzeit, Venue und Stadt sind erforderlich");
      return;
    }

    const starts_at = `${formData.date}T${formData.time}:00`;
    const support_acts_array = formData.support_acts
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch(`/api/studio/shows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          starts_at,
          venue: formData.venue,
          city: formData.city,
          address: formData.address || null,
          ticket_url: formData.ticket_url || null,
          price: formData.is_free ? null : (formData.price ? parseFloat(formData.price) : null),
          is_free: formData.is_free,
          support_acts: support_acts_array.length > 0 ? support_acts_array : null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        let newShow = json.data;
        
        // Upload flyer if selected
        if (flyerFile) {
          await handleFlyerUpload(newShow.id, flyerFile);
          // Refresh show data to get flyer_path
          const refreshRes = await fetch(`/api/studio/shows`);
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const updatedShow = refreshJson.data.find((s: Show) => s.id === newShow.id);
            if (updatedShow) newShow = updatedShow;
          }
        }
        
        setShows([...shows, newShow].sort((a, b) => 
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        ));
        setFormData({ date: "", time: "", venue: "", city: "", address: "", ticket_url: "", price: "", is_free: false, support_acts: "" });
        setFlyerFile(null);
        setFlyerPreview(null);
        setIsCreating(false);
        setError("");
      } else {
        setError("Erstellen fehlgeschlagen");
      }
    } catch {
      setError("Erstellen fehlgeschlagen");
    }
  };

  const handleUpdate = async (showId: number) => {
    if (!formData.date || !formData.time || !formData.venue || !formData.city) {
      setError("Datum, Uhrzeit, Venue und Stadt sind erforderlich");
      return;
    }

    const starts_at = `${formData.date}T${formData.time}:00`;
    const support_acts_array = formData.support_acts
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch(`/api/studio/shows/${showId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          starts_at,
          venue: formData.venue,
          city: formData.city,
          address: formData.address || null,
          ticket_url: formData.ticket_url || null,
          price: formData.is_free ? null : (formData.price ? parseFloat(formData.price) : null),
          is_free: formData.is_free,
          support_acts: support_acts_array.length > 0 ? support_acts_array : null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        let updatedShow = json.data;
        
        // Upload flyer if selected
        if (flyerFile) {
          await handleFlyerUpload(showId, flyerFile);
          // Refresh show data to get flyer_path
          const refreshRes = await fetch(`/api/studio/shows`);
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const refreshedShow = refreshJson.data.find((s: Show) => s.id === showId);
            if (refreshedShow) updatedShow = refreshedShow;
          }
        }
        
        setShows(shows.map((s) => (s.id === showId ? updatedShow : s)).sort((a, b) => 
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        ));
        setEditingId(null);
        setFormData({ date: "", time: "", venue: "", city: "", address: "", ticket_url: "", price: "", is_free: false, support_acts: "" });
        setFlyerFile(null);
        setFlyerPreview(null);
        setError("");
      } else {
        setError("Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  const handleDelete = async (showId: number) => {
    if (!confirm("Diese Show wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/studio/shows/${showId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShows(shows.filter((s) => s.id !== showId));
      }
    } catch {
      // Fehler wird stillschweigend behandelt
    }
  };

  const startEdit = (show: Show) => {
    const date = new Date(show.starts_at);
    setEditingId(show.id);
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
    setIsCreating(false);
    setError("");
    setFlyerFile(null);
    setFlyerPreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ date: "", time: "", venue: "", city: "", address: "", ticket_url: "", price: "", is_free: false, support_acts: "" });
    setError("");
    setSupportActSuggestions([]);
    setShowSuggestions(false);
    setFlyerFile(null);
    setFlyerPreview(null);
  };

  const handleFlyerSelect = (file: File) => {
    setFlyerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFlyerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFlyerUpload = async (showId: number, file: File) => {
    setUploadingFlyer(showId);
    const formData = new FormData();
    formData.append("flyer", file);

    try {
      const res = await fetch(`/api/studio/shows/${showId}/upload-flyer`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setShows(shows.map((s) => 
          s.id === showId ? { ...s, flyer_path: json.data.flyer_path } : s
        ));
      }
    } catch {
      // Silent error handling
    } finally {
      setUploadingFlyer(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFlyerDelete = async (showId: number) => {
    try {
      const res = await fetch(`/api/studio/shows/${showId}/flyer`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShows(shows.map((s) => 
          s.id === showId ? { ...s, flyer_path: null } : s
        ));
      }
    } catch {
      // Silent error handling
    }
  };

  const searchArtists = async (query: string) => {
    if (query.length < 2) {
      setSupportActSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`/api/artist-pages/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        setSupportActSuggestions(json.data || []);
        setShowSuggestions(true);
      }
    } catch {
      setSupportActSuggestions([]);
    }
  };

  const handleSupportActsChange = (value: string) => {
    setFormData({ ...formData, support_acts: value });
    const lastComma = value.lastIndexOf(",");
    const currentInput = lastComma >= 0 ? value.slice(lastComma + 1).trim() : value.trim();
    searchArtists(currentInput);
  };

  const addSupportAct = (displayName: string) => {
    const current = formData.support_acts;
    const lastComma = current.lastIndexOf(",");
    const newValue = lastComma >= 0 
      ? current.slice(0, lastComma + 1) + " " + displayName + ", "
      : displayName + ", ";
    setFormData({ ...formData, support_acts: newValue });
    setSupportActSuggestions([]);
    setShowSuggestions(false);
  };

  const formatShowDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, d. MMM yyyy • HH:mm", { locale: de });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Shows</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine kommenden Konzerte und Auftritte.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Deine Shows</h2>
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              + Neue Show
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Datum auswählen"
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="Uhrzeit"
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <input
                type="text"
                placeholder="Venue / Location"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <input
                type="text"
                placeholder="Stadt"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <input
                type="text"
                placeholder="Vollständige Adresse (optional)"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <input
                type="url"
                placeholder="Ticket-Link (optional)"
                value={formData.ticket_url}
                onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? "" : formData.price })}
                    className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                  />
                  Freier Eintritt
                </label>
                {!formData.is_free && (
                  <input
                    type="number"
                    placeholder="Preis (€)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Support Acts (Name eintippen für Vorschläge, kommagetrennt)"
                  value={formData.support_acts}
                  onChange={(e) => handleSupportActsChange(e.target.value)}
                  onFocus={() => formData.support_acts && searchArtists(formData.support_acts.split(",").pop()?.trim() || "")}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
                {showSuggestions && supportActSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg max-h-48 overflow-y-auto">
                    {supportActSuggestions.map((artist) => (
                      <button
                        key={artist.id}
                        type="button"
                        onClick={() => addSupportAct(artist.display_name)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors"
                      >
                        {artist.avatar_url && (
                          <img src={artist.avatar_url} alt={artist.display_name} className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{artist.display_name}</p>
                          <p className="text-xs text-zinc-500 truncate">@{artist.handle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Flyer Upload */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Flyer (optional)</label>
                {flyerPreview ? (
                  <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-zinc-800">
                    <img src={flyerPreview} alt="Flyer preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setFlyerFile(null);
                        setFlyerPreview(null);
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
                        if (file) handleFlyerSelect(file);
                      }}
                      className="hidden"
                      id="flyer-create"
                    />
                    <label
                      htmlFor="flyer-create"
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
                    >
                      📎 Flyer hinzufügen
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

          {/* Shows List */}
          {shows.length === 0 && !isCreating ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="text-xs text-zinc-600 mb-2">Noch keine Shows hinzugefügt</p>
              <button
                onClick={() => setIsCreating(true)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Erste Show hinzufügen
              </button>
            </div>
          ) : (
            shows.map((show) => (
              <div key={show.id}>
                {editingId === show.id ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="Datum auswählen"
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="Uhrzeit"
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <input
                      type="text"
                      placeholder="Vollständige Adresse (optional)"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <input
                      type="url"
                      placeholder="Ticket-Link (optional)"
                      value={formData.ticket_url}
                      onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input
                          type="checkbox"
                          checked={formData.is_free}
                          onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? "" : formData.price })}
                          className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
                        />
                        Freier Eintritt
                      </label>
                      {!formData.is_free && (
                        <input
                          type="number"
                          placeholder="Preis (€)"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          step="0.01"
                          min="0"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        />
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Support Acts (Name eintippen für Vorschläge, kommagetrennt)"
                        value={formData.support_acts}
                        onChange={(e) => handleSupportActsChange(e.target.value)}
                        onFocus={() => formData.support_acts && searchArtists(formData.support_acts.split(",").pop()?.trim() || "")}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      {showSuggestions && supportActSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg max-h-48 overflow-y-auto">
                          {supportActSuggestions.map((artist) => (
                            <button
                              key={artist.id}
                              type="button"
                              onClick={() => addSupportAct(artist.display_name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors"
                            >
                              {artist.avatar_url && (
                                <img src={artist.avatar_url} alt={artist.display_name} className="w-6 h-6 rounded-full object-cover" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{artist.display_name}</p>
                                <p className="text-xs text-zinc-500 truncate">@{artist.handle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Flyer Upload in Edit */}
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Flyer (optional)</label>
                      {show.flyer_path && !flyerPreview ? (
                        <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-zinc-800">
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${show.flyer_path}`}
                            alt="Current flyer" 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            onClick={() => handleFlyerDelete(show.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ) : flyerPreview ? (
                        <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-zinc-800">
                          <img src={flyerPreview} alt="Flyer preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              setFlyerFile(null);
                              setFlyerPreview(null);
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
                              if (file) handleFlyerSelect(file);
                            }}
                            className="hidden"
                            id={`flyer-edit-${show.id}`}
                          />
                          <label
                            htmlFor={`flyer-edit-${show.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
                          >
                            📎 Flyer hinzufügen
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(show.id)}
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
                    {show.flyer_path && (
                      <div className="relative w-20 h-28 shrink-0 rounded overflow-hidden bg-zinc-950">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${show.flyer_path}`}
                          alt="Show flyer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleFlyerDelete(show.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center"
                          title="Flyer löschen"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-1">{formatShowDate(show.starts_at)}</p>
                      <p className="text-sm font-medium text-zinc-100">{show.venue}</p>
                      <p className="text-xs text-zinc-500">{show.city}</p>
                      {show.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-200 mt-1 inline-block"
                        >
                          📍 Route planen
                        </a>
                      )}
                      {show.price !== null || show.is_free ? (
                        <p className="text-xs text-zinc-500 mt-1">
                          {show.is_free ? "Freier Eintritt" : `${show.price} €`}
                        </p>
                      ) : null}
                      {show.support_acts && show.support_acts.length > 0 && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Support: {show.support_acts.join(", ")}
                        </p>
                      )}
                      {show.ticket_url && (
                        <a
                          href={show.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-200 underline mt-1 inline-block"
                        >
                          🎟️ Tickets
                        </a>
                      )}
                      {!show.flyer_path && (
                        <div className="mt-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFlyerUpload(show.id, file);
                            }}
                            className="hidden"
                            id={`flyer-upload-${show.id}`}
                          />
                          <label
                            htmlFor={`flyer-upload-${show.id}`}
                            className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer inline-block"
                          >
                            {uploadingFlyer === show.id ? "⏳ Hochladen..." : "📎 Flyer hinzufügen"}
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(show)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 p-1"
                        title="Bearbeiten"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(show.id)}
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
