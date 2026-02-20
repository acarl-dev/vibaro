"use client";

import { useState } from "react";
import {
  SpotlightData,
  activateSpotlight,
  endSpotlight,
  archiveSpotlight,
  toggleSpotlightVisibility,
} from "@/lib/api/spotlights";
import { useRouter } from "next/navigation";
import Toast, { useToast } from "@/components/Toast";
import EditSpotlightModal from "./EditSpotlightModal";

type SpotlightCardProps = {
  spotlight: SpotlightData;
  onUpdate: (spotlight: SpotlightData) => void;
  onRemove: (id: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  single: "Single",
  album: "Album",
  tour: "Tour",
  event: "Event",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Aktiv", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  scheduled: { label: "Geplant", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  ended: { label: "Beendet", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
};

export default function SpotlightCard({
  spotlight,
  onUpdate,
  onRemove,
}: SpotlightCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toastState, showToast, hideToast } = useToast();

  const statusInfo = STATUS_LABELS[spotlight.status] || STATUS_LABELS.scheduled;

  const handleActivate = async () => {
    setLoading(true);
    const result = await activateSpotlight(spotlight.id);
    setLoading(false);

    if (result.success) {
      showToast("Projekt aktiviert", "success");
      router.refresh();
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
      router.refresh();
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
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{spotlight.title}</h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {TYPE_LABELS[spotlight.type] || spotlight.type}
              </span>
            </div>
            {spotlight.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {spotlight.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>Slug: {spotlight.slug}</span>
              <a
                href={spotlight.primary_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Link →
              </a>
              {spotlight.show_on_page && (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Hero-Banner aktiv
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowEditModal(true)}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Bearbeiten
          </button>

          {spotlight.status === "scheduled" && (
            <button
              onClick={handleActivate}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              Aktivieren
            </button>
          )}

          {spotlight.status === "active" && (
            <button
              onClick={handleEnd}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors disabled:opacity-50"
            >
              Beenden
            </button>
          )}

          <button
            onClick={handleToggleVisibility}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {spotlight.show_on_page ? "Banner ausblenden" : "Banner einblenden"}
          </button>

          <button
            onClick={handleArchive}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
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

      {toastState.show && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}
