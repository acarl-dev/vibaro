import type { ReleaseItem } from "./types";
import { EmptyReleasesState } from "./EmptyStates";

// -----------------------------------------------------------------------------
// ReleaseList Component
// -----------------------------------------------------------------------------

export function ReleaseList({ items }: { items: ReleaseItem[] }) {
  if (items.length === 0) return <EmptyReleasesState />;

  return (
    <ul className="grid gap-6 grid-cols-2 lg:grid-cols-3">
      {items.map((release, index) => (
        <li key={index}>
          <a
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full flex flex-col"
          >
            {/* Cover */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06) inset",
              }}
            >
              <div className="relative w-full pb-[100%]">
                {release.cover_url ? (
                  <img
                    src={release.cover_url}
                    alt={release.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span style={{ fontSize: "3rem", color: "rgba(255,255,255,0.15)" }}>♪</span>
                  </div>
                )}
              </div>
              {release.release_type && (
                <div
                  className="absolute top-2 left-2"
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "rgba(0,0,0,0.70)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.60)",
                  }}
                >
                  {release.release_type}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0" style={{ paddingTop: "12px" }}>
              <p
                className="truncate"
                style={{
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                {release.title}
              </p>
              {release.release_date && (
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "clamp(11px, 0.9vw, 13px)",
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {release.release_date}
                </p>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
