"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { endSpotlight } from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";
import ExplainPanel from "../../components/ExplainPanel";
import WhyButton from "../../components/WhyButton";
import PhaseQuickActions from "./PhaseQuickActions";
import PhaseEmptyStateCard from "./PhaseEmptyStateCard";
import PhaseMetricsSummary from "./PhaseMetricsSummary";

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
  scheduledCount?: number;
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

export default function PhaseOverviewClient({ activeSpotlight, analytics, scheduledCount = 0 }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isEnding, setIsEnding] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleEnd = async () => {
    if (!activeSpotlight) return;
    setIsEnding(true);
    try {
      const result = await endSpotlight(activeSpotlight.id);
      if (!result.success) {
        showToast(result.error || "Fehler beim Beenden der Phase.", "error");
        return;
      }
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
        <StudioPageHeader
          title="PHASE"
          subtitle="Bandseite plus messbarer Fokus für aktuelle Aktionen."
          action={
            <WhyButton
              label="Was ist eine Phase?"
              content={{
                title: "Was ist eine Phase?",
                what: "Eine Phase ist dein aktueller Fokus, zum Beispiel eine neue Single, eine Tour-Ankündigung oder Merch.",
                why: "Während einer Phase erstellst du eigene Links, verteilst Links und QR-Codes und siehst später messbar, was für genau diesen Push funktioniert hat.",
                example: "🎵 Release-Phase: Du bewirbst deinen neuen Song 2 Wochen lang.\n🎭 Tour-Phase: Du bewirbst deine Tour 4 Wochen lang.\n🎛️ Studio-Phase: Du teilst neue Studio-Einblicke.",
                tip: "Beende die aktuelle Phase, bevor du eine neue startest. So bleiben deine Statistiken klar trennbar.",
              }}
            />
          }
        />
        <ExplainPanel
          heading="Was ist eine Phase?"
          body={[
            "Eine Phase ist dein aktueller Fokus, zum Beispiel Release, Tour oder Merch.",
            "Sie hält deine Links, QR-Codes und Ergebnisse für diesen Push getrennt messbar.",
          ]}
          nextSteps={[
            "Klick auf \"Neue Phase starten\"",
            "Wähle ein Ziel (z. B. Single Release oder Tour)",
            "Danach gehst du zu Links verteilen und erzeugst deine ersten Links",
          ]}
          examples={[
            { icon: "🎵", label: "Single Release", description: "Du veröffentlichst einen neuen Song. Starte eine Phase, erstelle Story- und Bio-Links, und beobachte, wo die meisten Klicks herkommen." },
            { icon: "🎭", label: "Tour-Ankündigung", description: "Du kündigst eine Tour an. Erstelle Links für Instagram, YouTube und deinen Newsletter – und vergleiche am Ende, was am besten funktioniert hat." },
          ]}
          tip={{ text: "Starte immer eine neue Phase für jedes neue Ziel – so bleiben deine Daten sauber und vergleichbar." }}
        />
        <PhaseEmptyStateCard
          scheduledCount={scheduledCount}
          onCreatePhase={() => router.push("/studio/share/new")}
          onOpenPhases={() => router.push("/studio/share/phases")}
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
        subtitle="Aktueller Fokus · Letzte 7 Tage"
        action={
          <WhyButton
            label="Was ist eine Phase?"
            content={{
              title: "Was ist eine Phase?",
              what: "Eine Phase ist dein aktueller Fokus, zum Beispiel Release, Tour, Merch oder Studio.",
              why: "Sie sorgt dafür, dass dein aktueller Push getrennt messbar bleibt, während du Links und QR-Codes verteilst.",
              example: "🎵 Release-Phase: Du bewirbst deinen neuen Song 2 Wochen lang.\n🎭 Tour-Phase: Du bewirbst deine Tour 4 Wochen lang.",
              tip: "Beende die aktuelle Phase, bevor du eine neue startest. So bleiben deine Statistiken klar trennbar.",
            }}
          />
        }
      />

      <ExplainPanel
        body={[
          "Deine Phase läuft gerade. Jetzt gilt der Produktloop: Fokus steht, Links und QR-Codes teilen, dann die Performance dieser Phase prüfen.",
        ]}
        nextSteps={[
          "Geh zu Links verteilen und erstelle einen Story-Link für Instagram",
          "Poste den Link heute in deiner Story",
          "Komm in 2–3 Tagen zurück und schau in Performance",
        ]}
        tip={{ text: "Verteile verschiedene Links für Instagram Story, Bio und YouTube und nutze denselben QR-Code während der ganzen Phase." }}
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
                className="text-xs"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--studio-text-secondary)",
                  opacity: 0.55,
                  cursor: "pointer",
                  padding: "4px 0",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: "currentColor",
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
      <PhaseMetricsSummary
        uniqueVisitors={uniqueVisitors}
        regularClicks={regularClicks}
        qrClicks={qrClicks}
        conversionRate={conversionRate}
        trendStat={trendStat}
      />

      {/* Navigation hints */}
      <PhaseQuickActions />
    </div>
  );
}

