import { backendFetch } from "@/lib/api/backend";

export default async function PerformancePage() {
  // Fetch analytics data
  const response = await backendFetch("/api/v1/analytics/overview?range=7d");
  
  if (!response.ok) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="mt-4 text-zinc-500">
          Keine Performance-Daten verfügbar.
        </p>
      </div>
    );
  }

  const result = await response.json();
  const analytics = result.data;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Deine Tracking-Daten der letzten 7 Tage
        </p>
      </div>

      {/* Total Clicks */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
        <div className="text-sm font-medium text-zinc-500">Gesamt-Klicks</div>
        <div className="mt-2 text-4xl font-bold">{analytics.total_clicks}</div>
      </div>

      {/* By Module */}
      {analytics.by_module.length > 0 && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Klicks nach Modul</h2>
          <div className="space-y-3">
            {analytics.by_module.map((item: { module: string; clicks: number }) => (
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
            {analytics.by_referrer.map((item: { referrer: string; clicks: number }, index: number) => (
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
          <h2 className="mb-4 text-lg font-semibold">Trend (letzte 7 Tage)</h2>
          <div className="space-y-2">
            {analytics.trend.map((item: { date: string; clicks: number }) => (
              <div key={item.date} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{new Date(item.date).toLocaleDateString('de-DE')}</span>
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
