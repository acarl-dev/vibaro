"use client";

import { useMemo } from "react";
import {
  PublicArtistPageData,
  LinkList,
  ReleaseItem,
  VideoItem,
  ShowItem,
  ContactInquiryButton,
  getUpcomingShows,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import { PreviewBanner } from "./PreviewBanner";
import LazyVideoEmbed from "./LazyVideoEmbed";
import PhaseHero from "@/components/public-page/PhaseHero";

/**
 * StageTemplate - Energy-focused template for live-oriented bands
 *
 * Design Principles:
 * - High contrast (#0b0b0b background)
 * - Full-bleed hero (80-90vh)
 * - Shows as highest priority (directly after hero)
 * - Videos prominent, wide format
 * - Reduced whitespace, dense layout
 * - Minimal text, maximum presence
 *
 * Target audience: Rock, Metal, Punk, Hardcore, Alternative
 *
 * Structure:
 * 1. Hero (Full-bleed, dramatic)
 * 2. Shows (Highest priority - list format)
 * 3. Videos (Wide, prominent)
 * 4. Releases (Optional, reduced)
 * 5. About (Optional, 2-4 lines max)
 * 6. Footer (Minimal)
 */
export default function StageTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  // Filter to only upcoming shows
  const upcomingShows = useMemo(() => getUpcomingShows(page.shows || []), [page.shows]);

  // Check what content is available
  const hasShows = upcomingShows.length > 0;
  const hasVideos = (page.videos?.length ?? 0) > 0;
  const hasReleases = (page.releases?.length ?? 0) > 0;
  const hasFeaturedTracks = (page.featured_tracks?.length ?? 0) > 0;
  const hasLinks = (page.links?.length ?? 0) > 0;
  const hasContact = !!(
    page.booking_email ||
    page.management_email ||
    page.press_email ||
    page.whatsapp_number
  );

  return (
    <>
      <PreviewBanner isPublished={page.is_published} />
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "#0b0b0b",
          color: "#ffffff",
          ...(page.is_published === false ? { marginTop: "52px" } : {}),
        }}
      >
        {/* Hero - Full-bleed dramatic */}
        <StageHero page={page} hasShows={hasShows} />

        {/* Main Content */}
        <main
          className="mx-auto pb-16"
          style={{
            maxWidth: "1000px",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          {/* Phase Hero — dominant spotlight section */}
          {page.active_spotlight && (
            <section style={{ marginLeft: "calc(-1 * clamp(16px, 4vw, 32px))", marginRight: "calc(-1 * clamp(16px, 4vw, 32px))" }}>
              <PhaseHero spotlight={page.active_spotlight} />
            </section>
          )}

          {/* Shows - Highest Priority, directly after hero */}
          {hasShows && (
            <section id="shows" style={{ paddingTop: "40px", paddingBottom: "48px" }}>
              <StageSectionHeader title="Shows" />
              <StageShowList items={upcomingShows} />
            </section>
          )}

          {/* Videos - Very high priority */}
          {hasVideos && (
            <section style={{ paddingTop: "32px", paddingBottom: "40px" }}>
              <StageSectionHeader title="Videos" />
              <StageVideoList items={page.videos!} />
            </section>
          )}

          {/* Music Player */}
          {hasFeaturedTracks && (
            <section style={{ paddingTop: "32px", paddingBottom: "40px" }}>
              <StageSectionHeader title="Music" />
              <MusicPlayer tracks={page.featured_tracks} />
            </section>
          )}

          {/* Releases - Optional, reduced */}
          {hasReleases && (
            <section style={{ paddingTop: "32px", paddingBottom: "40px" }}>
              <StageSectionHeader title="Releases" />
              <StageReleaseList items={page.releases} />
            </section>
          )}

          {/* Links - Compact */}
          {hasLinks && (
            <section style={{ paddingTop: "32px", paddingBottom: "32px" }}>
              <LinkList items={page.links} />
            </section>
          )}

          {/* Contact - Minimal */}
          {hasContact && (
            <section
              style={{ paddingTop: "48px", paddingBottom: "32px" }}
              className="flex justify-center"
            >
              <ContactInquiryButton
                booking_email={page.booking_email}
                management_email={page.management_email}
                press_email={page.press_email}
                whatsapp_number={page.whatsapp_number}
                contact_message={page.contact_message}
              />
            </section>
          )}
        </main>

        {/* Footer - Minimal */}
        <StageFooter displayName={page.display_name || "Artist"} />
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Stage Hero - Full-bleed, dramatic
// -----------------------------------------------------------------------------

function StageHero({
  page,
  hasShows,
}: {
  page: PublicArtistPageData;
  hasShows: boolean;
}) {
  const hasHeroImage = !!page.images.hero_image_url;
  const focalX = page.images.hero_focal_x ?? 50;
  const focalY = page.images.hero_focal_y ?? 35;

  const handleScrollToShows = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const showsSection = document.getElementById("shows");
    if (showsSection) {
      showsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!hasHeroImage) {
    return (
      <header
        style={{
          backgroundColor: "#050507",
        }}
      >
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{
            minHeight: "clamp(400px, 60vh, 700px)",
            padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 32px)",
            background: "linear-gradient(to bottom, #111111, #0b0b0b)",
          }}
        >
          {page.images.avatar_url && (
            <div
              className="overflow-hidden rounded-full mb-8"
              style={{
                width: "clamp(120px, 20vw, 180px)",
                height: "clamp(120px, 20vw, 180px)",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={page.images.avatar_url}
                alt={page.display_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: "clamp(36px, 8vw, 64px)",
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            {page.display_name}
          </h1>
          {page.bio && (
            <p
              className="mt-4 line-clamp-2"
              style={{
                fontSize: "clamp(14px, 2vw, 18px)",
                color: "rgba(255,255,255,0.65)",
                maxWidth: "500px",
              }}
            >
              {page.bio}
            </p>
          )}
          {hasShows && (
            <a
              href="#shows"
              onClick={handleScrollToShows}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 font-semibold text-sm uppercase tracking-wider border-2 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#ffffff", borderRadius: "4px" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            >
              Shows ansehen
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          )}
        </div>
      </header>
    );
  }

  return (
    <header
      className="relative"
      style={{ backgroundColor: "#050507", padding: "32px 0 48px" }}
    >
      {/* Bleed Light – atmospheric glow behind the frame, generated in CSS.
          The header has NO overflow-hidden so the blur can spill past the edges.
          The Frame below has its own overflow-hidden to contain the image. */}
      <div className="stage-hero-bleed" aria-hidden="true" />

      {/* Frame Container */}
      <div
        className="relative mx-auto"
        style={{ maxWidth: "1440px", padding: "0 20px", zIndex: 2 }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            height: "clamp(560px, 70vh, 900px)",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          }}
        >
          {/* Hero Image with focal point */}
          <img
            src={page.images.hero_image_url!}
            alt={page.display_name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: `${focalX}% ${focalY}%`,
              transform: "scale(1.03)",
              transformOrigin: "center center",
            }}
          />

          {/* Overlay: Vignette + Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(1200px 700px at 60% 20%, rgba(0,0,0,0.20), transparent 60%), " +
                "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.50) 100%)",
            }}
          />

          {/* Content – poster style at bottom */}
          <div
            className="absolute z-10 text-white"
            style={{
              left: "clamp(18px, 4vw, 56px)",
              right: "clamp(18px, 4vw, 56px)",
              bottom: "clamp(20px, 5vw, 56px)",
            }}
          >
            <h1
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(44px, 6vw, 86px)",
                lineHeight: 0.95,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {page.display_name}
            </h1>

            {page.bio && (
              <p
                style={{
                  marginBottom: "22px",
                  maxWidth: "52ch",
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                {page.bio}
              </p>
            )}

            {hasShows && (
              <a
                href="#shows"
                onClick={handleScrollToShows}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: "var(--stage-accent, #ffffff)",
                  color: "#050507",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Shows ansehen
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// -----------------------------------------------------------------------------
// Stage Section Header - Minimal, uppercase
// -----------------------------------------------------------------------------

function StageSectionHeader({ title }: { title: string }) {
  return (
    <h2
      className="font-semibold uppercase tracking-widest mb-6"
      style={{
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.15em",
      }}
    >
      {title}
    </h2>
  );
}

// -----------------------------------------------------------------------------
// Stage Show List - Full-width, high contrast, list format
// -----------------------------------------------------------------------------

function StageShowList({ items }: { items: ShowItem[] }) {
  return (
    <ul className="divide-y" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      {items.map((show, index) => (
        <li
          key={index}
          className="group py-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {/* Date - Dominant */}
          <div
            className="shrink-0 font-bold"
            style={{
              fontSize: "18px",
              minWidth: "90px",
              color: "var(--stage-accent, #ffffff)",
            }}
          >
            {formatShowDate(show.date)}
          </div>

          {/* Venue & City */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold truncate"
              style={{ fontSize: "16px", color: "#ffffff" }}
            >
              {show.venue}
            </p>
            <p
              className="text-sm truncate"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {show.city}
              {show.time && ` · ${show.time}`}
            </p>
          </div>

          {/* Status / CTA */}
          <div className="shrink-0">
            {show.url ? (
              <a
                href={show.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: "var(--stage-accent, #ffffff)",
                  color: "#0b0b0b",
                  borderRadius: "3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {show.is_free ? "Eintritt frei" : "Tickets"}
              </a>
            ) : show.is_free ? (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--stage-accent, #ffffff)",
                  color: "#0b0b0b",
                  borderRadius: "3px",
                  opacity: 0.85,
                }}
              >
                Eintritt frei
              </span>
            ) : show.price ? (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.9)",
                  borderRadius: "3px",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Abendkasse</span>
                {show.price}€
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  borderRadius: "3px",
                }}
              >
                TBA
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------
// Stage Video List - Wide, prominent
// -----------------------------------------------------------------------------

function StageVideoList({ items }: { items: VideoItem[] }) {
  // Show max 2 videos prominently
  const prominentVideos = items.slice(0, 2);

  return (
    <div className="space-y-6">
      {prominentVideos.map((video, index) => (
        <div
          key={index}
          className="w-full overflow-hidden"
          style={{
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <LazyVideoEmbed
            videoId={video.video_id}
            platform={video.platform}
            title={video.title}
            thumbnailUrl={video.thumbnail_url}
          />
          <div
            className="px-4 py-3"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="font-medium truncate"
              style={{ fontSize: "14px", color: "#ffffff" }}
            >
              {video.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Stage Release List - Reduced, minimal metadata
// -----------------------------------------------------------------------------

function StageReleaseList({ items }: { items: ReleaseItem[] }) {
  // Show max 4 releases
  const releases = items.slice(0, 4);

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {releases.map((release, index) => (
        <li key={index}>
          <a
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {/* Cover */}
            <div
              className="relative aspect-square overflow-hidden mb-3"
              style={{
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {release.cover_url ? (
                <img
                  src={release.cover_url}
                  alt={release.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: "#111111" }}
                >
                  <span style={{ fontSize: "32px", color: "rgba(255,255,255,0.2)" }}>
                    ♪
                  </span>
                </div>
              )}
            </div>

            {/* Title only - minimal */}
            <p
              className="font-medium truncate group-hover:text-white transition-colors"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}
            >
              {release.title}
            </p>
            {release.release_date && (
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {new Date(release.release_date).getFullYear()}
              </p>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------
// Stage Spotlight Banner removed – replaced by shared ProjectHeroBanner (Phase 6)

// -----------------------------------------------------------------------------
// Stage Footer - Minimal, functional
// -----------------------------------------------------------------------------

function StageFooter({ displayName }: { displayName: string }) {
  return (
    <footer
      className="py-8 px-6"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#0b0b0b",
      }}
    >
      <div className="mx-auto max-w-xl flex flex-col items-center gap-2 text-center">
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
          © {displayName}
        </p>
        <p
          style={{
            fontSize: "9px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Vibaro
        </p>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatShowDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
    }).toUpperCase();
  } catch {
    return dateString;
  }
}
