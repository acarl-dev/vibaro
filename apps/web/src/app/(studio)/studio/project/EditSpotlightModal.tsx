"use client";

import { useState, FormEvent } from "react";
import {
  SpotlightData,
  SpotlightType,
  UpdateSpotlightRequest,
  updateSpotlight,
  fetchSpotlights,
} from "@/lib/api/spotlights";
import StudioButton from "../../components/StudioButton";
import { X } from "../../components/StudioIcons";
import { useToast } from "@/context/ToastContext";

type EditSpotlightModalProps = {
  spotlight: SpotlightData;
  onSuccess: (spotlight: SpotlightData) => void;
  onClose: () => void;
};

// ---------------------------------------------------------------------------
// Type → human label
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<string, string> = {
  single:     "Release · Single",
  album:      "Release · Album",
  video:      "Release · Video",
  event:      "Live · Konzert",
  tour:       "Live · Tour",
  merch:      "Merch",
  studio:     "Studio",
  focus:      "Fokus",
  livestream: "Livestream",
  collab:     "Kollaboration",
};

const ALL_TYPES: { value: SpotlightType; label: string }[] = [
  { value: "single",     label: "Release · Single" },
  { value: "album",      label: "Release · Album" },
  { value: "video",      label: "Release · Video" },
  { value: "event",      label: "Live · Konzert" },
  { value: "tour",       label: "Live · Tour" },
  { value: "merch",      label: "Merch" },
  { value: "studio",     label: "Studio" },
  { value: "focus",      label: "Fokus" },
  { value: "livestream", label: "Livestream" },
  { value: "collab",     label: "Kollaboration" },
];

// ---------------------------------------------------------------------------
// Guided question labels per type
// ---------------------------------------------------------------------------

function titleQuestion(type: SpotlightType): string {
  switch (type) {
    case "single": return "Wie heißt die Single?";
    case "album":  return "Wie heißt das Album?";
    case "video":  return "Wie heißt das Video?";
    case "event":  return "Wo spielst du?";
    case "tour":   return "Wie heißt die Tour?";
    case "merch":  return "Was ist der Name des Drops?";
    case "focus":  return "Was möchtest du hervorheben?";
    default:       return "Titel";
  }
}

function linkQuestion(type: SpotlightType): string {
  switch (type) {
    case "single":
    case "album":  return "Wo können Fans es hören?";
    case "video":  return "Wo können Fans es sehen?";
    case "event":
    case "tour":   return "Link zu Tickets oder Tour-Infos?";
    case "merch":  return "Shop-Link?";
    default:       return "Link?";
  }
}

function linkPlaceholder(type: SpotlightType): string {
  switch (type) {
    case "single":
    case "album":  return "https://… Spotify, Apple Music, Bandcamp …";
    case "video":  return "https://… YouTube, Vimeo o.ä.";
    case "event":
    case "tour":   return "https://… Ticketlink oder Tourseite";
    case "merch":  return "https://… Shop-URL";
    default:       return "https://…";
  }
}

// Types where a link field is shown
const LINK_TYPES: SpotlightType[] = ["single", "album", "video", "event", "tour", "merch", "collab", "focus", "livestream"];
// Types where description is a primary field
const DESCRIPTION_TYPES: SpotlightType[] = ["studio", "focus"];
// Types with an editable title (studio uses a fixed title)
const TITLE_TYPES: SpotlightType[] = ["single", "album", "video", "event", "tour", "merch", "collab", "focus", "livestream"];

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function Question({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--studio-text-primary)" }}>
      {children}
    </p>
  );
}

