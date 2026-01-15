"use client";

import { memo } from "react";
import { containerStyle, Z_INDEX_STICKY_NAV, TRANSITION_DURATION_DEFAULT } from "./constants";

type StickyNavigationBarProps = {
  displayName: string;
  sections: string[];
  activeSection: string;
  isVisible: boolean;
  onSectionClick: (sectionId: string) => void;
};

/**
 * StickyNavigationBar - Sticky navigation that appears on scroll
 * Used in DarkEditorialFullTemplate for in-page navigation
 * Mobile-optimized with larger touch targets and horizontal scroll
+ * Memoized to prevent unnecessary re-renders
 */
export const StickyNavigationBar = memo(function StickyNavigationBar({
  displayName,
  sections,
  activeSection,
  isVisible,
  onSectionClick,
}: StickyNavigationBarProps) {
  return (
    <nav
      className={`sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 transition-transform ${TRANSITION_DURATION_DEFAULT} ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ zIndex: Z_INDEX_STICKY_NAV }}
      role="navigation"
      aria-label="Page sections"
    >
      <div className="mx-auto" style={containerStyle("wide")}>
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          <span className="font-semibold text-lg">{displayName}</span>
          <div className="flex gap-6 text-sm">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionClick(section)}
                className={`hover:text-white transition-colors capitalize ${
                  activeSection === section ? "text-white" : "text-zinc-400"
                }`}
                aria-label={`Go to ${section} section`}
                aria-current={activeSection === section ? "true" : undefined}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile layout - horizontal scroll with larger touch targets */}
        <div className="md:hidden">
          <div className="px-4 py-3 border-b border-zinc-900">
            <span className="font-semibold text-base">{displayName}</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 px-4 py-2 min-w-max">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => onSectionClick(section)}
                  className={`px-4 py-2 text-sm capitalize rounded-lg transition-colors whitespace-nowrap min-h-[44px] min-w-[44px] ${
                    activeSection === section
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                  aria-label={`Go to ${section} section`}
                  aria-current={activeSection === section ? "true" : undefined}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
