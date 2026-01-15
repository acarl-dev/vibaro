import { useEffect, useRef } from "react";

/**
 * Custom hook for detecting visible sections using Intersection Observer
 * More robust than click-based section tracking
 * 
 * @param sectionIds - Array of section IDs to observe
 * @param onSectionChange - Callback when active section changes
 * @param options - Intersection Observer options (default: 50% threshold, -20% rootMargin)
 */
export function useActiveSectionObserver(
  sectionIds: string[],
  onSectionChange: (sectionId: string) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsInViewRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Default options: trigger when 50% of section is visible, with negative top margin
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -20% 0px", // Trigger when section is in middle 60% of viewport
      threshold: 0.5, // At least 50% visible
      ...options,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          sectionsInViewRef.current.add(sectionId);
        } else {
          sectionsInViewRef.current.delete(sectionId);
        }
      });

      // Get the first visible section (topmost)
      const visibleSection = sectionIds.find((id) =>
        sectionsInViewRef.current.has(id)
      );

      if (visibleSection) {
        onSectionChange(visibleSection);
      }
    };

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      defaultOptions
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      sectionsInViewRef.current.clear();
    };
  }, [sectionIds, onSectionChange, options]);
}
