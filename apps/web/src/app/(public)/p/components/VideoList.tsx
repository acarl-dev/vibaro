import type { VideoItem } from "./types";
import { EmptyVideosState } from "./EmptyStates";
import LazyVideoEmbed from "./LazyVideoEmbed";

// -----------------------------------------------------------------------------
// VideoList Component
// -----------------------------------------------------------------------------

export function VideoList({ items }: { items: VideoItem[] }) {
  if (items.length === 0) return <EmptyVideosState />;

  return (
    <ul className="grid w-full gap-6 grid-cols-1 md:grid-cols-2">
      {items.map((video, index) => (
        <li key={index}>
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06) inset",
            }}
          >
            <LazyVideoEmbed
              videoId={video.video_id}
              platform={video.platform}
              title={video.title}
              thumbnailUrl={video.thumbnail_url}
            />
            <div style={{ padding: "16px 20px 20px" }}>
              <p
                style={{
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {video.title}
              </p>
              {video.description && (
                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "clamp(11px, 0.9vw, 13px)",
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.01em",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {video.description}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
