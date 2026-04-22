import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  /** Optional element rendered right-aligned in the header (e.g. a "+ Add" button). */
  action?: ReactNode;
  children: ReactNode;
};

/**
 * Shared wrapper for every studio sub-tab page.
 * Provides a consistent page header (title + description + optional action).
 * Width is controlled by the parent layout container (maxWidth 1200px).
 */
export default function StudioTabPage({
  title,
  description,
  action,
  children,
}: Props) {
  return (
    <div className="w-full">
      {/* ── Page header ── */}
      <div
        className="mb-8 flex items-start justify-between gap-6 pb-4"
        style={{ borderBottom: "1px solid var(--studio-border)" }}
      >
        <div>
          <h1
            className="text-[13px] font-bold uppercase tracking-widest"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: "var(--studio-text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* ── Page content ── */}
      {children}
    </div>
  );
}
