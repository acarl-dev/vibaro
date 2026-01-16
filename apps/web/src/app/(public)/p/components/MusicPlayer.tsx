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
    <div ref={ref} className="space-y-4">
      {isVisible ? (
        tracks.map((track, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30">
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
              <div className="p-4">
                <h3 className="text-sm font-medium text-zinc-100">{track.title}</h3>
                {track.artist_name && (
                  <p className="text-xs text-zinc-400 mt-1">{track.artist_name}</p>
                )}
                <a
                  href={track.platform_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="space-y-4">
          {tracks.map((_, index) => (
            <div
              key={index}
              className="h-[152px] overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30 animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}
