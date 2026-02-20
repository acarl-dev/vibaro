"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalyticsData } from "@/lib/api/analytics";
import { SpotlightData } from "@/lib/api/spotlights";
import { PLATFORMS } from "@/lib/platforms";

type ResultsClientProps = {
  analytics: AnalyticsData | null;
  spotlights: SpotlightData[];
  initialRange: "7d" | "30d";
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
  const [range, setRange] = useState<"7d" | "30d">(initialRange);
  const [spotlightFilter, setSpotlightFilter] = useState<number | undefined>(
    initialSpotlightId
  );

  const handleRangeChange = (newRange: "7d" | "30d") => {
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

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Ergebnisse</h1>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
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
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Gesamt Clicks
        </div>
        <div className="text-4xl font-bold">{analytics.total_clicks.toLocaleString()}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {range === "7d" ? "Letzte 7 Tage" : "Letzte 30 Tage"}
        </div>
      </div>

      {/* Platform Breakdown */}
      {analytics.by_platform.length > 0 && (
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

      {/* Placement Breakdown */}
      {analytics.by_placement.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nach Platzierung</h2>
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
