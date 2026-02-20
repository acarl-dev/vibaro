import { ReactNode } from "react";

type StudioPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function StudioPageHeader({ title, subtitle, action }: StudioPageHeaderProps) {
  return (
    <div
      className="flex items-center justify-between mb-6 pb-4"
      style={{ borderBottom: "1px solid var(--studio-border)" }}
    >
      <div>
        <h1
          className="text-xl font-bold uppercase tracking-[0.05em]"
          style={{ color: "var(--studio-text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
