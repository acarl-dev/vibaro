"use client";

import { useState } from "react";
import { SpotlightData, fetchArchivedSpotlights, restoreSpotlight, deleteSpotlight } from "@/lib/api/spotlights";
import CreateSpotlightForm from "./CreateSpotlightForm";
import SpotlightList from "./SpotlightList";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import { Zap } from "../../components/StudioIcons";

type ProjectClientProps = {
  spotlights: SpotlightData[];
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

export default function ProjectClient({ spotlights: initialSpotlights }: ProjectClientProps) {
  const [spotlights, setSpotlights] = useState<SpotlightData[]>(initialSpotlights);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archivedSpotlights, setArchivedSpotlights] = useState<SpotlightData[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const activeSpotlight = spotlights.find(
    (s) => s.status === "active"
  );
  const scheduledSpotlights = spotlights.filter(
    (s) => s.status === "scheduled"
  );
  const endedSpotlights = spotlights.filter((s) => s.status === "ended");

  const handleSpotlightCreated = (newSpotlight: SpotlightData) => {
    setSpotlights([newSpotlight, ...spotlights]);
    setShowCreateForm(false);
  };

  const handleSpotlightUpdated = (updatedSpotlight: SpotlightData) => {
    setSpotlights(
      spotlights.map((s) => (s.id === updatedSpotlight.id ? updatedSpotlight : s))
    );
  };

  const handleSpotlightActivated = (id: number) => {
    setSpotlights((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "active" as const }
          : s.status === "active"
          ? { ...s, status: "ended" as const }
          : s
      )
    );
  };

  const handleSpotlightRemoved = (id: number) => {
    setSpotlights(spotlights.filter((s) => s.id !== id));
  };

  const handleToggleArchive = async () => {
    if (!showArchive && archivedSpotlights.length === 0) {
      setArchiveLoading(true);
      const data = await fetchArchivedSpotlights();
      setArchivedSpotlights(data);
      setArchiveLoading(false);
    }
    setShowArchive((prev) => !prev);
  };

  const handleRestore = async (id: number) => {
    setRestoringId(id);
    const result = await restoreSpotlight(id);
    setRestoringId(null);
    if (result.success) {
      setArchivedSpotlights((prev) => prev.filter((s) => s.id !== id));
      if (result.data) {
        setSpotlights((prev) => [result.data!, ...prev]);
      }
      showToast("Phase wiederhergestellt", "success");
    } else {
      showToast(result.error || "Fehler beim Wiederherstellen", "error");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" endgültig löschen? Dies kann nicht rückgängig gemacht werden.`)) return;
    setDeletingId(id);
    const result = await deleteSpotlight(id);
    setDeletingId(null);
    if (result.success) {
      setArchivedSpotlights((prev) => prev.filter((s) => s.id !== id));
      showToast("Phase gelöscht", "success");
    } else {
      showToast(result.error || "Fehler beim Löschen", "error");
    }
  };

  return (
    <div className="max-w-4xl">
      <StudioPageHeader
        title="PHASEN"
        subtitle="Alle Phasen überblicken und neue erstellen"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleArchive}
              className="studio-btn studio-btn-secondary text-xs"
            >
              {showArchive ? "Archiv ausblenden" : "Archiv"}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="studio-btn studio-btn-primary text-xs"
            >
              {showCreateForm ? "Abbrechen" : "+ Neue Phase"}
            </button>
          </div>
        }
      />

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateSpotlightForm
            onSuccess={handleSpotlightCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Empty State */}
      {spotlights.length === 0 && (
        <StudioEmptyState
          icon={Zap}
          title="Noch keine Phasen"
          description="Erstelle deine erste Phase – Release, Live, Merch oder Drop."
          action={
            <button
              onClick={() => setShowCreateForm(true)}
              className="studio-btn studio-btn-primary"
            >
              Erste Phase erstellen
            </button>
          }
        />
      )}

      {/* Active Spotlight */}
      {activeSpotlight && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--studio-text-secondary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--studio-success)" }}></span>
            Aktive Phase
          </h2>
          <SpotlightList
            spotlights={[activeSpotlight]}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
            onActivate={handleSpotlightActivated}
          />
        </div>
      )}

      {/* Scheduled Spotlights */}
      {scheduledSpotlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--studio-text-secondary)" }}>Geplant</h2>
          <SpotlightList
            spotlights={scheduledSpotlights}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
            onActivate={handleSpotlightActivated}
          />
        </div>
      )}

      {/* Ended Spotlights */}
      {endedSpotlights.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--studio-text-secondary)" }}>
            Beendet
          </h2>
          <SpotlightList
            spotlights={endedSpotlights}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
            onActivate={handleSpotlightActivated}
          />
        </div>
      )}

      {/* Archived Spotlights */}
      {showArchive && (
        <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--studio-text-secondary)" }}>
            Archiv
          </h2>
          {archiveLoading && (
            <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>Lade Archiv…</p>
          )}
          {!archiveLoading && archivedSpotlights.length === 0 && (
            <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>Keine archivierten Phasen.</p>
          )}
          {!archiveLoading && archivedSpotlights.length > 0 && (
            <div className="flex flex-col gap-2">
              {archivedSpotlights.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
                >
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--studio-text-primary)" }}>{s.title}</span>
                    <span className="ml-2 text-xs" style={{ color: "var(--studio-text-secondary)" }}>{TYPE_LABELS[s.type] ?? s.type}</span>
                    {s.archived_at && (
                      <span className="ml-2 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                        archiviert {new Date(s.archived_at).toLocaleDateString("de-DE")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore(s.id)}
                      disabled={restoringId === s.id || deletingId === s.id}
                      className="studio-btn studio-btn-secondary text-xs disabled:opacity-50"
                    >
                      {restoringId === s.id ? "…" : "Wiederherstellen"}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.title)}
                      disabled={deletingId === s.id || restoringId === s.id}
                      className="studio-btn studio-btn-danger text-xs disabled:opacity-50"
                    >
                      {deletingId === s.id ? "…" : "Löschen"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
