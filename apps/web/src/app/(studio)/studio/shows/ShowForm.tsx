"use client";

import { useState } from "react";
import StudioButton from "../../components/StudioButton";

export type ShowFormData = {
  date: string;
  time: string;
  venue: string;
  city: string;
  address: string;
  ticket_url: string;
  price: string;
  is_free: boolean;
  support_acts: string;
};

type ArtistSuggestion = {
  id: number;
  handle: string;
  display_name: string;
  avatar_url: string | null;
};

type ShowFormProps = {
  formData: ShowFormData;
  onChange: (data: ShowFormData) => void;
  flyerPreview: string | null;
  onFlyerSelect: (file: File) => void;
  onFlyerClear: () => void;
  /** Existing stored flyer (edit mode only) */
  existingFlyerSrc?: string | null;
  onExistingFlyerDelete?: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
};

export default function ShowForm({
  formData,
  onChange,
  flyerPreview,
  onFlyerSelect,
  onFlyerClear,
  existingFlyerSrc,
  onExistingFlyerDelete,
  onSubmit,
  onCancel,
  submitLabel = "Erstellen",
}: ShowFormProps) {
  const [suggestions, setSuggestions] = useState<ArtistSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = (patch: Partial<ShowFormData>) => onChange({ ...formData, ...patch });

  const searchArtists = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(`/api/artist-pages/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        setSuggestions(json.data || []);
        setShowSuggestions(true);
      }
    } catch {
      setSuggestions([]);
    }
  };

  const handleSupportActsChange = (value: string) => {
    set({ support_acts: value });
    const lastComma = value.lastIndexOf(",");
    const current = lastComma >= 0 ? value.slice(lastComma + 1).trim() : value.trim();
    void searchArtists(current);
  };

  const addSupportAct = (displayName: string) => {
    const current = formData.support_acts;
    const lastComma = current.lastIndexOf(",");
    const newValue =
      lastComma >= 0
        ? current.slice(0, lastComma + 1) + " " + displayName + ", "
        : displayName + ", ";
    set({ support_acts: newValue });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => set({ date: e.target.value })}
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
          style={{ colorScheme: "dark" }}
        />
        <input
          type="time"
          value={formData.time}
          onChange={(e) => set({ time: e.target.value })}
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
          style={{ colorScheme: "dark" }}
        />
      </div>

      <input
        type="text"
        placeholder="Venue / Location"
        value={formData.venue}
        onChange={(e) => set({ venue: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <input
        type="text"
        placeholder="Stadt"
        value={formData.city}
        onChange={(e) => set({ city: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <input
        type="text"
        placeholder="Vollständige Adresse (optional)"
        value={formData.address}
        onChange={(e) => set({ address: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <input
        type="url"
        placeholder="Ticket-Link (optional)"
        value={formData.ticket_url}
        onChange={(e) => set({ ticket_url: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />

      {/* Price */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={formData.is_free}
            onChange={(e) =>
              set({ is_free: e.target.checked, price: e.target.checked ? "" : formData.price })
            }
            className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
          />
          Freier Eintritt
        </label>
        {!formData.is_free && (
          <div className="space-y-1">
            <input
              type="number"
              placeholder="Preis (€)"
              value={formData.price}
              onChange={(e) => set({ price: e.target.value })}
              step="0.01"
              min="0"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
            <p className="text-[11px] text-zinc-600">
              Wird als „Abendkasse" angezeigt, wenn kein Ticket-Link angegeben ist
            </p>
          </div>
        )}
      </div>

      {/* Support Acts */}
      <div className="relative">
        <input
          type="text"
          placeholder="Support Acts (Name eintippen für Vorschläge, kommagetrennt)"
          value={formData.support_acts}
          onChange={(e) => handleSupportActsChange(e.target.value)}
          onFocus={() => {
            const last = formData.support_acts.split(",").pop()?.trim() ?? "";
            if (last) void searchArtists(last);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => addSupportAct(artist.display_name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                {artist.avatar_url && (
                  <img
                    src={artist.avatar_url}
                    alt={artist.display_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
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

      {/* Flyer */}
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Flyer (optional)</label>

        {/* New flyer preview (staged, not yet uploaded) */}
        {flyerPreview ? (
          <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-zinc-800">
            <img src={flyerPreview} alt="Flyer preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onFlyerClear}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : existingFlyerSrc ? (
          /* Existing uploaded flyer (edit mode) */
          <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-zinc-800">
            <img src={existingFlyerSrc} alt="Current flyer" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onExistingFlyerDelete}
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
                if (file) onFlyerSelect(file);
                e.target.value = "";
              }}
              className="hidden"
              id="show-flyer-input"
            />
            <label
              htmlFor="show-flyer-input"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
            >
              📎 Flyer hinzufügen
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <StudioButton variant="primary" size="sm" onClick={onSubmit}>
          {submitLabel}
        </StudioButton>
        <StudioButton variant="secondary" size="sm" onClick={onCancel}>
          Abbrechen
        </StudioButton>
      </div>
    </div>
  );
}
