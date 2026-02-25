"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import {
  SpotlightData,
  SpotlightType,
  SpotlightMetadata,
  CreateSpotlightRequest,
  createSpotlight,
  fetchSpotlightMetadata,
} from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";

type CreateSpotlightFormProps = {
  onSuccess: (spotlight: SpotlightData) => void;
  onCancel: () => void;
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

function PlatformBadge({ platform }: { platform: string }) {
  const colorMap: Record<string, { bg: string; color: string }> = {
    Spotify:       { bg: "rgba(30,215,96,0.12)",  color: "#1ED760" },
    YouTube:       { bg: "rgba(255,0,0,0.10)",     color: "#FF0000" },
    SoundCloud:    { bg: "rgba(255,85,0,0.12)",    color: "#FF5500" },
    "Apple Music": { bg: "rgba(252,61,57,0.12)",   color: "#FC3D39" },
    TikTok:        { bg: "rgba(105,201,208,0.12)", color: "#69C9D0" },
    Instagram:     { bg: "rgba(225,48,108,0.12)",  color: "#E1306C" },
  };
  const style = colorMap[platform] ?? { bg: "rgba(128,128,128,0.12)", color: "var(--studio-text-secondary)" };
  return (
    <span
      className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {platform}
    </span>
  );
}

export default function CreateSpotlightForm({
  onSuccess,
  onCancel,
}: CreateSpotlightFormProps) {
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metadata, setMetadata] = useState<SpotlightMetadata | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CreateSpotlightRequest>({
    title: "",
    type: "single",
    primary_url: "",
    cover_image_url: null,
    artist_name: null,
    platform_name: null,
    description: "",
    show_on_page: true,
    activate: false,
  });

  // Auto-fetch metadata when URL changes (debounced 800ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const url = formData.primary_url.trim();
    if (!url || !url.startsWith("http")) {
      setMetadata(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setMetaLoading(true);
      try {
        const meta = await fetchSpotlightMetadata(url);
        if (meta) {
          setMetadata(meta);
          setFormData((prev) => ({
            ...prev,
            title:           prev.title || meta.title || "",
            type:            (meta.suggested_type as SpotlightType) ?? prev.type,
            cover_image_url: meta.cover_image_url ?? prev.cover_image_url,
            artist_name:     meta.artist_name ?? prev.artist_name,
            platform_name:   meta.platform_name ?? prev.platform_name,
          }));
        } else {
          setMetadata(null);
        }
      } finally {
        setMetaLoading(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.primary_url]);

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
      showToast("Phase erstellt", "success");
      onSuccess(result.data);
    } else {
      showToast(result.error || "Fehler beim Erstellen", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="studio-card">
      <h2 className="studio-h2 text-base mb-4">Neue Phase erstellen</h2>

      <div className="space-y-4">

        {/* Primary URL — first so metadata loads before user fills title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Link <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={formData.primary_url}
              onChange={(e) =>
                setFormData({ ...formData, primary_url: e.target.value })
              }
              placeholder="https://open.spotify.com/track/... oder YouTube-Link"
              className="studio-input w-full px-3 py-2 text-sm pr-9"
              required
            />
            {metaLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin w-4 h-4" style={{ color: "var(--studio-accent)" }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            )}
          </div>
          <p className="studio-subtitle text-xs mt-1">
            Spotify, YouTube, SoundCloud, Apple Music — Metadaten werden automatisch geladen
          </p>
        </div>

        {/* Metadata Preview */}
        {metadata && (
          <div
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--studio-border)" }}
          >
            {metadata.cover_image_url ? (
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={metadata.cover_image_url}
                  alt="Cover"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center text-xl"
                style={{ background: "var(--studio-border)" }}
              >
                🎵
              </div>
            )}
            <div className="flex-1 min-w-0">
              {metadata.title && (
                <p className="text-sm font-semibold truncate" style={{ color: "var(--studio-text-primary)" }}>
                  {metadata.title}
                </p>
              )}
              {metadata.artist_name && (
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--studio-text-secondary)" }}>
                  {metadata.artist_name}
                </p>
              )}
              {metadata.platform_name && (
                <div className="mt-1.5">
                  <PlatformBadge platform={metadata.platform_name} />
                </div>
              )}
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: "var(--studio-success)" }}>
              ✓ Geladen
            </span>
          </div>
        )}

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

        {/* Show on Page */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show_on_page"
            checked={formData.show_on_page}
            onChange={(e) =>
              setFormData({ ...formData, show_on_page: e.target.checked })
            }
            className="w-4 h-4 rounded"
          />
          <label htmlFor="show_on_page" className="text-sm">
            Als Hero-Banner auf öffentlicher Seite anzeigen
          </label>
        </div>

        {/* Activate immediately */}
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2"
          style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <input
            type="checkbox"
            id="activate"
            checked={formData.activate}
            onChange={(e) =>
              setFormData({ ...formData, activate: e.target.checked })
            }
            className="w-4 h-4 mt-0.5 rounded"
          />
          <label htmlFor="activate" className="text-sm">
            <span className="font-medium" style={{ color: "var(--studio-success)" }}>Sofort aktivieren</span>
            <span className="block text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)" }}>
              Diese Phase wird direkt aktiv. Eine bestehende aktive Phase wird dabei beendet.
            </span>
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
