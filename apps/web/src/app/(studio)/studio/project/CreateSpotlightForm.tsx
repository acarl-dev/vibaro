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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Neues Projekt erstellen</h2>

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Erstelle..." : "Erstellen"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>

    </form>
  );
}
