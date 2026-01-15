import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for lazy loading components when they become visible
 * Uses Intersection Observer to detect when element enters viewport
 * 
 * @param options - Intersection Observer options (default: 50px rootMargin)
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Default options: start loading slightly before element enters viewport
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "50px", // Start loading 50px before visible
      threshold: 0,
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing (one-time lazy load)
          observer.disconnect();
        }
      });
    }, defaultOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isVisible];
}
