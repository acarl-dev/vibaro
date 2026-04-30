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
  );
}
