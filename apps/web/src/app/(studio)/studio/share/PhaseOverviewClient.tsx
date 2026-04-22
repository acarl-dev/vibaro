"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { endSpotlight } from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import StudioStatCard from "../../components/StudioStatCard";
import { Megaphone } from "../../components/StudioIcons";
import ExplainPanel from "../../components/ExplainPanel";
import WhyButton from "../../components/WhyButton";

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

function NavKachel({ label, desc, href }: { label: string; desc: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-between gap-3 rounded-lg p-4 transition-all no-underline"
      style={{
        background: "var(--studio-surface-elevated)",
        border: hovered ? "1px solid var(--studio-accent-muted)" : "1px solid var(--studio-border)",
        textDecoration: "none",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--studio-text-primary)" }}
        >
          {label}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--studio-text-secondary)", opacity: 0.75 }}
        >
          {desc}
        </span>
      </div>
      <span style={{ color: "var(--studio-text-secondary)", opacity: 0.45, fontSize: "18px", lineHeight: 1, flexShrink: 0 }}>
        &#8250;
      </span>
    </a>
  );
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
          subtitle="Zeitlich gezielte Kampagnen für deine Seite."
          action={
            <WhyButton
              label="Was ist eine Phase?"
              content={{
                title: "Was ist eine Phase?",
                what: "Eine Phase ist ein Zeitraum, in dem du etwas gezielt pushst – zum Beispiel eine neue Single, ein Album oder eine Tour-Ankündigung.",
                why: "Während einer Phase erzeugst du Tracking-Links, verteilst sie auf deinen Kanälen und analysierst später, was am besten funktioniert hat. Wenn du eine neue Kampagne startest, beginnst du eine neue Phase – so bleiben deine Daten sauber und vergleichbar.",
                example: "🎵 Single Release-Phase: Du pushst deinen neuen Song 2 Wochen lang.\n🎭 Tour-Phase: Du kommunizierst deine Tour 4 Wochen lang.\n🛏️ Studio-Phase: Du gibst Einblicke in dein Studio, um die Vorfreude zu steigern.",
                tip: "Beende die aktuelle Phase, bevor du eine neue startest. So bleiben deine Statistiken klar trennbar.",
              }}
            />
          }
        />
        <ExplainPanel
          heading="Was ist eine Phase?"
          body={[
            "Eine Phase ist ein Zeitraum, in dem du etwas gezielt pushst – zum Beispiel eine neue Single, ein Album oder eine Tour-Ankündigung.",
            "Während einer Phase erzeugst du Tracking-Links, verteilst sie auf deinen Kanälen und siehst hinterher, was am besten funktioniert hat.",
          ]}
          nextSteps={[
            "Klick auf \"Neue Phase starten\"",
            "Wähle ein Ziel (z. B. Single Release oder Tour)",
            "Danach gehst du zu Distribution und erzeugst deine ersten Links",
          ]}
          examples={[
            { icon: "🎵", label: "Single Release", description: "Du veröffentlichst einen neuen Song. Starte eine Phase, erstelle Story- und Bio-Links, und beobachte, wo die meisten Klicks herkommen." },
            { icon: "🎭", label: "Tour-Ankündigung", description: "Du kündigst eine Tour an. Erstelle Links für Instagram, YouTube und deinen Newsletter – und vergleiche am Ende, was am besten funktioniert hat." },
          ]}
          tip={{ text: "Starte immer eine neue Phase für jede neue Kampagne – so bleiben deine Daten sauber und vergleichbar." }}
        />
        <StudioEmptyState
          icon={Megaphone}
          title="Keine aktive Phase"
          description="Starte eine neue Phase, um deine Seite gezielt zu pushen."
          action={
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => router.push("/studio/share/new")}
                className="studio-btn studio-btn-primary"
              >
                Neue Phase starten
              </button>
              {scheduledCount > 0 && (
                <button
                  onClick={() => router.push("/studio/share/phases")}
                  className="text-xs underline"
                  style={{ color: "var(--studio-accent)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {scheduledCount} geplante {scheduledCount === 1 ? "Phase" : "Phasen"} anzeigen
                </button>
              )}
            </div>
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
        action={
          <WhyButton
            label="Was ist eine Phase?"
            content={{
              title: "Was ist eine Phase?",
              what: "Eine Phase ist ein Zeitraum, in dem du etwas gezielt pushst – zum Beispiel eine neue Single, ein Album oder eine Tour-Ankündigung.",
              why: "Während einer Phase erzeugst du Tracking-Links, verteilst sie auf deinen Kanälen und analysierst später, was am besten funktioniert hat. Wenn du eine neue Kampagne startest, beginnst du eine neue Phase.",
              example: "🎵 Single Release-Phase: Du pushst deinen neuen Song 2 Wochen lang.\n🎭 Tour-Phase: Du kommunizierst deine Tour 4 Wochen lang.",
              tip: "Beende die aktuelle Phase, bevor du eine neue startest. So bleiben deine Statistiken klar trennbar.",
            }}
          />
        }
      />

      <ExplainPanel
        body={[
          "Deine Phase läuft gerade. Erstelle jetzt Links für deine Kanäle und teile sie – dann siehst du hier, was passiert.",
        ]}
        nextSteps={[
          "Geh zu Distribution und erstelle einen Story-Link für Instagram",
          "Poste den Link heute in deiner Story",
          "Komm in 2–3 Tagen zurück und schau in Performance",
        ]}
        tip={{ text: "Verteile verschiedene Links für Instagram Story, Bio und YouTube – und schau am Ende, welcher Kanal am besten funktioniert." }}
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
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            Schnellübersicht
          </p>
          <WhyButton
            content={{
              title: "Statistiken verstehen",
              what: "Diese Zahlen zeigen dir, wie gut deine aktuelle Phase läuft.",
              why: "Besucher sagt dir, wie viele Menschen deine Seite geöffnet haben. Klicks zeigen, wie viele davon auch auf einen deiner Links gedrückt haben. Conversion zeigt das Verhältnis: Wenn 100 Leute deine Seite besuchen und 30 klicken, ist deine Conversion 30 %.",
              example: "100 Besucher, 30 Klicks = 30 % Conversion\n\nHohe Conversion = deine Seite überzeugt.\nNiedrige Conversion = vielleicht fehlt ein klarer Aufruf zum Handeln.",
              tip: "Wenn deine Conversion unter 10 % liegt, überprüfe, ob deine wichtigsten Links gut sichtbar sind.",
            }}
          />
        </div>
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

