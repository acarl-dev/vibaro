"use client";

type FeaturedTrack = {
  title: string;
  artist_name: string | null;
  platform: "spotify" | "soundcloud" | "youtube";
  platform_url: string;
  embed_id: string | null;
};

type MusicPlayerProps = {
  tracks: FeaturedTrack[];
};

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30">
          {track.platform === "spotify" && track.embed_id && (
            <iframe
              src={`https://open.spotify.com/embed/track/${track.embed_id}?utm_source=generator&theme=0`}
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
          
          {track.platform === "youtube" && track.embed_id && (
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${track.embed_id}`}
                title={track.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Fallback: Link button if embed fails */}
          {!track.embed_id && (
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
                Play on {track.platform.charAt(0).toUpperCase() + track.platform.slice(1)}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
