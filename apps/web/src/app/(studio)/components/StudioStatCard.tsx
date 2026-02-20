type StudioStatCardProps = {
  value: string | number;
  label: string;
  trend?: { value: string; positive: boolean };
};

export default function StudioStatCard({ value, label, trend }: StudioStatCardProps) {
  return (
    <div
      className="rounded-lg p-6"
      style={{
        background: "var(--studio-surface)",
        border: "1px solid var(--studio-border)",
      }}
    >
      <div
        className="text-4xl font-bold leading-none mb-2"
        style={{ color: "var(--studio-text-primary)" }}
      >
        {value === "" || value === null || value === undefined ? "—" : value}
      </div>
      <div
        className="text-sm"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        {label}
      </div>
      {trend && (
        <div
          className="flex items-center gap-1 mt-2 text-xs font-medium"
          style={{
            color: trend.positive ? "var(--studio-success)" : "var(--studio-accent)",
          }}
        >
          <span>{trend.positive ? "▲" : "▼"}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
