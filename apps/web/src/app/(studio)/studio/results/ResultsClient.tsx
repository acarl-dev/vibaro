"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalyticsData } from "@/lib/api/analytics";
import { SpotlightData } from "@/lib/api/spotlights";
import { PLATFORMS } from "@/lib/platforms";
import { getAnalyticsBreakdown, AnalyticsBreakdown } from "@/lib/api/stage";
import PlatformBreakdown from "@/components/studio/results/PlatformBreakdown";
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import StudioStatCard from "../../components/StudioStatCard";
import { TrendingUp } from "../../components/StudioIcons";

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
      <div>
        <StudioPageHeader title="ERGEBNISSE" subtitle="Stats & Daten" />
        <StudioEmptyState
          icon={TrendingUp}
          title="Noch keine Daten"
          description="Sobald du Links teilst und deine Seite live ist, siehst du hier die Ergebnisse."
          action={
            <a href="/studio/project" className="studio-btn studio-btn-primary">
              Projekt starten →
            </a>
          }
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div>
        <StudioPageHeader title="ERGEBNISSE" subtitle="Stats & Daten" />
        <StudioEmptyState
          icon={TrendingUp}
          title="Keine Daten verfügbar"
          description="Teile deine Links, um erste Daten zu sammeln."
        />
      </div>
    );
  }

  return (
    <div>
      <StudioPageHeader title="ERGEBNISSE" subtitle="Click-Analytics für deine Tracking-Links" />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StudioStatCard
          value={(breakdownData ?? analytics).total_clicks.toLocaleString()}
          label={range === "7d" ? "Klicks (7 Tage)" : range === "30d" ? "Klicks (30 Tage)" : "Klicks (90 Tage)"}
          trend={
            breakdownData && breakdownData.trend !== 0
              ? { value: `${breakdownData.trend > 0 ? "+" : ""}${breakdownData.trend}`, positive: breakdownData.trend > 0 }
              : undefined
          }
        />
        <StudioStatCard value={spotlights.length} label="Projekte" />
        <StudioStatCard value={analytics.by_platform.length} label="Plattformen" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Range Filter */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className="studio-btn text-xs"
              style={
                range === r
                  ? { background: "var(--studio-accent)", color: "#fff", border: "none" }
                  : { background: "var(--studio-surface)", color: "var(--studio-text-secondary)", border: "1px solid var(--studio-border)" }
              }
            >
              {r === "7d" ? "7 Tage" : r === "30d" ? "30 Tage" : "90 Tage"}
            </button>
          ))}
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
            className="rounded px-3 py-2 text-sm"
            style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)" }}
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

      {/* Platform Breakdown - New Hierarchical View */}
      {breakdownData && breakdownData.by_platform.length > 0 && (
        <div className="rounded-lg p-6 mb-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Nach Plattform & Platzierung</h2>
          {loadingBreakdown ? (
            <div className="text-center py-8" style={{ color: "var(--studio-text-secondary)" }}>Lädt...</div>
          ) : (
            <PlatformBreakdown data={breakdownData} />
          )}
        </div>
      )}

      {/* Fallback: Old Platform Breakdown (when no spotlight selected) */}
      {!breakdownData && analytics.by_platform.length > 0 && (
        <div className="rounded-lg p-6 mb-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Nach Plattform</h2>
          <div className="space-y-3">
            {analytics.by_platform.map((item) => {
              const percentage =
                analytics.total_clicks > 0
                  ? (item.clicks / analytics.total_clicks) * 100
                  : 0;
              return (
                <div key={item.platform}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--studio-text-primary)" }}>
                      {getPlatformLabel(item.platform)}
                    </span>
                    <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
                      {item.clicks} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "var(--studio-border)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: "var(--studio-accent)" }}
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
        <div className="rounded-lg p-6 mb-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--studio-text-secondary)" }}>Nach Platzierung</h2>
          <div className="text-xs mb-3" style={{ color: "var(--studio-text-secondary)" }}>
            Wähle ein Projekt oben aus, um die hierarchische Ansicht zu sehen
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--studio-border)" }}>
                  <th className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Plattform</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Platzierung</th>
                  <th className="text-right py-2 px-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--studio-text-secondary)" }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {analytics.by_placement.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid var(--studio-border)",
                      background: idx % 2 === 0 ? "var(--studio-surface)" : "var(--studio-surface-elevated)",
                    }}
                  >
                    <td className="py-2 px-3" style={{ color: "var(--studio-text-primary)" }}>{getPlatformLabel(item.platform)}</td>
                    <td className="py-2 px-3 capitalize" style={{ color: "var(--studio-text-secondary)" }}>{item.placement}</td>
                    <td className="py-2 px-3 text-right font-semibold" style={{ color: "var(--studio-text-primary)" }}>
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
        <div className="rounded-lg p-6 mb-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Top Referrer</h2>
          <div className="space-y-2">
            {analytics.by_referrer.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid var(--studio-border)" }}
              >
                <span className="text-sm truncate max-w-[70%]" style={{ color: "var(--studio-text-secondary)" }}>{item.referrer}</span>
                <span className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
                  {item.clicks}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Chart (Simple Bar Chart) */}
      {analytics.trend.length > 0 && (
        <div className="rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Trend</h2>
          <div className="flex items-end justify-between h-48 gap-1">
            {analytics.trend.map((point, idx) => {
              const maxClicks = Math.max(...analytics.trend.map((p) => p.clicks));
              const height = maxClicks > 0 ? (point.clicks / maxClicks) * 100 : 0;
              const date = new Date(point.date);
              const label = `${date.getDate()}.${date.getMonth() + 1}`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t transition-colors relative group"
                    style={{ height: `${height}%`, minHeight: point.clicks > 0 ? "4px" : "0", background: "var(--studio-accent)" }}
                  >
                    <div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                      style={{ background: "var(--studio-surface-elevated)", color: "var(--studio-text-primary)", border: "1px solid var(--studio-border)" }}
                    >
                      {point.clicks} Clicks
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
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
        <StudioEmptyState
          icon={TrendingUp}
          title="Noch keine Clicks erfasst"
          description="Teile deine Links, um erste Daten zu sammeln."
        />
      )}
    </div>
  );
}
