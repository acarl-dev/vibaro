/**
 * Next.js instrumentation hook.
 *
 * Patches `performance.measure` in development to suppress the
 * "cannot have a negative time stamp" DOMException thrown by
 * Next.js's internal Server-Component profiler (clock-skew in WSL / Docker).
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export function register() {
  if (process.env.NODE_ENV !== "development") return;

  if (typeof performance !== "undefined" && typeof performance.measure === "function") {
    const originalMeasure = performance.measure.bind(performance);

    performance.measure = (...args: Parameters<Performance["measure"]>) => {
      try {
        return originalMeasure(...args);
      } catch (err) {
        // Swallow the "negative time stamp" DOMException from Next.js profiling
        if (err instanceof Error && err.message.includes("negative time stamp")) {
          return undefined as unknown as PerformanceMeasure;
        }
        throw err;
      }
    };
  }
}
