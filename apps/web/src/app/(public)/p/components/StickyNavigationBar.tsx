"use client";

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
 */
export function StickyNavigationBar({
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
    >
      <div className="mx-auto" style={containerStyle("wide")}>
        <div className="flex items-center justify-between h-16">
          <span className="font-semibold text-lg">{displayName}</span>
          <div className="flex gap-6 text-sm">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionClick(section)}
                className={`hover:text-white transition-colors capitalize ${
                  activeSection === section ? "text-white" : "text-zinc-400"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
