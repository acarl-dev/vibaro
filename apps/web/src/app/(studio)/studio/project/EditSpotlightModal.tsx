"use client";

import { useState, FormEvent } from "react";
import {
  SpotlightData,
  SpotlightType,
  UpdateSpotlightRequest,
  updateSpotlight,
  fetchSpotlights,
} from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";

type EditSpotlightModalProps = {
  spotlight: SpotlightData;
  onSuccess: (spotlight: SpotlightData) => void;
  onClose: () => void;
};

const SPOTLIGHT_TYPES: { value: SpotlightType; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "album", label: "Album" },
  { value: "tour", label: "Tour" },
  { value: "event", label: "Event" },
];

export default function EditSpotlightModal({
  spotlight,
  onSuccess,
  onClose,
}: EditSpotlightModalProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState<UpdateSpotlightRequest>({
    title: spotlight.title,
    type: spotlight.type,
    primary_url: spotlight.primary_url,
    description: spotlight.description || "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.primary_url?.trim()) {
      showToast("Bitte Titel und Link ausfüllen", "error");
      return;
    }

    setLoading(true);
    const result = await updateSpotlight(spotlight.id, formData);

    if (result.success) {
      // Fetch updated spotlight data
      const spotlights = await fetchSpotlights();
      const updated = spotlights.find((s) => s.id === spotlight.id);

      if (updated) {
        onSuccess(updated);
      } else {
        showToast("Aktualisiert", "success");
        onClose();
      }
    } else {
      showToast(result.error || "Fehler beim Aktualisieren", "error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Projekt bearbeiten</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                value={formData.type || spotlight.type}
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
                value={formData.primary_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, primary_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Beschreibung</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Note about slug */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
              <strong>Hinweis:</strong> Der Slug ({spotlight.slug}) bleibt unverändert, damit
              bestehende Tracking-Links funktionieren.
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Speichere..." : "Speichern"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
