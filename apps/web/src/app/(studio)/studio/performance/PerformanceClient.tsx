"use client";

import { useState, useEffect } from "react";
import { 
  getAnalytics, 
  getAllSpotlights, 
  getAllCampaigns,
  type AnalyticsData, 
  type Spotlight,
  type Campaign,
} from "@/lib/api/stage";

export default function PerformanceClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [selectedSpotlightId, setSelectedSpotlightId] = useState<number | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [range, selectedSpotlightId, selectedCampaignId]);

  async function loadData() {
    try {
      setLoading(true);
      const [analyticsData, spotlightsData, campaignsData] = await Promise.all([
        getAnalytics(range, selectedSpotlightId || undefined, selectedCampaignId || undefined),
        getAllSpotlights(),
        getAllCampaigns(),
      ]);
      setAnalytics(analyticsData);
      setSpotlights(spotlightsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Failed to load performance data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="mt-4 text-zinc-500">Laden...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="mt-4 text-zinc-500">Keine Performance-Daten verfügbar.</p>
      </div>
    );
  }

  const activeSpotlight = spotlights.find((s) => s.status === "active");

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Deine Tracking-Daten – gefiltert und messbar.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        {/* Range Filter */}
        <div>
          <label className="mr-2 text-sm font-medium text-zinc-700">Zeitraum:</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "7d" | "30d")}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
          >
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
          </select>
        </div>

        {/* Spotlight Filter */}
        {spotlights.length > 0 && (
          <div>
            <label className="mr-2 text-sm font-medium text-zinc-700">Spotlight:</label>
            <select
              value={selectedSpotlightId || ""}
              onChange={(e) =>
                setSelectedSpotlightId(e.target.value ? parseInt(e.target.value) : null)
              }
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
            >
              <option value="">Alle</option>
              {activeSpotlight && (
                <option value={activeSpotlight.id}>
                  🔵 {activeSpotlight.title} (aktiv)
                </option>
              )}
              {spotlights
                .filter((s) => s.id !== activeSpotlight?.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.status})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Campaign Filter */}
        {campaigns.length > 0 && (
          <div>
            <label className="mr-2 text-sm font-medium text-zinc-700">Kampagne:</label>
            <select
              value={selectedCampaignId || ""}
              onChange={(e) =>
                setSelectedCampaignId(e.target.value ? parseInt(e.target.value) : null)
              }
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
            >
              <option value="">Alle</option>
              {campaigns
                .filter((c) => !selectedSpotlightId || c.spotlight_id === selectedSpotlightId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.platform && `(${c.platform})`}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Total Clicks */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
        <div className="text-sm font-medium text-zinc-500">Gesamt-Klicks</div>
        <div className="mt-2 text-4xl font-bold">{analytics.total_clicks}</div>
        {(selectedSpotlightId || selectedCampaignId) && (
          <p className="mt-2 text-xs text-zinc-500">
            {selectedSpotlightId && "Gefiltert nach Spotlight"}
            {selectedSpotlightId && selectedCampaignId && " + "}
            {selectedCampaignId && "Gefiltert nach Kampagne"}
          </p>
        )}
      </div>

      {/* By Module */}
      {analytics.by_module.length > 0 && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Klicks nach Modul</h2>
          <div className="space-y-3">
            {analytics.by_module.map((item) => (
              <div key={item.module} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{item.module}</span>
                <span className="text-sm text-zinc-500">{item.clicks} Klicks</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Referrer */}
      {analytics.by_referrer.length > 0 && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Referrer</h2>
          <div className="space-y-3">
            {analytics.by_referrer.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.referrer}</span>
                <span className="text-sm text-zinc-500">{item.clicks} Klicks</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend */}
      {analytics.trend.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Trend (letzte {range === "7d" ? "7" : "30"} Tage)
          </h2>
          <div className="space-y-2">
            {analytics.trend.map((item) => (
              <div key={item.date} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">
                  {new Date(item.date).toLocaleDateString("de-DE")}
                </span>
                <span className="font-medium">{item.clicks} Klicks</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analytics.total_clicks === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-zinc-600">
            Noch keine Tracking-Daten vorhanden. Erstelle Tracking-Links, um Performance zu messen.
          </p>
        </div>
      )}
    </div>
  );
}
