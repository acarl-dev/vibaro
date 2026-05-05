import { ReactNode } from "react";

type StudioNoticeType = "info" | "warning" | "error";

type StudioNoticeProps = {
  children: ReactNode;
  type?: StudioNoticeType;
  className?: string;
};

const TYPE_STYLE: Record<StudioNoticeType, { background: string; border: string; color: string }> = {
  info: {
    background: "var(--studio-surface)",
    border: "1px solid var(--studio-border)",
    color: "var(--studio-text-secondary)",
  },
  warning: {
    background: "rgba(245, 158, 11, 0.05)",
    border: "1px solid rgba(245, 158, 11, 0.25)",
    color: "var(--studio-warning)",
  },
  error: {
    background: "var(--studio-accent-muted)",
    border: "1px solid rgba(230, 57, 70, 0.25)",
    color: "var(--studio-accent)",
  },
};

export default function StudioNotice({
  children,
  type = "info",
  className = "",
}: StudioNoticeProps) {
  return (
    <div
      className={`rounded-lg px-4 py-3 text-xs leading-relaxed ${className}`}
      style={TYPE_STYLE[type]}
    >
      {children}
    </div>
  );
}
