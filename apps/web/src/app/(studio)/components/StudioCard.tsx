import { ReactNode } from "react";

type StudioCardProps = {
  title?: string;
  children: ReactNode;
  accentBorder?: boolean;
  clickable?: boolean;
  className?: string;
};

export default function StudioCard({
  title,
  children,
  accentBorder = false,
  clickable = false,
  className = "",
}: StudioCardProps) {
  return (
    <div
      className={[
        "rounded-lg p-6 transition-colors duration-150",
        accentBorder ? "border-l-[3px]" : "border",
        clickable ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "var(--studio-surface)",
        border: accentBorder
          ? undefined
          : "1px solid var(--studio-border)",
        borderLeft: accentBorder
          ? "3px solid var(--studio-accent)"
          : undefined,
        ...(accentBorder && {
          borderTop: "1px solid var(--studio-border)",
          borderRight: "1px solid var(--studio-border)",
          borderBottom: "1px solid var(--studio-border)",
        }),
      }}
      onMouseEnter={
        clickable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--studio-accent-muted)";
            }
          : undefined
      }
      onMouseLeave={
        clickable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--studio-border)";
            }
          : undefined
      }
    >
      {title && (
        <h3
          className="text-base font-semibold mb-4"
          style={{ color: "var(--studio-text-primary)" }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
