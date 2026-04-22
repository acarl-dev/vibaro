type StatusType = "live" | "draft" | "ended";

type StudioStatusBadgeProps = {
  status: StatusType;
  label?: string;
};

const STATUS_CONFIG: Record<
  StatusType,
  { dot: string; text: string; bg: string; defaultLabel: string }
> = {
  live: {
    dot: "var(--studio-success)",
    text: "var(--studio-success)",
    bg: "rgba(34, 197, 94, 0.12)",
    defaultLabel: "LIVE",
  },
  draft: {
    dot: "var(--studio-warning)",
    text: "var(--studio-warning)",
    bg: "rgba(245, 158, 11, 0.12)",
    defaultLabel: "ENTWURF",
  },
  ended: {
    dot: "var(--studio-text-secondary)",
    text: "var(--studio-text-secondary)",
    bg: "rgba(136, 136, 160, 0.12)",
    defaultLabel: "BEENDET",
  },
};

export default function StudioStatusBadge({ status, label }: StudioStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
      style={{
        background: config.bg,
        color: config.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.dot }}
      />
      {displayLabel}
    </span>
  );
}
