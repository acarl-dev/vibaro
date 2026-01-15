"use client";

import { memo } from "react";
import Image from "next/image";
import { containerStyle, bioTextStyle, Z_INDEX_HERO_OVERLAY } from "./constants";

type FullHeroSectionProps = {
  displayName: string;
  heroImageUrl?: string | null;
  bio?: string | null;
  onScrollToSection: (sectionId: string) => void;
};

/**
 * FullHeroSection - Full-bleed hero with overlay text and CTA buttons
 * Used in DarkEditorialFullTemplate for immersive landing experience
+ * Memoized to prevent unnecessary re-renders
 */
export const FullHeroSection = memo(function FullHeroSection({
  displayName,
  heroImageUrl,
  bio,
  onScrollToSection,
}: FullHeroSectionProps) {
  return (
    <section className="relative w-full" aria-label="Hero section">
      {/* Hero Image */}
      <Image
        src={heroImageUrl || "https://placehold.co/1920x1080/1a1a1a/666666?text=Hero+Image"}
        alt={displayName}
        width={1920}
        height={1080}
        className="block w-full h-auto"
        priority
        quality={90}
      />

      {/* Dark gradient overlay - bottom 50% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Text overlay - lower third */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          paddingBottom: "clamp(4rem, 12vh, 6rem)",
          zIndex: Z_INDEX_HERO_OVERLAY,
        }}
      >
        <div className="mx-auto" style={containerStyle()}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
            {displayName}
          </h1>

          {bio && (
            <p
              className="mt-3 text-zinc-200 text-base md:text-lg leading-relaxed"
              style={bioTextStyle()}
            >
              {bio}
            </p>
          )}

          <div className="mt-6 flex gap-3 flex-wrap" role="group" aria-label="Quick navigation">
            <button
              onClick={() => onScrollToSection("shows")}
              className="px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label="Go to tour dates section"
            >
              Tour Dates
            </button>
            <button
              onClick={() => onScrollToSection("music")}
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label="Go to music section"
            >
              Listen Now
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
});
