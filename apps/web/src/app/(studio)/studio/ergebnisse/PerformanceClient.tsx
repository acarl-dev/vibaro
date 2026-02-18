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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Wie läuft's?</h1>
          <p className="mt-2 text-sm text-zinc-400">
            So reagieren deine Fans.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <p className="text-sm text-zinc-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Wie läuft's?</h1>
          <p className="mt-2 text-sm text-zinc-400">
            So reagieren deine Fans.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <p className="text-sm text-zinc-500">Noch keine Reaktionen.</p>
        </div>
      </div>
    );
  }

  const activeSpotlight = spotlights.find((s) => s.status === "active");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Wie läuft's?</h1>
        <p className="mt-2 text-sm text-zinc-400">
          So reagieren deine Fans.
        </p>
      </div>



      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
        {/* Range Filter */}
        <div>
            <label className="mr-2 text-sm font-medium text-zinc-300">Zeitraum:</label>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as "7d" | "30d")}
              className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
            >
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
            </select>
          </div>

          {/* Spotlight Filter */}
          {spotlights.length > 0 && (
            <div>
              <label className="mr-2 text-sm font-medium text-zinc-300">Fokus:</label>
              <select
                value={selectedSpotlightId || ""}
                onChange={(e) =>
                  setSelectedSpotlightId(e.target.value ? parseInt(e.target.value) : null)
                }
                className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
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
      </div>

        {/* Total Clicks */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
          <div className="text-sm font-medium text-zinc-400">Gesamt-Klicks</div>
          <div className="mt-2 text-4xl font-bold text-zinc-100">{analytics.total_clicks}</div>
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
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">Klicks nach Modul</h2>
            <div className="space-y-3">
              {analytics.by_module.map((item) => (
                <div key={item.module} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-zinc-300">{item.module}</span>
                  <span className="text-sm text-zinc-400">{item.clicks} Klicks</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Referrer */}
        {analytics.by_referrer.length > 0 && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">Top Referrer</h2>
            <div className="space-y-3">
              {analytics.by_referrer.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-300">{item.referrer}</span>
                  <span className="text-sm text-zinc-400">{item.clicks} Klicks</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend */}
        {analytics.trend.length > 0 && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">
              Trend (letzte {range === "7d" ? "7" : "30"} Tage)
            </h2>
            <div className="space-y-2">
              {analytics.trend.map((item) => (
                <div key={item.date} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">
                    {new Date(item.date).toLocaleDateString("de-DE")}
                  </span>
                  <span className="font-medium text-zinc-100">{item.clicks} Klicks</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.total_clicks === 0 && (
          <div className="mt-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-8 text-center">
            <p className="text-sm text-zinc-400">
              Noch keine Tracking-Daten vorhanden. Erstelle Tracking-Links, um Performance zu messen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
