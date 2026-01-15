import { useMemo } from "react";
import {
  PublicArtistPageData,
  Hero,
  LinkList,
  ShowList,
  ReleaseList,
  OptionalSections,
  Footer,
  ReleaseItem,
  SectionHeader,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import { containerStyleNarrow, SECTION_PADDING_Y_MODERN } from "./constants";

/**
 * ModernTemplate - Comprehensive responsive artist page template
 * 
 * Features:
 * - Full-bleed hero with adaptive overlay
 * - Dynamic content sections based on available data
 * - Prominent "New Release" display for featured releases
 * - Music player for featured tracks
 * - Videos gallery with YouTube/Vimeo support
 * - Photo gallery grid
 * - Contact information display
 * - Fully responsive design with Tailwind CSS
 * - Follows Vibaro design principles: clean, calm, artist-focused
 */
export default function ModernTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  // Find featured release (if any)
  const featuredRelease = useMemo(
    () => page.releases?.find((r) => r?.is_featured) || page.releases?.[0],
    [page.releases]
  );
  
  // Check what content is available
  const hasLinks = (page.links?.length ?? 0) > 0;
  const hasShows = (page.shows?.length ?? 0) > 0;
  const hasReleases = (page.releases?.length ?? 0) > 0;
  const hasFeaturedTracks = (page.featured_tracks?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-page text-primary">
      {/* Hero Section */}
      <Hero page={page} />

      {/* Main Content Container - tighter max-width for better readability */}
      <main 
        className="mx-auto pb-8"
        style={containerStyleNarrow()}
      >

        {/* Links Section */}
        {hasLinks && (
          <section className={`${SECTION_PADDING_Y_MODERN} border-b border-default`}>
            <SectionHeader title="Links" variant="medium" />
            <LinkList items={page.links} />
          </section>
        )}

        {/* Featured Release Banner (if exists) */}
        {featuredRelease && <FeaturedReleaseHero release={featuredRelease} />}

        {/* Music Player Section */}
        {hasFeaturedTracks && (
          <section className={`${SECTION_PADDING_Y_MODERN} border-b border-default`}>
            <SectionHeader title="Music" variant="medium" />
            <MusicPlayer tracks={page.featured_tracks} />
          </section>
        )}

        {/* Shows Section */}
        {hasShows && (
          <section className={`${SECTION_PADDING_Y_MODERN} border-b border-default`}>
            <SectionHeader title="Shows" variant="medium" />
            <ShowList items={page.shows} />
          </section>
        )}

        {/* Releases/Discography Section */}
        {hasReleases && (
          <section className={`${SECTION_PADDING_Y_MODERN} border-b border-default`}>
            <SectionHeader title="Releases" variant="medium" />
            <ReleaseList items={page.releases} />
          </section>
        )}

        {/* Videos, Gallery, Contact Sections */}
        <OptionalSections page={page} />
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name || "Artist"} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Featured Release Hero Component (Compact, Mobile-First)
// -----------------------------------------------------------------------------

function FeaturedReleaseHero({ release }: { release: ReleaseItem }) {
  return (
    <section className="py-10 md:py-14 border-b border-default">
      <div className="rounded-2xl border border-default bg-surface p-5 sm:p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-surface-hover text-secondary rounded-full mb-6">
          New Release
        </span>

        <a
          href={release.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row gap-5 sm:gap-7 items-start"
        >
          {/* Cover Image - bigger & more dominant */}
          <div className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 overflow-hidden rounded-2xl shadow-xl border border-default">
            {release.cover_url ? (
              <img
                src={release.cover_url}
                alt={release.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center">
                <span className="text-5xl text-muted">♪</span>
              </div>
            )}
          </div>

          {/* Release Info */}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
              {release.title}
            </h3>

            {release.release_date && (
              <p className="mt-2 text-sm md:text-base text-muted">
                {formatReleaseDate(release.release_date)}
              </p>
            )}

            {release.url && (
              <span className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-accent text-accent-contrast font-semibold text-sm rounded-full transition-colors">
                Listen Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            )}
          </div>
        </a>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatReleaseDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
