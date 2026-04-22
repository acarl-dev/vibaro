type StudioStatCardProps = {
  value: string | number;
  label: string;
  trend?: { value: string; positive: boolean };
};

export default function StudioStatCard({ value, label, trend }: StudioStatCardProps) {
  return (
    <div
      className="rounded-lg"
      style={{
        background: "var(--studio-surface)",
        border: "1px solid var(--studio-border)",
        padding: "18px 20px",
      }}
    >
      <div
        className="text-3xl font-bold leading-none"
        style={{ color: "var(--studio-text-primary)", marginBottom: "5px" }}
      >
        {value === "" || value === null || value === undefined ? "—" : value}
      </div>
      <div
        className="text-sm"
        style={{ color: "var(--studio-text-secondary)", opacity: 0.75 }}
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
