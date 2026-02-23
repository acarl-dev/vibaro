"use client";

import { useLazyLoad } from "../hooks/useLazyLoad";

type FeaturedTrack = {
  title: string;
  artist_name: string | null;
  platform:
    | "spotify"
    | "youtubemusic"
    | "soundcloud";
  platform_url: string;
  embed_id: string | null;
};

type MusicPlayerProps = {
  tracks: FeaturedTrack[];
};

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [ref, isVisible] = useLazyLoad<HTMLDivElement>();
  const platformLabels: Record<FeaturedTrack["platform"], string> = {
    spotify: "Spotify",
    youtubemusic: "YouTube Music",
    soundcloud: "SoundCloud",
  };

  const getEmbedId = (track: FeaturedTrack) => {
    if (track.embed_id) return track.embed_id;

    if (track.platform === "spotify") {
      const match = track.platform_url.match(
        /spotify\.com\/(?:intl-[a-z]{2}(?:-[A-Z]{2})?|[a-z]{2}(?:-[A-Z]{2})?)?\/(?:embed\/)?track\/([a-zA-Z0-9]+)/
      );
      return match?.[1] ?? null;
    }

    if (track.platform === "youtubemusic") {
      const match = track.platform_url.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
      return match?.[1] ?? null;
    }

    return null;
  };

  const getSpotifyEmbedSrc = (track: FeaturedTrack) => {
    const embedId = getEmbedId(track);
    if (embedId) {
      return `https://open.spotify.com/embed/track/${embedId}?utm_source=generator&theme=0`;
    }

    return `https://open.spotify.com/embed?url=${encodeURIComponent(
      track.platform_url
    )}`;
  };

  if (!tracks || tracks.length === 0) return null;

  return (
    <div ref={ref} className="space-y-5">
      {isVisible ? (
        tracks.map((track, index) => (
          <div
            key={index}
            className="overflow-hidden"
            style={{
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.40)",
            }}
          >
            {track.platform === "spotify" && (
              <iframe
                src={getSpotifyEmbedSrc(track)}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={track.title}
                className="w-full"
              />
            )}
            
            {track.platform === "soundcloud" && track.platform_url && (
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.platform_url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                title={track.title}
                className="w-full"
              />
            )}
            
            {track.platform === "youtubemusic" && getEmbedId(track) && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getEmbedId(track)}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={track.title}
                className="w-full"
              />
            )}
            
            {/* Fallback: Link button if embed fails */}
            {!getEmbedId(track) && track.platform !== "spotify" && (
              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "clamp(14px, 1.2vw, 16px)",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {track.title}
                </h3>
                {track.artist_name && (
                  <p
                    style={{
                      fontSize: "clamp(11px, 0.9vw, 13px)",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "6px",
                    }}
                  >
                    {track.artist_name}
                  </p>
                )}
                <a
                  href={track.platform_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors"
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.80)",
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Play on {platformLabels[track.platform]}
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        // Placeholder skeleton while loading
        <div className="space-y-5">
          {tracks.map((_, index) => (
            <div
              key={index}
              className="h-[152px] overflow-hidden animate-pulse"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
