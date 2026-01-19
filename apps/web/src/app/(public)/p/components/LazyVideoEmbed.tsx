"use client";

import { useState } from "react";

type LazyVideoEmbedProps = {
  videoId: string;
  platform: "youtube" | "vimeo";
  title: string;
  thumbnailUrl?: string | null;
};

/**
 * LazyVideoEmbed - Loads video iframe only on click
 * 
 * Benefits:
 * - Better performance (no iframe until interaction)
 * - Cleaner look (no YouTube branding initially)
 * - Custom poster with play overlay
 */
export default function LazyVideoEmbed({
  videoId,
  platform,
  title,
  thumbnailUrl,
}: LazyVideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Get embed URL
  const getEmbedSrc = (): string | null => {
    if (!videoId) return null;

    if (platform === "youtube") {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }

    if (platform === "vimeo") {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    return null;
  };

  // Get thumbnail URL
  const getThumbnailUrl = (): string => {
    if (thumbnailUrl) return thumbnailUrl;

    if (platform === "youtube") {
      // Use high quality YouTube thumbnail
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    if (platform === "vimeo") {
      // Vimeo requires API call for thumbnails, use placeholder
      return `https://vumbnail.com/${videoId}.jpg`;
    }

    return "";
  };

  const embedSrc = getEmbedSrc();

  if (!embedSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center bg-zinc-900">
        <div>
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          <p className="mt-2 text-xs text-zinc-500">Video kann nicht eingebettet werden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
      {!isLoaded ? (
        // Thumbnail with Play Overlay
        <button
          onClick={() => setIsLoaded(true)}
          className="relative w-full h-full group cursor-pointer"
          aria-label={`Play ${title}`}
        >
          {/* Thumbnail Image */}
          <img
            src={getThumbnailUrl()}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-300" />
              
              {/* Main button */}
              <div className="relative w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex items-center justify-center shadow-2xl">
                <svg
                  className="w-7 h-7 text-zinc-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Platform Badge */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white uppercase tracking-wider border border-white/10">
            {platform}
          </div>
        </button>
      ) : (
        // YouTube/Vimeo iFrame (loaded on click)
        <iframe
          src={embedSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute left-0 top-0 h-full w-full"
        />
      )}
    </div>
  );
}
