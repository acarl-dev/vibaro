import { ReactNode } from "react";

type StudioPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function StudioPageHeader({ title, subtitle, action }: StudioPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4">
      <div>
        <h1
          className="text-lg font-bold uppercase tracking-[0.08em]"
          style={{ color: "var(--studio-text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0 mt-0.5">{action}</div>}
    </div>
  );
}
