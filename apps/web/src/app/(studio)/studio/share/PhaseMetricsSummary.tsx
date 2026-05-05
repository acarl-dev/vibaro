import StudioStatCard from "../../components/StudioStatCard";
import WhyButton from "../../components/WhyButton";

type TrendStat = {
  value: string;
  positive: boolean;
};

type Props = {
  uniqueVisitors: number;
  regularClicks: number;
  qrClicks: number;
  conversionRate: number | null;
  trendStat?: TrendStat;
};

export default function PhaseMetricsSummary({
  uniqueVisitors,
  regularClicks,
  qrClicks,
  conversionRate,
  trendStat,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--studio-text-secondary)" }}
        >
          Performance dieser Phase
        </p>
        <WhyButton
          content={{
            title: "Statistiken verstehen",
            what: "Diese Zahlen zeigen dir, wie gut deine aktuelle Phase läuft.",
            why: "Besucher zeigt dir, wie viele Menschen deine Seite geöffnet haben. Link-Klicks zeigen, wie viele davon auf einen deiner Links gedrückt haben. Conversion bedeutet hier kurz: Klicks pro Besucher.",
            example: "100 Besucher, 30 Klicks = 30 % Klicks pro Besucher.\n\nHoher Wert = deine Seite überzeugt.\nNiedriger Wert = vielleicht fehlt ein klarer nächster Schritt.",
            tip: "Wenn deine Klicks pro Besucher unter 10 % liegen, prüfe, ob deine wichtigsten Links gut sichtbar sind.",
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
          label="Link-Klicks"
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
          label="Klicks pro Besucher"
        />
      </div>
    </div>
  );
}
