"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalyticsData } from "@/lib/api/analytics";
import { SpotlightData } from "@/lib/api/spotlights";
import { PLATFORMS } from "@/lib/platforms";
import { getAnalyticsBreakdown, AnalyticsBreakdown } from "@/lib/api/stage";
import PlatformBreakdown from "@/components/studio/results/PlatformBreakdown";

type ResultsClientProps = {
  analytics: AnalyticsData | null;
  spotlights: SpotlightData[];
  initialRange: "7d" | "30d" | "90d";
  initialSpotlightId?: number;
};

export default function ResultsClient({
  analytics,
  spotlights,
  initialRange,
  initialSpotlightId,
}: ResultsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [range, setRange] = useState<"7d" | "30d" | "90d">(initialRange);
  const [spotlightFilter, setSpotlightFilter] = useState<number | undefined>(
    initialSpotlightId
  );
  const [breakdownData, setBreakdownData] = useState<AnalyticsBreakdown | null>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);

  // Load breakdown data when spotlight is selected
  useEffect(() => {
    if (spotlightFilter) {
      setLoadingBreakdown(true);
      getAnalyticsBreakdown(spotlightFilter, range)
        .then(setBreakdownData)
        .catch((error) => {
          console.error("Failed to load breakdown:", error);
          setBreakdownData(null);
        })
        .finally(() => setLoadingBreakdown(false));
    } else {
      setBreakdownData(null);
    }
  }, [spotlightFilter, range]);

  const handleRangeChange = (newRange: "7d" | "30d" | "90d") => {
    setRange(newRange);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", newRange);
    if (spotlightFilter) {
      params.set("spotlight", spotlightFilter.toString());
    } else {
      params.delete("spotlight");
    }
    router.push(`/studio/results?${params.toString()}`);
  };

  const handleSpotlightChange = (spotlightId: number | undefined) => {
    setSpotlightFilter(spotlightId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    if (spotlightId) {
      params.set("spotlight", spotlightId.toString());
    } else {
      params.delete("spotlight");
    }
    router.push(`/studio/results?${params.toString()}`);
  };

  const getPlatformLabel = (platformId: string) => {
    const platform = PLATFORMS.find((p) => p.id === platformId);
    return platform ? `${platform.icon} ${platform.label}` : platformId;
  };

  // Empty state when no spotlights exist
  if (spotlights.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-6">Ergebnisse</h1>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-zinc-300 font-medium mb-2">
            📊 Sobald du Links teilst, siehst du hier wie es läuft.
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Starte ein Projekt und erstelle deinen ersten Link.
          </p>
          <a
            href="/studio/project"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Projekt starten →
          </a>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-6">Ergebnisse</h1>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-zinc-500 text-sm">
            Keine Daten verfügbar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ergebnisse</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Click-Analytics für deine Tracking-Links
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Range Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRangeChange("7d")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === "7d"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            7 Tage
          </button>
          <button
            onClick={() => handleRangeChange("30d")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === "30d"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            30 Tage
          </button>
          <button
            onClick={() => handleRangeChange("90d")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === "90d"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            90 Tage
          </button>
        </div>

        {/* Spotlight Filter */}
        {spotlights.length > 0 && (
          <select
            value={spotlightFilter || ""}
            onChange={(e) =>
              handleSpotlightChange(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
          >
            <option value="">Alle Projekte</option>
            {spotlights.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Total Clicks Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Gesamt Clicks
            </div>
            <div className="text-4xl font-bold">
              {breakdownData 
                ? breakdownData.total_clicks.toLocaleString() 
                : analytics.total_clicks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {range === "7d" ? "Letzte 7 Tage" : range === "30d" ? "Letzte 30 Tage" : "Letzte 90 Tage"}
            </div>
          </div>
          {breakdownData && breakdownData.trend !== 0 && (
            <div className={`text-sm font-medium ${
              breakdownData.trend > 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {breakdownData.trend > 0 ? "+" : ""}{breakdownData.trend} vs. vorheriger Zeitraum
            </div>
          )}
        </div>
      </div>

      {/* Platform Breakdown - New Hierarchical View */}
      {breakdownData && breakdownData.by_platform.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nach Plattform & Platzierung</h2>
          {loadingBreakdown ? (
            <div className="text-center py-8 text-gray-500">Lädt...</div>
          ) : (
            <PlatformBreakdown data={breakdownData} />
          )}
        </div>
      )}

      {/* Fallback: Old Platform Breakdown (when no spotlight selected) */}
      {!breakdownData && analytics.by_platform.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nach Plattform</h2>
          <div className="space-y-3">
            {analytics.by_platform.map((item) => {
              const percentage =
                analytics.total_clicks > 0
                  ? (item.clicks / analytics.total_clicks) * 100
                  : 0;
              return (
                <div key={item.platform}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      {getPlatformLabel(item.platform)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.clicks} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placement Breakdown - Only show when no spotlight selected (fallback) */}
      {!breakdownData && analytics.by_placement.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nach Platzierung</h2>
          <div className="text-xs text-gray-500 mb-3">
            💡 Wähle ein Projekt oben aus, um die hierarchische Ansicht zu sehen
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium">Plattform</th>
                  <th className="text-left py-2 px-3 font-medium">Platzierung</th>
                  <th className="text-right py-2 px-3 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {analytics.by_placement.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-2 px-3">{getPlatformLabel(item.platform)}</td>
                    <td className="py-2 px-3 capitalize">{item.placement}</td>
                    <td className="py-2 px-3 text-right font-medium">
                      {item.clicks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Referrer Stats */}
      {analytics.by_referrer.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Top Referrer</h2>
          <div className="space-y-2">
            {analytics.by_referrer.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm truncate max-w-[70%]">{item.referrer}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.clicks}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Chart (Simple Bar Chart) */}
      {analytics.trend.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Trend</h2>
          <div className="flex items-end justify-between h-48 gap-1">
            {analytics.trend.map((point, idx) => {
              const maxClicks = Math.max(...analytics.trend.map((p) => p.clicks));
              const height = maxClicks > 0 ? (point.clicks / maxClicks) * 100 : 0;
              const date = new Date(point.date);
              const label = `${date.getDate()}.${date.getMonth() + 1}`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors relative group"
                    style={{ height: `${height}%`, minHeight: point.clicks > 0 ? "4px" : "0" }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {point.clicks} Clicks
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {analytics.total_clicks === 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Noch keine Clicks erfasst
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Teile deine Links, um erste Daten zu sammeln
          </p>
        </div>
      )}
    </div>
  );
}
