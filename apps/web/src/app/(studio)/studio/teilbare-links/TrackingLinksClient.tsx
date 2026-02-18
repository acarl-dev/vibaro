"use client";

import { useState, useEffect } from "react";
import {
  getAllTrackingLinks,
  createTrackingLink,
  deleteTrackingLink,
  getAllSpotlights,
  getAllCampaigns,
  type TrackingLink,
  type Spotlight,
  type Campaign,
} from "@/lib/api/stage";

export default function TrackingLinksClient() {
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    module: "spotlight",
    label: "",
    target_url: "",
    spotlight_id: "",
    campaign_id: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [links, spots, camps] = await Promise.all([
        getAllTrackingLinks(),
        getAllSpotlights(),
        getAllCampaigns(),
      ]);
      setTrackingLinks(links);
      setSpotlights(spots);
      setCampaigns(camps);
    } catch (error) {
      console.error("Failed to load tracking links:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data: any = {
        module: formData.module,
        label: formData.label,
        target_url: formData.target_url,
      };

      if (formData.spotlight_id) {
        data.spotlight_id = parseInt(formData.spotlight_id);
      }

      if (formData.campaign_id) {
        data.campaign_id = parseInt(formData.campaign_id);
      }

      if (formData.utm_source) data.utm_source = formData.utm_source;
      if (formData.utm_medium) data.utm_medium = formData.utm_medium;
      if (formData.utm_campaign) data.utm_campaign = formData.utm_campaign;

      await createTrackingLink(data);

      // Reset form
      setFormData({
        module: "spotlight",
        label: "",
        target_url: "",
        spotlight_id: "",
        campaign_id: "",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
      });
      setShowCreateForm(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to create tracking link");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Link löschen?")) return;

    try {
      await deleteTrackingLink(id);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to delete tracking link");
    }
  }

  function copyToClipboard(url: string, id: number) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Teilbare Links</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Erstelle einen Link, den du posten kannst. Vibaro misst automatisch, wie oft er geklickt wird.
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
        <h1 className="text-2xl font-semibold tracking-tight">Teilbare Links</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Erstelle einen Link, den du posten kannst. Vibaro misst automatisch, wie oft er geklickt wird.
        </p>
      </div>

      {/* Kontext-Hinweise */}
      <div className="mb-6 rounded-lg border border-blue-900/30 bg-blue-900/10 p-4">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">So erstellst du einen teilbaren Link:</h3>
        <ol className="space-y-1 text-sm text-blue-200/80">
          <li>1. Klicke auf „+ Neuer Link" und gib dein Ziel an (z.B. Spotify, YouTube, Instagram)</li>
          <li>2. Optional: Verknüpfe den Link mit einem Spotlight oder Push</li>
          <li>3. Kopiere deinen Vibaro-Link und teile ihn überall (Story, Bio, WhatsApp)</li>
          <li>4. Jeder Klick wird automatisch gemessen und erscheint unter „Ergebnisse"</li>
        </ol>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        {/* Create Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="mb-6 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            + Neuer Link
          </button>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">Neuer teilbarer Link</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300">
                    Modul
                  </label>
                  <select
                    value={formData.module}
                    onChange={(e) =>
                      setFormData({ ...formData, module: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                  >
                    <option value="spotlight">Spotlight</option>
                    <option value="link">Link</option>
                    <option value="show">Show</option>
                    <option value="release">Release</option>
                    <option value="campaign">Campaign</option>
                  </select>
                </div>

                {formData.module === "spotlight" && spotlights.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Spotlight (optional)
                    </label>
                    <select
                      value={formData.spotlight_id}
                      onChange={(e) =>
                        setFormData({ ...formData, spotlight_id: e.target.value })
                      }
                      className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                    >
                      <option value="">-- Kein Spotlight --</option>
                      {spotlights.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {campaigns.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Kampagne (optional)
                    </label>
                    <select
                      value={formData.campaign_id}
                      onChange={(e) =>
                        setFormData({ ...formData, campaign_id: e.target.value })
                      }
                      className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                    >
                      <option value="">-- Keine Kampagne --</option>
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.platform && `(${c.platform})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-300">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    required
                    placeholder="z.B. Instagram Story, Spotify Link"
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300">
                    Ziel-URL
                  </label>
                  <input
                    type="url"
                    value={formData.target_url}
                    onChange={(e) =>
                      setFormData({ ...formData, target_url: e.target.value })
                    }
                    required
                    placeholder="https://..."
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                  />
                </div>

                {/* UTM Parameters */}
                <div className="rounded border border-zinc-700 bg-zinc-800/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                    UTM Parameter (optional)
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.utm_source}
                      onChange={(e) =>
                        setFormData({ ...formData, utm_source: e.target.value })
                      }
                      placeholder="utm_source (z.B. instagram)"
                      className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.utm_medium}
                      onChange={(e) =>
                        setFormData({ ...formData, utm_medium: e.target.value })
                      }
                      placeholder="utm_medium (z.B. story)"
                      className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.utm_campaign}
                      onChange={(e) =>
                        setFormData({ ...formData, utm_campaign: e.target.value })
                      }
                      placeholder="utm_campaign (z.B. album_launch)"
                      className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
                >
                  Erstellen
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

        {/* Tracking Links List */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">Deine teilbaren Links</h2>
          {trackingLinks.length === 0 ? (
            <p className="text-sm text-zinc-500">Noch keine Links erstellt.</p>
          ) : (
            <div className="space-y-3">
              {trackingLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-100">{link.label}</h3>
                        <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                          {link.module}
                        </span>
                        {link.spotlight_title && (
                          <span className="rounded bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300">
                            {link.spotlight_title}
                          </span>
                        )}
                        {link.campaign_name && (
                          <span className="rounded bg-purple-900/50 px-2 py-0.5 text-xs text-purple-300">
                            {link.campaign_name}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs text-zinc-500">Tracking URL:</p>
                          <div className="mt-1 flex items-center gap-2">
                            <code className="flex-1 rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-300">
                              {link.tracking_url}
                            </code>
                            <button
                              onClick={() => copyToClipboard(link.tracking_url, link.id)}
                              className="rounded bg-zinc-100 px-3 py-1 text-xs text-zinc-900 hover:bg-white transition-colors"
                            >
                              {copiedId === link.id ? "✓ Kopiert" : "Kopieren"}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500">Ziel:</p>
                          <a
                            href={link.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block truncate text-xs text-blue-400 hover:underline"
                          >
                            {link.target_url}
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(link.id)}
                      className="ml-4 text-sm text-red-400 hover:text-red-300"
                    >
                      Löschen
                    </button>
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
