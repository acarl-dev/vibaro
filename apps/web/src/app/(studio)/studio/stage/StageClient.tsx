"use client";

import { useState, useEffect } from "react";
import {
  getActiveSpotlight,
  getAllSpotlights,
  createSpotlight,
  activateSpotlight,
  endSpotlight,
  getAllTrackingLinks,
  createCampaign,
  createTrackingLink,
  deleteTrackingLink,
  type Spotlight,
  type TrackingLink,
} from "@/lib/api/stage";

// Platform configuration
const PLATFORMS = [
  { id: "instagram-story", name: "Instagram Story", icon: "📱", utmSource: "instagram", utmMedium: "story" },
  { id: "instagram-bio", name: "Instagram Bio", icon: "🔗", utmSource: "instagram", utmMedium: "bio" },
  { id: "tiktok", name: "TikTok", icon: "🎵", utmSource: "tiktok", utmMedium: "bio" },
  { id: "youtube", name: "YouTube", icon: "▶️", utmSource: "youtube", utmMedium: "description" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", utmSource: "whatsapp", utmMedium: "message" },
  { id: "custom", name: "Eigener Link", icon: "🌐", utmSource: "custom", utmMedium: "link" },
];

export default function StageClient() {
  const [activeSpotlight, setActiveSpotlight] = useState<Spotlight | null>(null);
  const [allSpotlights, setAllSpotlights] = useState<Spotlight[]>([]);
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFocusForm, setShowFocusForm] = useState(false);
  const [showFocusSelector, setShowFocusSelector] = useState(false);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [deletingLink, setDeletingLink] = useState<number | null>(null);

  // Focus form state
  const [focusForm, setFocusForm] = useState({
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
      const [active, all, links] = await Promise.all([
        getActiveSpotlight(),
        getAllSpotlights(),
        getAllTrackingLinks(),
      ]);
      setActiveSpotlight(active);
      setAllSpotlights(all);
      setTrackingLinks(links);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFocus(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await createSpotlight({
        title: focusForm.title,
        type: focusForm.type,
        primary_url: focusForm.primary_url,
        description: focusForm.description || undefined,
        starts_at: focusForm.starts_at || undefined,
      });

      // Activate immediately if status is scheduled
      if (result.status === "scheduled") {
        await activateSpotlight(result.id);
      }

      // Reset and reload
      setFocusForm({
        title: "",
        type: "release",
        primary_url: "",
        description: "",
        starts_at: "",
      });
      setShowFocusForm(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Konnte nicht erstellt werden");
    }
  }

  async function generatePlatformLink(platformId: string) {
    if (!activeSpotlight) {
      alert("Bitte setze zuerst einen Fokus.");
      return;
    }

    const platform = PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return;

    let linkLabel = platform.name;
    if (platform.id === "custom") {
      const customName = window.prompt("Wie soll dein Link heißen?", "Eigener Link");
      if (customName === null) {
        return;
      }

      const trimmedName = customName.trim();
      if (!trimmedName) {
        alert("Bitte gib einen Namen ein.");
        return;
      }

      linkLabel = trimmedName;
    }

    try {
      setGeneratingLink(platformId);

      // 1. Create campaign
      const campaign = await createCampaign({
        name: `${linkLabel} — ${activeSpotlight.title}`,
        platform: platform.utmSource,
        spotlight_id: activeSpotlight.id,
      });

      // 2. Create tracking link
      const link = await createTrackingLink({
        module: "share",
        label: linkLabel,
        target_url: activeSpotlight.primary_url,
        spotlight_id: activeSpotlight.id,
        campaign_id: campaign.id,
        utm_source: platform.utmSource,
        utm_medium: platform.utmMedium,
        utm_campaign: activeSpotlight.title.toLowerCase().replace(/\s+/g, "-"),
      });

      // Reload to show new link
      await loadData();

      // Copy to clipboard
      await navigator.clipboard.writeText(link.tracking_url);
      // Silent success - link appears in list
    } catch (error: any) {
      alert(error.message || "Konnte nicht erstellt werden");
    } finally {
      setGeneratingLink(null);
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      // Silent success
    } catch (error) {
      alert("Kopieren fehlgeschlagen");
    }
  }

  async function handleEndFocus() {
    if (!activeSpotlight) return;
    
    if (!confirm("Fokus beenden? Dies kann nicht rückgängig gemacht werden.")) {
      return;
    }

    try {
      await endSpotlight(activeSpotlight.id);
      await loadData();
      setShowFocusSelector(false);
    } catch (error: any) {
      alert(error.message || "Konnte nicht beendet werden");
    }
  }

  async function handleActivateFocus(id: number) {
    try {
      await activateSpotlight(id);
      await loadData();
      setShowFocusSelector(false);
    } catch (error: any) {
      alert(error.message || "Konnte nicht aktiviert werden");
    }
  }

  async function handleDeleteLink(id: number) {
    if (!confirm("Link wirklich löschen?")) {
      return;
    }

    try {
      setDeletingLink(id);
      await deleteTrackingLink(id);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Konnte nicht gelöscht werden");
    } finally {
      setDeletingLink(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Was steht gerade im Rampenlicht?</h1>
        <p className="mt-2 text-sm text-zinc-400">Deine aktuelle Waffe.</p>
      </div>

      {/* Section 1: Aktueller Fokus */}
      <section>
        
        {activeSpotlight ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium mb-3">
                  {activeSpotlight.type === "release" ? "Album" :
                   activeSpotlight.type === "tour" ? "Tour" :
                   activeSpotlight.type === "announcement" ? "News" : "Sonstiges"}
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">{activeSpotlight.title}</h3>
                {activeSpotlight.description && (
                  <p className="text-sm text-zinc-400 mb-3">{activeSpotlight.description}</p>
                )}
                <a
                  href={activeSpotlight.primary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-400 underline"
                >
                  {activeSpotlight.primary_url}
                </a>
              </div>
              <button
                onClick={() => setShowFocusSelector(true)}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
              >
                Ändern
              </button>
            </div>
          </div>
        ) : null}

        {/* Focus Selector Modal */}
        {showFocusSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFocusSelector(false)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-100">Fokus ändern</h3>
                <button onClick={() => setShowFocusSelector(false)} className="text-zinc-500 hover:text-zinc-300">
                  ✕
                </button>
              </div>
              
              {activeSpotlight && (
                <div className="mb-4 pb-4 border-b border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-2">Aktueller Fokus:</p>
                  <p className="text-sm font-medium text-zinc-100">{activeSpotlight.title}</p>
                  <button
                    onClick={handleEndFocus}
                    className="mt-3 w-full px-4 py-2 rounded-full bg-red-900/20 hover:bg-red-900/30 text-red-400 text-sm font-medium transition-colors"
                  >
                    Fokus beenden
                  </button>
                </div>
              )}

              <div>
                <p className="text-sm text-zinc-400 mb-3">Oder wähle einen anderen:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allSpotlights
                    .filter((s) => s.id !== activeSpotlight?.id && s.status !== "ended")
                    .map((spotlight) => (
                      <button
                        key={spotlight.id}
                        onClick={() => handleActivateFocus(spotlight.id)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        <p className="text-sm font-medium text-zinc-100">{spotlight.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {spotlight.type === "release" ? "Album" :
                           spotlight.type === "tour" ? "Tour" :
                           spotlight.type === "announcement" ? "News" : "Sonstiges"} · {spotlight.status}
                        </p>
                      </button>
                    ))}
                  {allSpotlights.filter((s) => s.id !== activeSpotlight?.id && s.status !== "ended").length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-4">Keine weiteren Fokus-Optionen</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!activeSpotlight && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-zinc-300 mb-3">Noch nichts im Rampenlicht.</h3>
            <p className="text-zinc-400 mb-6">
              Lege fest, was deine Fans jetzt hören, sehen oder kaufen sollen.
            </p>
            {showFocusForm ? (
              <form onSubmit={handleCreateFocus} className="max-w-md mx-auto space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Titel (z.B. Neue Single)"
                    value={focusForm.title}
                    onChange={(e) => setFocusForm({ ...focusForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <select
                    value={focusForm.type}
                    onChange={(e) => setFocusForm({ ...focusForm, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100"
                  >
                    <option value="release">Release</option>
                    <option value="tour">Tour</option>
                    <option value="announcement">Ankündigung</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Wohin soll es gehen? (Spotify, YouTube, Ticket-Link...)"
                    value={focusForm.primary_url}
                    onChange={(e) => setFocusForm({ ...focusForm, primary_url: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Beschreibung (optional)"
                    value={focusForm.description}
                    onChange={(e) => setFocusForm({ ...focusForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium transition-colors"
                  >
                    Fokus festlegen
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFocusForm(false)}
                    className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowFocusForm(true)}
                className="px-6 py-3 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold transition-colors"
              >
                + Fokus festlegen
              </button>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Teile deinen Fokus */}
      {activeSpotlight && (
        <section>
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Verbreiten</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => generatePlatformLink(platform.id)}
                disabled={generatingLink === platform.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-700 transition-colors disabled:opacity-50"
              >
                <span className="text-4xl mb-3 block">{platform.icon}</span>
                <span className="text-sm font-medium text-zinc-100">{platform.name}</span>
                {generatingLink === platform.id && (
                  <span className="block text-xs text-zinc-500 mt-2">Erstellt...</span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Aktive Verbreitung */}
      {trackingLinks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Aktive Verbreitung.</h2>
          
          <div className="space-y-3">
            {trackingLinks.map((link) => (
              <div
                key={link.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">{link.label}</p>
                  <p className="text-xs text-zinc-500 mt-1">{link.tracking_url}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-100">0</p>
                    <p className="text-xs text-zinc-500">Klicks</p>
                  </div>
                  <button
                    onClick={() => copyLink(link.tracking_url)}
                    className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors"
                  >
                    Kopieren
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={deletingLink === link.id}
                    className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                    title="Link löschen"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
