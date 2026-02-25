"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { endSpotlight } from "@/lib/api/stage";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import StudioStatCard from "../../components/StudioStatCard";
import { Megaphone } from "../../components/StudioIcons";

export type PhaseSpotlight = {
  id: number;
  title: string;
  type: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
};

export type PhaseAnalytics = {
  total_clicks: number;
  total_pageviews: number;
  unique_pageviews: number;
  conversion_rate: number | null;
  by_platform: { platform: string; clicks: number }[];
  trend: { date: string; clicks: number }[];
};

type Props = {
  activeSpotlight: PhaseSpotlight | null;
  analytics: PhaseAnalytics | null;
};

function moduleLabel(type: string): string {
  if (["single", "album", "release"].includes(type)) return "Release";
  if (["tour", "event", "livestream"].includes(type)) return "Live";
  if (["merch"].includes(type)) return "Merch";
  return "Studio";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function computeTrend(trend: { date: string; clicks: number }[]): { value: string; positive: boolean } | undefined {
  if (trend.length < 2) return undefined;
  const half = Math.floor(trend.length / 2);
  const firstHalf = trend.slice(0, half).reduce((s, d) => s + d.clicks, 0);
  const secondHalf = trend.slice(half).reduce((s, d) => s + d.clicks, 0);
  if (firstHalf === 0) return undefined;
  const pct = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  return { value: `${pct > 0 ? "+" : ""}${pct}% Trend`, positive: pct >= 0 };
}

export default function PhaseOverviewClient({ activeSpotlight, analytics }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isEnding, setIsEnding] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleEnd = async () => {
    if (!activeSpotlight) return;
    setIsEnding(true);
    try {
      await endSpotlight(activeSpotlight.id);
      showToast("Phase beendet.", "success");
      router.refresh();
    } catch {
      showToast("Fehler beim Beenden der Phase.", "error");
    } finally {
      setIsEnding(false);
      setConfirmEnd(false);
    }
  };

  if (!activeSpotlight) {
    return (
      <div>
        <StudioPageHeader title="PHASE" subtitle="Zeitlich gezielte Kampagnen für deine Seite." />
        <StudioEmptyState
          icon={Megaphone}
          title="Keine aktive Phase"
          description="Starte eine neue Phase, um deine Seite gezielt zu pushen."
          action={
            <button
              onClick={() => router.push("/studio/share/new")}
              className="studio-btn studio-btn-primary"
            >
              Neue Phase starten
            </button>
          }
        />
      </div>
    );
  }

  const trendData = analytics?.trend ?? [];
  const totalClicks = analytics?.total_clicks ?? 0;
  const qrClicks = analytics?.by_platform.find((p) => p.platform === "qr")?.clicks ?? 0;
  const regularClicks = totalClicks - qrClicks;
  const uniqueVisitors = analytics?.unique_pageviews ?? 0;
  const conversionRate = analytics?.conversion_rate ?? null;
  const trendStat = computeTrend(trendData);

  return (
    <div className="space-y-8">
      <StudioPageHeader
        title="PHASE"
        subtitle="Aktive Phase · Letzte 7 Tage"
      />

      {/* Active Phase Card */}
      <div
        className="rounded-lg p-6"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "var(--studio-success)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--studio-success)] animate-pulse" />
                Aktiv
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
                style={{ background: "var(--studio-surface-elevated)", color: "var(--studio-accent)" }}
              >
                {moduleLabel(activeSpotlight.type)}
              </span>
            </div>

            <h2
              className="text-xl font-bold leading-snug truncate"
              style={{ color: "var(--studio-text-primary)" }}
            >
              {activeSpotlight.title}
            </h2>

            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
              <span>Start: {formatDate(activeSpotlight.starts_at)}</span>
              {activeSpotlight.ends_at && (
                <>
                  <span>·</span>
                  <span>Ende: {formatDate(activeSpotlight.ends_at)}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!confirmEnd ? (
              <button
                onClick={() => setConfirmEnd(true)}
                className="studio-btn text-xs"
                style={{
                  border: "1px solid var(--studio-border)",
                  color: "var(--studio-text-secondary)",
                }}
              >
                Phase beenden
              </button>
            ) : (
              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                  Wirklich beenden?
                </span>
                <button
                  onClick={handleEnd}
                  disabled={isEnding}
                  className="studio-btn text-xs disabled:opacity-50"
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#ef4444",
                  }}
                >
                  {isEnding ? "Beendet..." : "Ja, beenden"}
                </button>
                <button
                  onClick={() => setConfirmEnd(false)}
                  disabled={isEnding}
                  className="studio-btn text-xs"
                  style={{ color: "var(--studio-text-secondary)", border: "1px solid var(--studio-border)" }}
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Schnellübersicht
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StudioStatCard
            value={uniqueVisitors > 0 ? uniqueVisitors : "—"}
            label="Besucher"
          />
          <StudioStatCard
            value={regularClicks}
            label="Klicks"
            trend={trendStat}
          />
          <StudioStatCard
            value={qrClicks > 0 ? qrClicks : "—"}
            label="QR-Scans"
          />
          <StudioStatCard
            value={
              conversionRate !== null && uniqueVisitors > 0
                ? `${Math.round(conversionRate * 100)} %`
                : "—"
            }
            label="Conversion"
          />
        </div>
      </div>

      {/* Navigation hints */}
      <div
        className="rounded-lg p-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        {[
          { label: "Distribution", desc: "Plattformen & Links", href: "/studio/share/distribution" },
          { label: "QR & Offline", desc: "QR-Code für diese Phase", href: "/studio/share/qr" },
          { label: "Performance", desc: "Klicks & Plattform-Verteilung", href: "/studio/share/performance" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col gap-1 rounded p-4 transition-colors"
            style={{
              background: "var(--studio-surface-elevated)",
              border: "1px solid var(--studio-border)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--studio-text-primary)" }}
            >
              {item.label}
            </span>
            <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
              {item.desc}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

