"use client";

import ExplainPanel from "../../../components/ExplainPanel";
import PerformancePhaseComparison, { type ComparisonPhase } from "./PerformancePhaseComparison";
import PerformancePlatformBreakdown from "./PerformancePlatformBreakdown";
import PerformanceTrend from "./PerformanceTrend";
import WhyButton from "../../../components/WhyButton";

type PlatformStat = { platform: string; clicks: number };
type TrendPoint = { date: string; clicks: number };
type PvTrendPoint = { date: string; views: number };

export type { ComparisonPhase } from "./PerformancePhaseComparison";

type Props = {
  totalClicks: number;
  uniquePageviews: number;
  conversionRate: number | null;
  byPlatform: PlatformStat[];
  trend: TrendPoint[];
  pvTrend: PvTrendPoint[];
  phaseTitle: string | null;
  comparison: { current: ComparisonPhase | null; previous: ComparisonPhase | null };
};

export default function PerformanceClient({
  totalClicks,
  uniquePageviews,
  conversionRate,
  byPlatform,
  trend,
  pvTrend,
  phaseTitle,
  comparison,
}: Props) {
  // Separate QR scans from regular platform clicks
  const qrEntry = byPlatform.find((p) => p.platform === "qr");
  const qrClicks = qrEntry?.clicks ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-lg font-bold uppercase tracking-[0.08em]"
          >
            PERFORMANCE
          </h1>
          {phaseTitle && (
            <p className="text-sm mt-1" style={{ color: "var(--studio-text-secondary)" }}>
              {phaseTitle} · Letzte 7 Tage
            </p>
          )}
          <div className="mt-2">
            <WhyButton
              label="Was bedeuten die Zahlen?"
              content={{
                title: "Performance verstehen",
                what: "Hier siehst du, wie gut deine Seite und deine Links in dieser Phase performen.",
                why: "Besucher = wie viele Menschen deine Seite geöffnet haben. Klicks = wie viele davon auf einen Link gedrückt haben. Von 100 Besuchern klicken z.\u202fB. 30 auf einen Link – das sind 30 % Conversion.",
                example: "100 Besucher, 30 Klicks → 30 % Conversion ✔️ Gut!\n100 Besucher, 5 Klicks → 5 % Conversion → Deine wichtigsten Links vielleicht weiter oben platzieren.",
                tip: "Wenn deine Conversion unter 10 % liegt, überprüfe, ob deine wichtigsten Links gut sichtbar angezeigt werden.",
              }}
            />
          </div>
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
          {conversionRate !== null && uniquePageviews > 0 && (() => {
            const pct = Math.round(conversionRate * 100);
            const hasClicks = (totalClicks - qrClicks) > 0;
            // Neutral style when 0% (no clicks yet — not a failure, just empty)
            const activeStyle = hasClicks && pct > 0
              ? { bg: "var(--studio-accent-muted)", border: "rgba(230,57,70,0.3)", color: "var(--studio-accent)" }
              : { bg: "var(--studio-surface-elevated)", border: "var(--studio-border)", color: "var(--studio-text-secondary)" };
            return (
              <div
                className="text-right rounded px-3 py-1 self-start"
                style={{ background: activeStyle.bg, border: `1px solid ${activeStyle.border}` }}
              >
                <p className="text-xl font-bold" style={{ color: activeStyle.color }}>
                  {pct}&thinsp;%
                </p>
                <p className="text-xs mt-0.5" style={{ color: activeStyle.color, opacity: 0.7 }}>
                  Conversion
                </p>
              </div>
            );
          })()}
        </div>
      </div>

      <ExplainPanel
        body={[
          "Hier siehst du, wie viele Menschen deine Seite besucht und auf deine Links geklickt haben.",
          "Schau vor allem auf die Plattform-Verteilung: Wenn Instagram 70 % deiner Klicks bringt, solltest du dort mehr posten. Wenn YouTube kaum Klicks bringt, ist der Aufwand dort vielleicht nicht wert.",
        ]}
        nextSteps={[
          "Warte 3–7 Tage, damit ausreichend Daten da sind",
          "Schau, welche Plattform am meisten Klicks gebracht hat",
          "Verlagere deinen Fokus auf diese Plattform für die nächste Phase",
        ]}
        examples={[
          { icon: "📊", label: "Instagram 70 %, YouTube 20 %, Newsletter 10 %", description: "Instagram ist dein Top-Kanal. Mehr Story- und Bio-Posts, weniger Energie in andere Kanäle stecken." },
          { icon: "⚠️", label: "Ein Kanal liegt dauerhaft unter 5 %", description: "Du kannst ihn ruhig deprioritisieren – oder ausprobieren, ob mehr Posting dort was ändert." },
        ]}
        tip={{ text: "Niedrige Conversion (unter 10 %)? Dann überprüfe: Sind deine wichtigsten Links gut sichtbar? Hast du einen klaren Aufruf zum Klicken?" }}
      />

      <PerformanceTrend
        trend={trend}
        pvTrend={pvTrend}
        uniquePageviews={uniquePageviews}
      />

      <PerformancePlatformBreakdown byPlatform={byPlatform} />

      {/* Phase comparison */}
      <PerformancePhaseComparison comparison={comparison} />
    </div>
  );
}
