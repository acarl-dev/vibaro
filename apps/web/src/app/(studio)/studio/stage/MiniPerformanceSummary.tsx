"use client";

import type { AnalyticsData } from "@/lib/api/stage";

interface MiniPerformanceSummaryProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export default function MiniPerformanceSummary({
  analytics,
  loading,
}: MiniPerformanceSummaryProps) {
  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Wie läuft&apos;s?</h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-sm text-zinc-500">Laden…</p>
        </div>
      </section>
    );
  }

  if (!analytics || analytics.total_clicks === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Wie läuft&apos;s?</h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-500">
            Noch keine Klicks. Erstelle Links und teile sie – die Ergebnisse erscheinen hier.
          </p>
        </div>
      </section>
    );
  }

  // Find best platform from by_module data (module maps to platform source in our flow)
  const bestPlatform =
    analytics.by_referrer.length > 0
      ? analytics.by_referrer.reduce((a, b) => (b.clicks > a.clicks ? b : a))
      : null;

  // Mini sparkline from trend data (last 7 entries)
  const trendData = analytics.trend.slice(-7);
  const maxClicks = Math.max(...trendData.map((t) => t.clicks), 1);

  return (
    <section>
      <h2 className="text-2xl font-bold text-zinc-100 mb-4">Wie läuft&apos;s?</h2>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total clicks */}
          <div>
            <p className="text-xs text-zinc-500 mb-1">Klicks (7 Tage)</p>
            <p className="text-3xl font-bold text-zinc-100">
              {analytics.total_clicks}
            </p>
          </div>

          {/* Best source */}
          {bestPlatform && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">Beste Quelle</p>
              <p className="text-lg font-semibold text-zinc-100">
                {bestPlatform.referrer || "Direkt"}
              </p>
              <p className="text-xs text-zinc-400">
                {bestPlatform.clicks} Klicks
              </p>
            </div>
          )}

          {/* Mini trend */}
          {trendData.length > 1 && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">Letzte 7 Tage</p>
              <div className="flex items-end gap-1 h-10">
                {trendData.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-zinc-700 rounded-sm min-h-[2px] transition-all"
                    style={{
                      height: `${Math.max((day.clicks / maxClicks) * 100, 5)}%`,
                    }}
                    title={`${day.date}: ${day.clicks} Klicks`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
