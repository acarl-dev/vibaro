"use client";

import { useState } from "react";
import { PLATFORMS } from "@/lib/platforms";
import ExplainPanel from "../../../components/ExplainPanel";
import WhyButton from "../../../components/WhyButton";

type PlatformStat = { platform: string; clicks: number };
type TrendPoint = { date: string; clicks: number };
type PvTrendPoint = { date: string; views: number };

export type ComparisonPhase = {
  id: number;
  title: string;
  visitors: number;
  clicks: number;
  qr_scans: number;
  conversion: number | null;
  top_platform: string | null;
};

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

function getPlatformInfo(id: string): { label: string; icon: string } {
  const p = PLATFORMS.find((pl) => pl.id === id);
  return { label: p?.label ?? id, icon: p?.icon ?? "🔗" };
}

function TrendBar({ data, label }: {
  data: { date: string; value: number }[];
  label: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const total = values.reduce((s, v) => s + v, 0);
  const peakIdx = values.reduce((maxI, v, i) => (v > values[maxI] ? i : maxI), 0);

  // Single data point — show a simple stat instead
  if (data.length === 1) {
    return (
      <div
        className="flex items-center gap-4 py-4 px-2"
        style={{ color: "var(--studio-text-secondary)", fontSize: "13px" }}
      >
        <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--studio-text-primary)" }}>
          {values[0]}
        </span>
        <span>
          {label} am{" "}
          <span style={{ color: "var(--studio-text-primary)" }}>
            {new Date(data[0].date).toLocaleDateString("de-DE", { day: "2-digit", month: "long" })}
          </span>
          <br />
          <span style={{ fontSize: "11px" }}>Noch zu wenig Daten für einen Verlauf</span>
        </span>
      </div>
    );
  }

  // Show every N-th date label so they don't overlap
  const showEvery = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 4;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : null;

  return (
    <div className="space-y-0">
      {/* Summary row */}
      <div className="flex items-center justify-between mb-2 text-[11px]" style={{ color: "var(--studio-text-secondary)" }}>
        <span>
          Gesamt: <span style={{ color: "var(--studio-text-primary)", fontWeight: 600 }}>{total} {label}</span>
        </span>
        <span>
          Bester Tag: <span style={{ color: "var(--studio-accent)", fontWeight: 600 }}>
            {values[peakIdx]} {label} am {new Date(data[peakIdx].date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
          </span>
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-24 relative">
        {data.map((d, i) => {
          const isHovered = hoveredIdx === i;
          const isPeak = i === peakIdx;
          const heightPct = Math.max(6, (values[i] / max) * 100);
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute bottom-full mb-1.5 z-10 pointer-events-none"
                  style={{
                    background: "var(--studio-surface-elevated)",
                    border: "1px solid var(--studio-border)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                    color: "var(--studio-text-primary)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: isPeak ? "var(--studio-accent)" : "var(--studio-text-primary)" }}>
                    {values[i]}
                  </span>{" "}
                  {label}
                  <br />
                  <span style={{ color: "var(--studio-text-secondary)", fontSize: "10px" }}>
                    {new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              )}
              {/* Bar */}
              <div
                className="w-full transition-all"
                style={{
                  height: `${heightPct}%`,
                  background: isHovered
                    ? isPeak ? "var(--studio-accent)" : "rgba(255,255,255,0.25)"
                    : isPeak ? "var(--studio-accent)" : "rgba(255,255,255,0.1)",
                  borderRadius: "3px 3px 2px 2px",
                  opacity: activeIdx !== null && !isHovered ? 0.5 : 1,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Date axis */}
      <div className="flex items-start gap-1 mt-1">
        {data.map((d, i) => (
          <div key={d.date} className="flex-1 text-center" style={{ fontSize: "9px", color: "var(--studio-text-secondary)", opacity: i % showEvery === 0 ? 1 : 0 }}>
            {new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
          </div>
        ))}
      </div>
    </div>
  );
}

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
            Zu Distribution \u2192
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
            <TrendBar data={trend.map((d) => ({ date: d.date, value: d.clicks }))} label="Klicks" />
          )}
          {trendMode === "views" && pvTrend.length > 0 && (
            <TrendBar data={pvTrend.map((d) => ({ date: d.date, value: d.views }))} label="Seitenbesuche" />
          )}
        </div>
      )}

      {/* Platform distribution */}
      {regularPlatforms.length > 0 ? (
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              Plattform-Verteilung
            </p>
            <WhyButton
              content={{
                title: "Plattform-Verteilung",
                what: "Hier siehst du, welche Plattform wie viele Klicks auf deine Seite gebracht hat.",
                why: "Das zeigt dir, wo deine Fans wirklich aktiv sind. Wenn Instagram 70 % deiner Klicks bringt, solltest du dort aktiver posten. Wenn eine Plattform kaum Klicks bringt, lohnt sich der Aufwand dort vielleicht nicht.",
                example: "Instagram Story: 45 Klicks (70 %)\nYouTube: 12 Klicks (19 %)\nNewsletter: 7 Klicks (11 %)\n\n→ Du weißt jetzt: Instagram ist dein wichtigster Kanal.",
                tip: "Vergleiche die Plattform-Verteilung \u00fcber mehrere Phasen. So siehst du, ob sich deine Strategie ver\u00e4ndert.",
              }}
            />
          </div>
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

      {/* Phase comparison */}
      <PhaseComparison comparison={comparison} />
    </div>
  );
}

function PhaseComparison({
  comparison,
}: {
  comparison: { current: ComparisonPhase | null; previous: ComparisonPhase | null };
}) {
  const { current, previous } = comparison;

  const section = (
    <div
      className="rounded-lg p-6"
      style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        Phasen-Vergleich
      </p>
      {!current && (
        <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
          Vergleich benötigt mindestens eine Phase mit Daten.
        </p>
      )}
      {current && !previous && (
        <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
          Noch keine abgeschlossene Phase zum Vergleichen.
        </p>
      )}
      {current && previous && <ComparisonTable current={current} previous={previous} />}
    </div>
  );

  return section;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE");
}

function delta(
  current: number,
  previous: number,
  mode: "percent" | "pp" = "percent"
): { label: string; positive: boolean; neutral: boolean } {
  if (previous === 0) return { label: "—", positive: false, neutral: true };
  if (mode === "pp") {
    const diff = current - previous;
    return {
      label: `${diff > 0 ? "+" : ""}${diff.toFixed(1)} pp`,
      positive: diff > 0,
      neutral: diff === 0,
    };
  }
  const pct = ((current - previous) / previous) * 100;
  return {
    label: `${pct > 0 ? "+" : ""}${Math.round(pct)}%`,
    positive: pct > 0,
    neutral: pct === 0,
  };
}

function ComparisonTable({
  current,
  previous,
}: {
  current: ComparisonPhase;
  previous: ComparisonPhase;
}) {
  const rows: {
    label: string;
    cur: string;
    prev: string;
    d: ReturnType<typeof delta>;
  }[] = [
    {
      label: "Besucher",
      cur: fmt(current.visitors),
      prev: fmt(previous.visitors),
      d: delta(current.visitors, previous.visitors),
    },
    {
      label: "Klicks",
      cur: fmt(current.clicks),
      prev: fmt(previous.clicks),
      d: delta(current.clicks, previous.clicks),
    },
    {
      label: "QR-Scans",
      cur: fmt(current.qr_scans),
      prev: fmt(previous.qr_scans),
      d: delta(current.qr_scans, previous.qr_scans),
    },
    {
      label: "Conversion",
      cur: current.conversion !== null ? `${current.conversion}%` : "—",
      prev: previous.conversion !== null ? `${previous.conversion}%` : "—",
      d:
        current.conversion !== null && previous.conversion !== null
          ? delta(current.conversion, previous.conversion, "pp")
          : { label: "—", positive: false, neutral: true },
    },
  ];

  return (
    <div className="space-y-1">
      {/* Phase labels */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div />
        <div className="text-[11px] font-semibold" style={{ color: "var(--studio-accent)" }}>
          {current.title}
        </div>
        <div className="text-[11px]" style={{ color: "var(--studio-text-secondary)" }}>
          {previous.title}
        </div>
        <div className="text-[11px] font-semibold" style={{ color: "var(--studio-text-secondary)" }}>
          Δ
        </div>
      </div>

      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-4 gap-2 items-center py-2"
          style={{ borderTop: "1px solid var(--studio-border)" }}
        >
          <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            {row.label}
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
            {row.cur}
          </span>
          <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
            {row.prev}
          </span>
          <span
            className="text-xs font-semibold"
            style={{
              color: row.d.neutral
                ? "var(--studio-text-secondary)"
                : row.d.positive
                ? "var(--studio-success, #22c55e)"
                : "var(--studio-error, #ef4444)",
            }}
          >
            {row.d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
