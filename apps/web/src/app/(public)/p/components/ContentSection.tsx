import { ReactNode, memo } from "react";
import { containerStyle, SECTION_PADDING_Y_LARGE, BORDER_DARK } from "./constants";

type ContentSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  containerWidth?: "standard" | "wide" | "narrow";
  noBorder?: boolean;
};

/**
 * ContentSection - Standardized content section wrapper
 * Provides consistent spacing, borders, and container widths
+ * Memoized to prevent unnecessary re-renders
 */
export const ContentSection = memo(function ContentSection({
  id,
  title,
  children,
  containerWidth = "standard",
  noBorder = false,
}: ContentSectionProps) {
  return (
    <section
      id={id}
      className={`${SECTION_PADDING_Y_LARGE} ${noBorder ? "" : `border-b ${BORDER_DARK}`}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto" style={containerStyle(containerWidth)}>
        <h2 id={`${id}-heading`} className="text-3xl font-bold mb-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
});