function OptionalHint() {
  return (
    <span className="text-xs font-normal ml-1.5" style={{ color: "var(--studio-text-secondary)" }}>
      (optional)
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EditSpotlightModal({
  spotlight,
  onSuccess,
  onClose,
}: EditSpotlightModalProps) {
  const [loading, setLoading] = useState(false);
  const [showTypeChange, setShowTypeChange] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<UpdateSpotlightRequest>({
    title:                spotlight.title,
    type:                 spotlight.type,
    primary_url:          spotlight.primary_url,
    artist_name:          spotlight.artist_name || "",
    description:          spotlight.description || "",
    subtitle:             spotlight.subtitle || "",
    cta_label:            spotlight.cta_label || "",
    secondary_cta_url:    spotlight.secondary_cta_url || "",
    secondary_cta_label:  spotlight.secondary_cta_label || "",
    background_image_url: spotlight.background_image_url || "",
    meta:                 spotlight.meta || {},
  });

  const currentType = (formData.type || spotlight.type) as SpotlightType;
  const showLink = LINK_TYPES.includes(currentType);
  const showDescription = DESCRIPTION_TYPES.includes(currentType);
  const showTitle = TITLE_TYPES.includes(currentType);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (showTitle && !formData.title?.trim()) {
      showToast("Bitte einen Titel eingeben", "error");
      return;
    }

    const normalizedPrimaryUrl = formData.primary_url?.trim()
      ? formData.primary_url.trim()
      : null;
    const payload: UpdateSpotlightRequest = {
      ...formData,
      primary_url: normalizedPrimaryUrl,
    };

    setLoading(true);
    const result = await updateSpotlight(spotlight.id, payload);

    if (result.success) {
      const spotlights = await fetchSpotlights();
      const updated = spotlights.find((s) => s.id === spotlight.id);
      if (updated) {
        onSuccess(updated);
      } else {
        showToast("Gespeichert", "success");
        onClose();
      }
    } else {
      showToast(result.error || "Fehler beim Speichern", "error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="studio-h2 text-base">Phase bearbeiten</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(var(--accent), 0.1)", color: "var(--studio-accent)", border: "1px solid rgba(var(--accent), 0.2)" }}
                >
                  {TYPE_LABELS[currentType] ?? currentType}
                </span>
                <button
                  type="button"
                  onClick={() => setShowTypeChange(!showTypeChange)}
                  className="text-xs transition-colors"
                  style={{ color: "var(--studio-text-secondary)" }}
                >
                  {showTypeChange ? "ausblenden" : "Typ ändern"}
                </button>
              </div>
              {showTypeChange && (
                <select
                  value={currentType}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as SpotlightType })}
                  className="studio-input mt-2 px-3 py-1.5 text-sm"
                >
                  {ALL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              )}
            </div>
            <StudioButton variant="secondary" size="icon" onClick={onClose} aria-label="Schließen" type="button">
              <X size={14} />
            </StudioButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            {showTitle && (
              <div>
                <Question>{titleQuestion(currentType)}</Question>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="studio-input w-full px-3 py-2.5 text-sm"
                  autoFocus
                />
              </div>
            )}

            {/* Description (primary for studio/focus) */}
            {showDescription && (
              <div>
                <Question>
                  {currentType === "studio" ? "Woran arbeitet ihr gerade?" : "Mehr Kontext?"}
                  {currentType === "focus" && <OptionalHint />}
                </Question>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    currentType === "studio"
                      ? "Ein Satz reicht – z.B. Wir schreiben gerade an neuen Songs."
                      : "Ein Satz reicht — was steckt dahinter?"
                  }
                  rows={3}
                  className="studio-input w-full px-3 py-2.5 text-sm resize-none"
                  autoFocus={currentType === "studio"}
                />
              </div>
            )}

            {/* Link */}
            {showLink && (
              <div>
                <Question>
                  {linkQuestion(currentType)}
                  <OptionalHint />
                </Question>
                <input
                  type="url"
                  value={formData.primary_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, primary_url: e.target.value === "" ? null : e.target.value })
                  }
                  placeholder={linkPlaceholder(currentType)}
                  className="studio-input w-full px-3 py-2.5 text-sm"
                />
              </div>
            )}

            {/* Limitiert toggle (Merch only) */}
            {currentType === "merch" && (
              <div>
                <Question>Limitierte Auflage?</Question>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, is_limited: !formData.meta?.is_limited },
                    })
                  }
                  className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm transition-colors"
                  style={{
                    border: `1px solid ${
                      formData.meta?.is_limited ? "var(--studio-accent)" : "var(--studio-border)"
                    }`,
                    background: formData.meta?.is_limited
                      ? "rgba(var(--accent), 0.08)"
                      : "transparent",
                    color: "var(--studio-text-primary)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: formData.meta?.is_limited ? "var(--studio-accent)" : "transparent",
                      border: `1.5px solid ${
                        formData.meta?.is_limited ? "var(--studio-accent)" : "var(--studio-border)"
                      }`,
                    }}
                  >
                    {Boolean(formData.meta?.is_limited) && (
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  Limitiert
                </button>
              </div>
            )}

            {/* Slug note */}
            <p className="text-xs rounded-lg px-3 py-2" style={{ background: "var(--studio-surface-elevated)", border: "1px solid var(--studio-border)", color: "var(--studio-text-secondary)" }}>
              Slug <code className="text-xs">{spotlight.slug}</code> bleibt unverändert — bestehende Tracking-Links bleiben gültig.
            </p>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="studio-btn studio-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Speichere…" : "Speichern"}
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
