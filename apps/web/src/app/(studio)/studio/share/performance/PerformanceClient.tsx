"use client";

import { useState } from "react";
import { PLATFORMS } from "@/lib/platforms";

type PlatformStat = { platform: string; clicks: number };
type TrendPoint = { date: string; clicks: number };
type PvTrendPoint = { date: string; views: number };

type Props = {
  totalClicks: number;
  totalPageviews: number;
  uniquePageviews: number;
  conversionRate: number | null;
  byPlatform: PlatformStat[];
  trend: TrendPoint[];
  pvTrend: PvTrendPoint[];
  phaseTitle: string | null;
};

function getPlatformInfo(id: string): { label: string; icon: string } {
  const p = PLATFORMS.find((pl) => pl.id === id);
  return { label: p?.label ?? id, icon: p?.icon ?? "🔗" };
}

function TrendBar({ data, label }: {
  data: { date: string; value: number }[];
  label: string;
}) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const peakIdx = values.reduce((maxI, v, i) => (v > values[maxI] ? i : maxI), 0);

  return (
    <div className="space-y-1">
      <div className="flex items-end gap-1 h-24">
        {data.map((d, i) => (
          <div
            key={d.date}
            className="flex-1 rounded-t transition-all"
            style={{
              height: `${Math.max(4, (values[i] / max) * 100)}%`,
              background: i === peakIdx ? "var(--studio-accent)" : "var(--studio-border)",
            }}
            title={`${new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}: ${values[i]} ${label}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px]" style={{ color: "var(--studio-text-secondary)" }}>
        {data.length > 0 && (
          <>
            <span>{new Date(data[0].date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</span>
            <span className="font-semibold" style={{ color: "var(--studio-accent)" }}>
              ▲ Peak: {new Date(data[peakIdx].date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            </span>
            <span>{new Date(data[data.length - 1].date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function PerformanceClient({
  totalClicks,
  totalPageviews,
  uniquePageviews,
  conversionRate,
  byPlatform,
  trend,
  pvTrend,
  phaseTitle,
}: Props) {
  const [trendMode, setTrendMode] = useState<"clicks" | "views">("clicks");

  // Separate QR scans from regular platform clicks
  const qrEntry = byPlatform.find((p) => p.platform === "qr");
  const qrClicks = qrEntry?.clicks ?? 0;
  const regularPlatforms = byPlatform.filter((p) => p.platform !== "qr");

  const maxClicks = Math.max(...regularPlatforms.map((p) => p.clicks), 1);
  const totalByPlatform = regularPlatforms.reduce((s, p) => s + p.clicks, 0) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-lg font-bold uppercase tracking-[0.08em]"
            style={{ color: "var(--studio-text-primary)" }}
          >
            PERFORMANCE
          </h1>
          {phaseTitle && (
            <p className="text-sm mt-1" style={{ color: "var(--studio-text-secondary)" }}>
              {phaseTitle} · Letzte 7 Tage
            </p>
          )}
        </div>
      <div className="flex items-start gap-4 flex-shrink-0 flex-wrap justify-end">
        {uniquePageviews > 0 && (
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: "var(--studio-text-primary)" }}>
              {uniquePageviews}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)" }}>
              Besucher
            </p>
          </div>
        )}
        <div className="text-right">
          <p className="text-3xl font-bold" style={{ color: "var(--studio-text-primary)" }}>
            {totalClicks - qrClicks}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)" }}>
            Klicks
          </p>
        </div>
        {qrClicks > 0 && (
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: "var(--studio-accent)" }}>
              {qrClicks}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)" }}>
              QR-Scans
            </p>
          </div>
        )}
        {conversionRate !== null && uniquePageviews > 0 && (
          <div
            className="text-right rounded px-3 py-1 self-start"
            style={{ background: "var(--studio-accent-muted)", border: "1px solid var(--studio-accent)" }}
          >
            <p className="text-xl font-bold" style={{ color: "var(--studio-accent)" }}>
              {Math.round(conversionRate * 100)}&thinsp;%
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--studio-accent)", opacity: 0.7 }}>
              Conversion
            </p>
          </div>
        )}
      </div>
      </div>

      {/* Trend */}
      {(trend.length > 0 || pvTrend.length > 0) && (
        <div
          className="rounded-lg p-6"
          style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              Zeitverlauf
            </p>
            {uniquePageviews > 0 && (
              <div className="flex gap-1">
                {(["clicks", "views"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTrendMode(m)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded transition-colors"
                    style={
                      trendMode === m
                        ? { background: "var(--studio-accent)", color: "#fff" }
                        : { background: "var(--studio-surface-elevated)", color: "var(--studio-text-secondary)", border: "1px solid var(--studio-border)" }
                    }
                  >
                    {m === "clicks" ? "Klicks" : "Besucher"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {trendMode === "clicks" && trend.length > 0 && (
            <TrendBar data={trend.map((d) => ({ date: d.date, value: d.clicks }))} label="Klicks" />
          )}
          {trendMode === "views" && pvTrend.length > 0 && (
            <TrendBar data={pvTrend.map((d) => ({ date: d.date, value: d.views }))} label="Besucher" />
          )}
        </div>
      )}

      {/* Platform distribution */}
      {regularPlatforms.length > 0 ? (
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            Plattform-Verteilung
          </p>
          {regularPlatforms.map((p) => {
            const { label, icon } = getPlatformInfo(p.platform);
            const pct = Math.round((p.clicks / totalByPlatform) * 100);
              const barWidth = Math.round((p.clicks / maxClicks) * 100);
            return (
              <div key={p.platform} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">{icon}</span>
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--studio-text-primary)" }}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--studio-accent)" }}
                    >
                      {pct}%
                    </span>
                    <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                      {p.clicks} Klicks
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--studio-surface-elevated)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      background: "var(--studio-accent)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
            Noch keine Klick-Daten für diese Phase.
          </p>
          <a
            href="/studio/share/distribution"
            className="studio-btn studio-btn-primary mt-4 inline-flex"
          >
            Links erstellen →
          </a>
        </div>
      )}

      {/* Phase comparison placeholder */}
      <div
        className="rounded-lg p-6"
        style={{
          background: "var(--studio-surface)",
          border: "1px solid var(--studio-border)",
          opacity: 0.6,
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Phasen-Vergleich
        </p>
        <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
          Vergleich benötigt mindestens 2 abgeschlossene Phasen.
        </p>
      </div>
    </div>
  );
}
