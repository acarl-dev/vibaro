import { PLATFORMS } from "@/lib/platforms";
import WhyButton from "../../../components/WhyButton";

type PlatformStat = { platform: string; clicks: number };

type PerformancePlatformBreakdownProps = {
  byPlatform: PlatformStat[];
};

function getPlatformInfo(id: string): { label: string; icon: string } {
  const p = PLATFORMS.find((pl) => pl.id === id);
  return { label: p?.label ?? id, icon: p?.icon ?? "🔗" };
}

export default function PerformancePlatformBreakdown({
  byPlatform,
}: PerformancePlatformBreakdownProps) {
  const regularPlatforms = byPlatform.filter((p) => p.platform !== "qr");
  const maxClicks = Math.max(...regularPlatforms.map((p) => p.clicks), 1);
  const totalByPlatform = regularPlatforms.reduce((s, p) => s + p.clicks, 0) || 1;

  return regularPlatforms.length > 0 ? (
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
            why: "Das zeigt dir, wo deine Fans für diese Phase wirklich aktiv sind. Wenn Instagram 70 % deiner Klicks bringt, solltest du dort gezielter bewerben. Wenn eine Plattform kaum Klicks bringt, lohnt sich der Aufwand dort vielleicht nicht.",
            example: "Instagram Story: 45 Klicks (70 %)\nYouTube: 12 Klicks (19 %)\nNewsletter: 7 Klicks (11 %)\n\n→ Du weißt jetzt: Instagram ist dein wichtigster Kanal.",
            tip: "Vergleiche die Plattform-Verteilung über mehrere Phasen. So siehst du, ob sich deine Strategie verändert.",
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
        Links verteilen →
      </a>
    </div>
  );
}