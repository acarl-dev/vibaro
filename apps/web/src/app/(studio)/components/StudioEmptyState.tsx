import { ReactNode, ElementType } from "react";

type StudioEmptyStateProps = {
  icon?: ElementType;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function StudioEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: StudioEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div
          className="mb-5 rounded-full p-4"
          style={{
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-secondary)",
          }}
        >
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--studio-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-xs leading-relaxed mb-6"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
