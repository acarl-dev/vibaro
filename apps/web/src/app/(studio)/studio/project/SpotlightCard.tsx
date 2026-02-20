"use client";

import { useState } from "react";
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
        ? "Dieses Projekt wieder aktivieren? Ein eventuell aktives Projekt wird dabei beendet."
        : "Dieses Projekt aktivieren? Ein eventuell aktives Projekt wird dabei beendet."
    );
    if (!confirmed) return;

    setLoading(true);
    const result = await activateSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Projekt aktiviert", "success");
      onActivate(spotlight.id);
    } else {
      showToast(result.error || "Fehler beim Aktivieren", "error");
    }
  };

  const handleEnd = async () => {
    if (!confirm("Möchtest du dieses Projekt wirklich beenden?")) return;

    setLoading(true);
    const result = await endSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Projekt beendet", "success");
      onUpdate({ ...spotlight, status: "ended", show_on_page: false });
    } else {
      showToast(result.error || "Fehler beim Beenden", "error");
    }
  };

  const handleArchive = async () => {
    if (!confirm("Möchtest du dieses Projekt wirklich archivieren?")) return;

    setLoading(true);
    const result = await archiveSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Projekt archiviert", "success");
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
    showToast("Projekt aktualisiert", "success");
  };

  return (
    <>
      <div className="studio-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="studio-h2 text-base">{spotlight.title}</h3>
              <span className={statusInfo.color}>
                {statusInfo.label}
              </span>
              <span className="studio-badge-ended">
                {TYPE_LABELS[spotlight.type] || spotlight.type}
              </span>
            </div>
            {spotlight.description && (
              <p className="studio-subtitle text-sm mb-2">
                {spotlight.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
              <span>Slug: {spotlight.slug}</span>
              <a
                href={spotlight.primary_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors"
                style={{ color: "var(--studio-accent)" }}
              >
                Link →
              </a>
              {spotlight.show_on_page && (
                <span style={{ color: "var(--studio-success)" }}>
                  ✓ Hero-Banner aktiv
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-3" style={{ borderTop: "1px solid var(--studio-border)" }}>
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
