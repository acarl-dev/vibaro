"use client";

import { useState, FormEvent } from "react";
import {
  SpotlightData,
  SpotlightType,
  CreateSpotlightRequest,
  createSpotlight,
} from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";

type CreateSpotlightFormProps = {
  onSuccess: (spotlight: SpotlightData) => void;
  onCancel: () => void;
};

const SPOTLIGHT_TYPES: { value: SpotlightType; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "album", label: "Album" },
  { value: "tour", label: "Tour" },
  { value: "event", label: "Event" },
];

export default function CreateSpotlightForm({
  onSuccess,
  onCancel,
}: CreateSpotlightFormProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CreateSpotlightRequest>({
    title: "",
    type: "single",
    primary_url: "",
    description: "",
    show_on_page: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.primary_url.trim()) {
      showToast("Bitte Titel und Link ausfüllen", "error");
      return;
    }

    setLoading(true);
    const result = await createSpotlight(formData);
    setLoading(false);

    if (result.success && result.data) {
      showToast("Projekt erstellt", "success");
      onSuccess(result.data);
    } else {
      showToast(result.error || "Fehler beim Erstellen", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="studio-card"
    >
      <h2 className="studio-h2 text-base mb-4">Neues Projekt erstellen</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="z.B. Neue Single 'Summer Vibes'"
            className="studio-input w-full px-3 py-2 text-sm"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Typ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as SpotlightType })
            }
            className="studio-input w-full px-3 py-2 text-sm"
            required
          >
            {SPOTLIGHT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Primary URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.primary_url}
            onChange={(e) =>
              setFormData({ ...formData, primary_url: e.target.value })
            }
            placeholder="https://spotify.com/..."
            className="studio-input w-full px-3 py-2 text-sm"
            required
          />
          <p className="studio-subtitle text-xs mt-1">
            Haupt-Link für dieses Projekt (Spotify, YouTube, etc.)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Beschreibung</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Kurze Beschreibung (optional)"
            rows={3}
            className="studio-input w-full px-3 py-2 text-sm"
          />
        </div>

        {/* Show on Page */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show_on_page"
            checked={formData.show_on_page}
            onChange={(e) =>
              setFormData({ ...formData, show_on_page: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="show_on_page" className="text-sm">
            Als Hero-Banner auf öffentlicher Seite anzeigen
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="studio-btn studio-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Erstelle..." : "Erstellen"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="studio-btn studio-btn-secondary disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>

    </form>
  );
}
