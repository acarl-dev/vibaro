"use client";

import { useState } from "react";
import { SpotlightData, fetchArchivedSpotlights, restoreSpotlight } from "@/lib/api/spotlights";
import CreateSpotlightForm from "./CreateSpotlightForm";
import SpotlightList from "./SpotlightList";
import { useToast } from "@/context/ToastContext";

type ProjectClientProps = {
  spotlights: SpotlightData[];
};

const TYPE_LABELS: Record<string, string> = {
  single: "Single",
  album: "Album",
  tour: "Tour",
  event: "Event",
};

export default function ProjectClient({ spotlights: initialSpotlights }: ProjectClientProps) {
  const [spotlights, setSpotlights] = useState<SpotlightData[]>(initialSpotlights);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archivedSpotlights, setArchivedSpotlights] = useState<SpotlightData[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
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
      showToast("Projekt wiederhergestellt", "success");
    } else {
      showToast(result.error || "Fehler beim Wiederherstellen", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projekt</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Verwalte deine Spotlights (Singles, Alben, Touren, Events)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleArchive}
            className="px-3 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {showArchive ? "Archiv ausblenden" : "Archiv"}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? "Abbrechen" : "+ Neues Projekt"}
          </button>
        </div>
      </div>

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
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Noch keine Projekte erstellt
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Erstes Projekt erstellen
          </button>
        </div>
      )}

      {/* Active Spotlight */}
      {activeSpotlight && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Aktives Projekt
          </h2>
          <SpotlightList
            spotlights={[activeSpotlight]}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
          />
        </div>
      )}

      {/* Scheduled Spotlights */}
      {scheduledSpotlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Geplant</h2>
          <SpotlightList
            spotlights={scheduledSpotlights}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
          />
        </div>
      )}

      {/* Ended Spotlights */}
      {endedSpotlights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-600 dark:text-gray-400">
            Beendet
          </h2>
          <SpotlightList
            spotlights={endedSpotlights}
            onUpdate={handleSpotlightUpdated}
            onRemove={handleSpotlightRemoved}
          />
        </div>
      )}

      {/* Archived Spotlights */}
      {showArchive && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h2 className="text-lg font-semibold mb-3 text-zinc-500 flex items-center gap-2">
            Archiv
          </h2>
          {archiveLoading && (
            <p className="text-sm text-zinc-500">Lade Archiv…</p>
          )}
          {!archiveLoading && archivedSpotlights.length === 0 && (
            <p className="text-sm text-zinc-500">Keine archivierten Projekte.</p>
          )}
          {!archiveLoading && archivedSpotlights.length > 0 && (
            <div className="flex flex-col gap-2">
              {archivedSpotlights.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800"
                >
                  <div>
                    <span className="text-sm font-medium text-zinc-300">{s.title}</span>
                    <span className="ml-2 text-xs text-zinc-500">{TYPE_LABELS[s.type] ?? s.type}</span>
                    {s.archived_at && (
                      <span className="ml-2 text-xs text-zinc-600">
                        archiviert {new Date(s.archived_at).toLocaleDateString("de-DE")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRestore(s.id)}
                    disabled={restoringId === s.id}
                    className="px-3 py-1 text-xs text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    {restoringId === s.id ? "…" : "Wiederherstellen"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
