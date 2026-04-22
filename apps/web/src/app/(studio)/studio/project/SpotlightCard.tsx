"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SpotlightData,
  activateSpotlight,
  endSpotlight,
  archiveSpotlight,
  toggleSpotlightVisibility,
} from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";
import EditSpotlightModal from "./EditSpotlightModal";

type SpotlightCardProps = {
  spotlight: SpotlightData;
  onUpdate: (spotlight: SpotlightData) => void;
  onRemove: (id: number) => void;
  onActivate: (id: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  single: "Single",
  album: "Album",
  tour: "Tour",
  event: "Event",
  video: "Video",
  merch: "Merch",
  livestream: "Livestream",
  collab: "Kollaboration",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:    { label: "Aktiv",    color: "studio-badge-live" },
  scheduled: { label: "Geplant",  color: "studio-badge-draft" },
  ended:     { label: "Beendet",  color: "studio-badge-ended" },
};

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

export default function SpotlightCard({
  spotlight,
  onUpdate,
  onRemove,
  onActivate,
}: SpotlightCardProps) {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { showToast } = useToast();

  const statusInfo = STATUS_LABELS[spotlight.status] || STATUS_LABELS.scheduled;

  const handleActivate = async () => {
    const confirmed = confirm(
      spotlight.status === "ended"
        ? "Diese Phase wieder aktivieren? Eine eventuell aktive Phase wird dabei beendet."
        : "Diese Phase aktivieren? Eine eventuell aktive Phase wird dabei beendet."
    );
    if (!confirmed) return;

    setLoading(true);
    const result = await activateSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Phase aktiviert", "success");
      onActivate(spotlight.id);
    } else {
      showToast(result.error || "Fehler beim Aktivieren", "error");
    }
  };

  const handleEnd = async () => {
    if (!confirm("Möchtest du diese Phase wirklich beenden?")) return;

    setLoading(true);
    const result = await endSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Phase beendet", "success");
      onUpdate({ ...spotlight, status: "ended", show_on_page: false });
    } else {
      showToast(result.error || "Fehler beim Beenden", "error");
    }
  };

  const handleArchive = async () => {
    if (!confirm("Möchtest du diese Phase wirklich archivieren?")) return;

    setLoading(true);
    const result = await archiveSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Phase archiviert", "success");
      onRemove(spotlight.id);
    } else {
      showToast(result.error || "Fehler beim Archivieren", "error");
    }
  };

  const handleToggleVisibility = async () => {
    setLoading(true);
    const result = await toggleSpotlightVisibility(spotlight.id, !spotlight.show_on_page);
    setLoading(false);

    if (result.success) {
      showToast(
        spotlight.show_on_page
          ? "Hero-Banner ausgeblendet"
          : "Hero-Banner eingeblendet",
        "success"
      );
      onUpdate({ ...spotlight, show_on_page: !spotlight.show_on_page });
    } else {
      showToast(result.error || "Fehler beim Ändern der Sichtbarkeit", "error");
    }
  };

  const handleEditSuccess = (updatedSpotlight: SpotlightData) => {
    onUpdate(updatedSpotlight);
    setShowEditModal(false);
    showToast("Phase aktualisiert", "success");
  };

  return (
    <>
      <div className="studio-card">
        {/* Top: cover + info */}
        <div className="flex gap-4 mb-4">
          {/* Cover Art */}
          <div className="flex-shrink-0">
            {spotlight.cover_image_url ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={spotlight.cover_image_url}
                  alt={spotlight.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "var(--studio-border)" }}
              >
                {spotlight.type === "video" ? "▶" : "🎵"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className={statusInfo.color}>{statusInfo.label}</span>
              <span className="studio-badge-ended">
                {TYPE_LABELS[spotlight.type] || spotlight.type}
              </span>
              {spotlight.platform_name && (
                <PlatformBadge platform={spotlight.platform_name} />
              )}
            </div>

            {/* Title */}
            <h3
              className="font-semibold text-base leading-tight truncate"
              style={{ color: "var(--studio-text-primary)" }}
            >
              {spotlight.title}
            </h3>

            {/* Artist */}
            {spotlight.artist_name && (
              <p
                className="text-sm mt-0.5 truncate"
                style={{ color: "var(--studio-text-secondary)" }}
              >
                {spotlight.artist_name}
              </p>
            )}

            {/* Description */}
            {spotlight.description && !spotlight.artist_name && (
              <p className="studio-subtitle text-sm mt-0.5 line-clamp-2">
                {spotlight.description}
              </p>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div
          className="flex items-center gap-4 text-xs pb-3 mb-3"
          style={{ color: "var(--studio-text-secondary)", borderBottom: "1px solid var(--studio-border)" }}
        >
          <span>Slug: {spotlight.slug}</span>
          <a
            href={spotlight.primary_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: "var(--studio-accent)" }}
          >
            Link öffnen →
          </a>
          {spotlight.show_on_page && (
            <span style={{ color: "var(--studio-success)" }}>✓ Hero-Banner aktiv</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowEditModal(true)}
            disabled={loading}
            className="studio-btn studio-btn-secondary disabled:opacity-50"
          >
            Bearbeiten
          </button>

          {(spotlight.status === "scheduled" || spotlight.status === "ended") && (
            <button
              onClick={handleActivate}
              disabled={loading}
              className="studio-btn disabled:opacity-50"
              style={{ background: "rgba(34,197,94,0.12)", color: "var(--studio-success)", border: "1px solid rgba(34,197,94,0.25)" }}
            >
              Aktivieren
            </button>
          )}

          {spotlight.status === "active" && (
            <button
              onClick={handleEnd}
              disabled={loading}
              className="studio-btn disabled:opacity-50"
              style={{ background: "rgba(245,158,11,0.12)", color: "var(--studio-warning)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              Beenden
            </button>
          )}

          <button
            onClick={handleToggleVisibility}
            disabled={loading}
            className="studio-btn studio-btn-secondary disabled:opacity-50"
          >
            {spotlight.show_on_page ? "Banner ausblenden" : "Banner einblenden"}
          </button>

          <button
            onClick={handleArchive}
            disabled={loading}
            className="studio-btn studio-btn-danger disabled:opacity-50"
          >
            Archivieren
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditSpotlightModal
          spotlight={spotlight}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
