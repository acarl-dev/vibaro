"use client";

import { useState, useEffect } from "react";
import {
  getActiveSpotlight,
  getAllSpotlights,
  createSpotlight,
  updateSpotlight,
  activateSpotlight,
  endSpotlight,
  type Spotlight,
} from "@/lib/api/stage";

export default function SpotlightClient() {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [activeSpotlight, setActiveSpotlight] = useState<Spotlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState<Spotlight | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "release" as "release" | "tour" | "announcement" | "other",
    primary_url: "",
    description: "",
    starts_at: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [active, all] = await Promise.all([
        getActiveSpotlight(),
        getAllSpotlights(),
      ]);
      setActiveSpotlight(active);
      setSpotlights(all);
    } catch (error) {
      console.error("Failed to load spotlights:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createSpotlight({
        title: formData.title,
        type: formData.type,
        primary_url: formData.primary_url,
        description: formData.description || undefined,
        starts_at: formData.starts_at || undefined,
      });

      // Reset form and reload
      setFormData({
        title: "",
        type: "release",
        primary_url: "",
        description: "",
        starts_at: "",
      });
      setShowCreateForm(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to create spotlight");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSpotlight) return;

    try {
      await updateSpotlight(editingSpotlight.id, {
        title: formData.title,
        type: formData.type,
        primary_url: formData.primary_url,
        description: formData.description || null,
        starts_at: formData.starts_at || null,
      });

      setEditingSpotlight(null);
      setFormData({
        title: "",
        type: "release",
        primary_url: "",
        description: "",
        starts_at: "",
      });
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to update spotlight");
    }
  }

  async function handleActivate(id: number) {
    try {
      await activateSpotlight(id);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to activate spotlight");
    }
  }

  async function handleEnd(id: number) {
    try {
      await endSpotlight(id);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to end spotlight");
    }
  }

  function startEdit(spotlight: Spotlight) {
    setEditingSpotlight(spotlight);
    setFormData({
      title: spotlight.title,
      type: spotlight.type,
      primary_url: spotlight.primary_url,
      description: spotlight.description || "",
      starts_at: spotlight.starts_at?.split("T")[0] || "",
    });
    setShowCreateForm(false);
  }

  function cancelEdit() {
    setEditingSpotlight(null);
    setFormData({
      title: "",
      type: "release",
      primary_url: "",
      description: "",
      starts_at: "",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Was steht gerade im Rampenlicht?</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Lege fest, worauf sich deine Fans jetzt konzentrieren sollen.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <p className="text-sm text-zinc-500">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Was steht gerade im Rampenlicht?</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Lege fest, worauf sich deine Fans jetzt konzentrieren sollen.
        </p>
      </div>

      {/* Kontext-Hinweise */}
      <div className="mb-6 rounded-lg border border-blue-900/30 bg-blue-900/10 p-4">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">So funktioniert's:</h3>
        <ol className="space-y-1 text-sm text-blue-200/80">
          <li>1. Erstelle ein Spotlight (z.B. neue Single, Tour)</li>
          <li>2. Erzeuge unter „Teilbare Links" einen trackbaren Link</li>
          <li>3. Teile ihn auf Instagram, TikTok oder per WhatsApp</li>
          <li>4. Beobachte unter „Ergebnisse", wie oft er geklickt wird</li>
        </ol>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        {/* Active Spotlight */}
        {activeSpotlight && (
          <div className="mb-6 rounded-lg border-2 border-blue-500 bg-blue-900/20 p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-sm font-semibold text-blue-300">
                  Aktives Spotlight
                </span>
              </div>
              <button
                onClick={() => handleEnd(activeSpotlight.id)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Beenden
              </button>
            </div>
            <h2 className="text-xl font-bold text-blue-100">
              {activeSpotlight.title}
            </h2>
            <p className="mt-1 text-sm text-blue-300">
            {activeSpotlight.type === "release" && "🎵 Release"}
            {activeSpotlight.type === "tour" && "🎤 Tour"}
            {activeSpotlight.type === "announcement" && "📢 Ankündigung"}
            {activeSpotlight.type === "other" && "✨ Sonstiges"}
          </p>
          {activeSpotlight.description && (
              <p className="mt-2 text-sm text-blue-200">
                {activeSpotlight.description}
              </p>
            )}
            <a
              href={activeSpotlight.primary_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-blue-400 underline hover:text-blue-300"
            >
              {activeSpotlight.primary_url}
            </a>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => startEdit(activeSpotlight)}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                Bearbeiten
              </button>
            </div>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && !editingSpotlight && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="mb-6 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            + Neues Spotlight
          </button>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingSpotlight) && (
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            {editingSpotlight ? "Spotlight bearbeiten" : "Neues Spotlight"}
          </h2>
          <form onSubmit={editingSpotlight ? handleUpdate : handleCreate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Titel
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Typ
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as any,
                    })
                  }
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                >
                  <option value="release">Release</option>
                  <option value="tour">Tour</option>
                  <option value="announcement">Ankündigung</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Wohin soll es gehen?
                </label>
                <input
                  type="url"
                  value={formData.primary_url}
                  onChange={(e) =>
                    setFormData({ ...formData, primary_url: e.target.value })
                  }
                  required
                  placeholder="z.B. Spotify-Album, YouTube-Video, Ticket-Link..."
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Das Ziel, auf das deine Fans klicken sollen (z.B. Spotify, Instagram, Ticketshop)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Beschreibung (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  maxLength={1000}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Start-Datum (optional)
                </label>
                <input
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) =>
                    setFormData({ ...formData, starts_at: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="rounded bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
              >
                {editingSpotlight ? "Speichern" : "Erstellen"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  cancelEdit();
                }}
                className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* All Spotlights */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">Alle Spotlights</h2>
          {spotlights.length === 0 ? (
            <p className="text-sm text-zinc-500">Noch keine Spotlights vorhanden.</p>
          ) : (
            <div className="space-y-3">
              {spotlights.map((spotlight) => (
              <div
                key={spotlight.id}
                className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-100">{spotlight.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {spotlight.type} • {spotlight.status}
                    </p>
                    {spotlight.description && (
                      <p className="mt-2 text-sm text-zinc-300">
                        {spotlight.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {spotlight.status !== "active" && (
                      <button
                        onClick={() => handleActivate(spotlight.id)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Aktivieren
                      </button>
                    )}
                    {spotlight.status === "active" ? (
                      <button
                        onClick={() => handleEnd(spotlight.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Beenden
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(spotlight)}
                        className="text-sm text-zinc-400 hover:text-zinc-100"
                      >
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
