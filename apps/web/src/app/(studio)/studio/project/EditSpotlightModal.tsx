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
  { value: "single",     label: "Single" },
  { value: "album",      label: "Album" },
  { value: "video",      label: "Video" },
  { value: "tour",       label: "Tour" },
  { value: "event",      label: "Event" },
  { value: "merch",      label: "Merch" },
  { value: "livestream", label: "Livestream" },
  { value: "collab",     label: "Kollaboration" },
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
    artist_name: spotlight.artist_name || "",
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="studio-h2 text-base">Projekt bearbeiten</h2>
            <button
              onClick={onClose}
              className="studio-subtitle hover:text-[var(--studio-text-primary)] transition-colors text-lg"
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
                value={formData.type || spotlight.type}
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
                value={formData.primary_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, primary_url: e.target.value })
                }
                className="studio-input w-full px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Interpret</label>
              <input
                type="text"
                value={formData.artist_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, artist_name: e.target.value || null })
                }
                placeholder="z.B. Max Mustermann"
                className="studio-input w-full px-3 py-2 text-sm"
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
                className="studio-input w-full px-3 py-2 text-sm"
              />
            </div>

            {/* Note about slug */}
            <div className="rounded-lg p-3 text-sm" style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-accent-muted)", color: "var(--studio-text-secondary)" }}>
              <strong style={{ color: "var(--studio-text-primary)" }}>Hinweis:</strong> Der Slug ({spotlight.slug}) bleibt unverändert, damit
              bestehende Tracking-Links funktionieren.
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="studio-btn studio-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Speichere..." : "Speichern"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="studio-btn studio-btn-secondary disabled:opacity-50"
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
