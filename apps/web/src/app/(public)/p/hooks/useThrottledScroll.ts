import { useEffect, useRef } from "react";

/**
 * Custom hook for throttled scroll event handling
 * Optimizes performance by limiting scroll handler invocations
 * 
 * @param callback - Function to call on scroll (receives current scrollY)
 * @param delay - Throttle delay in milliseconds (default: 100ms)
 */
export function useThrottledScroll(
  callback: (scrollY: number) => void,
  delay: number = 100
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If enough time has passed, execute immediately
      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(window.scrollY);
      } else {
        // Otherwise, schedule for later
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(window.scrollY);
        }, delay - timeSinceLastCall);
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
}
