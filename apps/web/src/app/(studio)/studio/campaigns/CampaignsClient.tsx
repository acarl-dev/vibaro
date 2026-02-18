"use client";

import { useState, useEffect } from "react";
import {
  getAllCampaigns,
  getAllSpotlights,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type Campaign,
  type Spotlight,
} from "@/lib/api/stage";

export default function CampaignsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    notes: "",
    spotlight_id: "",
    starts_at: "",
    ends_at: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [camps, spots] = await Promise.all([
        getAllCampaigns(),
        getAllSpotlights(),
      ]);
      setCampaigns(camps);
      setSpotlights(spots);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data: any = {
        name: formData.name,
      };

      if (formData.platform) data.platform = formData.platform;
      if (formData.notes) data.notes = formData.notes;
      if (formData.spotlight_id) data.spotlight_id = parseInt(formData.spotlight_id);
      if (formData.starts_at) data.starts_at = new Date(formData.starts_at).toISOString();
      if (formData.ends_at) data.ends_at = new Date(formData.ends_at).toISOString();

      await createCampaign(data);

      // Reset form and reload
      setFormData({
        name: "",
        platform: "",
        notes: "",
        spotlight_id: "",
        starts_at: "",
        ends_at: "",
      });
      setShowCreateForm(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to create campaign");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCampaign) return;

    try {
      const data: any = {
        name: formData.name,
      };

      if (formData.platform) data.platform = formData.platform;
      else data.platform = null;

      if (formData.notes) data.notes = formData.notes;
      else data.notes = null;

      if (formData.spotlight_id) data.spotlight_id = parseInt(formData.spotlight_id);
      else data.spotlight_id = null;

      if (formData.starts_at) data.starts_at = new Date(formData.starts_at).toISOString();
      else data.starts_at = null;

      if (formData.ends_at) data.ends_at = new Date(formData.ends_at).toISOString();
      else data.ends_at = null;

      await updateCampaign(editingCampaign.id, data);

      setEditingCampaign(null);
      setFormData({
        name: "",
        platform: "",
        notes: "",
        spotlight_id: "",
        starts_at: "",
        ends_at: "",
      });
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to update campaign");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Kampagne löschen? Dies entfernt auch alle zugehörigen Tracking-Links.")) return;

    try {
      await deleteCampaign(id);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to delete campaign");
    }
  }

  function startEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      platform: campaign.platform || "",
      notes: campaign.notes || "",
      spotlight_id: campaign.spotlight_id?.toString() || "",
      starts_at: campaign.starts_at?.split("T")[0] || "",
      ends_at: campaign.ends_at?.split("T")[0] || "",
    });
    setShowCreateForm(false);
  }

  function cancelEdit() {
    setEditingCampaign(null);
    setFormData({
      name: "",
      platform: "",
      notes: "",
      spotlight_id: "",
      starts_at: "",
      ends_at: "",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-zinc-500">Laden...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Kampagnen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Organisiere deine Marketing-Kampagnen und verfolge ihre Performance.
        </p>
      </div>

      {/* Create Button */}
      {!showCreateForm && !editingCampaign && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-6 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Neue Kampagne
        </button>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Neue Kampagne</h2>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="z.B. Instagram Story – Feb 2026"
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Plattform (optional)
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="z.B. instagram, facebook, meta_ads"
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Spotlight (optional)
                </label>
                <select
                  value={formData.spotlight_id}
                  onChange={(e) => setFormData({ ...formData, spotlight_id: e.target.value })}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                >
                  <option value="">-- Kein Spotlight --</option>
                  {spotlights.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Notizen (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="z.B. A/B Test - verschiedene Creatives"
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Startdatum (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Enddatum (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Erstellen
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingCampaign && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Kampagne bearbeiten</h2>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Plattform (optional)
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Spotlight (optional)
                </label>
                <select
                  value={formData.spotlight_id}
                  onChange={(e) => setFormData({ ...formData, spotlight_id: e.target.value })}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                >
                  <option value="">-- Kein Spotlight --</option>
                  {spotlights.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Notizen (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Startdatum (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Enddatum (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Speichern
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
            <p className="text-sm text-zinc-500">
              Noch keine Kampagnen. Erstelle eine, um deine Marketing-Performance zu tracken.
            </p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-lg border border-zinc-200 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold">{campaign.name}</h3>
                  
                  {campaign.platform && (
                    <p className="mt-1 text-sm text-zinc-500">
                      Plattform: <span className="font-medium">{campaign.platform}</span>
                    </p>
                  )}

                  {campaign.spotlight_title && (
                    <p className="mt-1 text-sm text-zinc-500">
                      Spotlight: <span className="font-medium">{campaign.spotlight_title}</span>
                    </p>
                  )}

                  {campaign.notes && (
                    <p className="mt-2 text-sm text-zinc-600">{campaign.notes}</p>
                  )}

                  <div className="mt-3 flex gap-4 text-xs text-zinc-400">
                    {campaign.starts_at && (
                      <span>Start: {new Date(campaign.starts_at).toLocaleDateString("de-DE")}</span>
                    )}
                    {campaign.ends_at && (
                      <span>Ende: {new Date(campaign.ends_at).toLocaleDateString("de-DE")}</span>
                    )}
                    <span>Erstellt: {new Date(campaign.created_at).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>

                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => startEdit(campaign)}
                    className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
