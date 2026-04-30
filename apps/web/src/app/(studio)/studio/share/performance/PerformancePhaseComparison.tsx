export type ComparisonPhase = {
  id: number;
  title: string;
  visitors: number;
  clicks: number;
  qr_scans: number;
  conversion: number | null;
  top_platform: string | null;
};

type PerformancePhaseComparisonProps = {
  comparison: { current: ComparisonPhase | null; previous: ComparisonPhase | null };
};

export default function PerformancePhaseComparison({
  comparison,
}: PerformancePhaseComparisonProps) {
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
      label: "Klicks pro Besucher",
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