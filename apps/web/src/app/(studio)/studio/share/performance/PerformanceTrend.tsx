"use client";

import { useState } from "react";
import PerformanceTrendBar from "./PerformanceTrendBar";

type TrendPoint = { date: string; clicks: number };
type PvTrendPoint = { date: string; views: number };

type PerformanceTrendProps = {
  trend: TrendPoint[];
  pvTrend: PvTrendPoint[];
  uniquePageviews: number;
};

export default function PerformanceTrend({
  trend,
  pvTrend,
  uniquePageviews,
}: PerformanceTrendProps) {
  const [trendMode, setTrendMode] = useState<"clicks" | "views">("clicks");

  return (
    <>
      {/* Trend */}
      {trend.length === 0 && pvTrend.length === 0 && (
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--studio-text-secondary)", marginBottom: "16px" }}>
            Noch keine Daten. Teile zuerst einen Tracking-Link.
          </p>
          <a href="/studio/share/distribution" className="studio-btn studio-btn-primary inline-flex">
            Zu Distribution →
          </a>
        </div>
      )}
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
              Klicks &amp; Besuche pro Tag
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
                    {m === "clicks" ? "Link-Klicks" : "Seitenbesuche"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {trendMode === "clicks" && trend.length > 0 && (
            <PerformanceTrendBar data={trend.map((d) => ({ date: d.date, value: d.clicks }))} label="Klicks" />
          )}
          {trendMode === "views" && pvTrend.length > 0 && (
            <PerformanceTrendBar data={pvTrend.map((d) => ({ date: d.date, value: d.views }))} label="Seitenbesuche" />
          )}
        </div>
      )}
    </>
  );
}