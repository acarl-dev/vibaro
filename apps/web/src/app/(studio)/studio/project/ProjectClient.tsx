"use client";

import { useState } from "react";
import { SpotlightData } from "@/lib/api/spotlights";
import CreateSpotlightForm from "./CreateSpotlightForm";
import SpotlightList from "./SpotlightList";

type ProjectClientProps = {
  spotlights: SpotlightData[];
};

export default function ProjectClient({ spotlights: initialSpotlights }: ProjectClientProps) {
  const [spotlights, setSpotlights] = useState<SpotlightData[]>(initialSpotlights);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? "Abbrechen" : "+ Neues Projekt"}
        </button>
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
    </div>
  );
}
