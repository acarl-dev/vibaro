import { useMemo } from "react";
import {
  PublicArtistPageData,
  Hero,
  LinkList,
  ShowList,
  ReleaseList,
  VideoList,
  GalleryGrid,
  ContactInquiryButton,
  Footer,
  ReleaseItem,
  SectionHeader,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import { PreviewBanner } from "./PreviewBanner";
import ProjectHeroBanner from "@/components/public-page/ProjectHeroBanner";

/**
 * ModernTemplate - Block-based artist page with hierarchical structure
 * 
 * Structure:
 * - Block 1 - Identität (Hero + Links)
 * - Block 2 - Aktuelles (Featured Release or newest Music)
 * - Block 3 - Inhalt (Music, Shows, Releases, Videos - equal weight)
 * - Block 4 - Visuelles (Gallery)
 * - Block 5 - Kontakt (Contact)
 * 
 * Design principles:
 * - Block spacing creates rhythm (large between blocks, smaller within)
 * - Content width: 940px (sweet spot for readability + image impact)
 * - Typographic hierarchy: block titles larger, section titles smaller
 * - Editorial feel, not SaaS
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

  // Filter to only upcoming shows
  const upcomingShows = useMemo(() => {
    const now = new Date();
    return (page.shows || []).filter(show => {
      const showDate = new Date(show.date);
      return showDate >= now;
    });
  }, [page.shows]);
  
  // Check what content is available
  const hasLinks = (page.links?.length ?? 0) > 0;
  const hasShows = (upcomingShows?.length ?? 0) > 0;
  const hasReleases = (page.releases?.length ?? 0) > 0;
  const hasFeaturedTracks = (page.featured_tracks?.length ?? 0) > 0;
  const hasVideos = (page.videos?.length ?? 0) > 0;
  const hasGallery = (page.gallery_images?.length ?? 0) > 0;
  const hasContact = !!(page.booking_email || page.management_email || page.press_email || page.whatsapp_number);

  return (
    <>
      <PreviewBanner isPublished={page.is_published} />
      <div className="min-h-screen bg-page text-primary" style={page.is_published === false ? { marginTop: '52px' } : undefined}>
        {/* Block 1 - Identität: Hero + Links */}
        <Hero page={page} />

        {/* Main Content - 940px max-width, generous padding */}
        <main 
          className="mx-auto pb-20"
          style={{
            maxWidth: '940px',
            padding: '0 clamp(20px, 5vw, 40px)',
          }}
        >
          {/* Active Project Hero Banner */}
          {page.active_spotlight && (
            <div className="pt-12 pb-6">
              <ProjectHeroBanner
                title={page.active_spotlight.title}
                type={page.active_spotlight.type}
                primaryUrl={page.active_spotlight.primary_url}
              />
            </div>
          )}

          {/* Links directly under hero - part of identity block */}
          {hasLinks && (
            <section className="pb-16" style={{ paddingTop: "clamp(32px, 4vw, 56px)" }}>
              <LinkList items={page.links} />
            </section>
          )}

          {/* Block 2 - Aktuelles: Featured Release OR newest Music */}
          {featuredRelease && (
            <div className="py-16">
              <FeaturedReleaseHero release={featuredRelease} />
            </div>
          )}

          {/* Block 3 - Inhalt: gleichwertige Content-Sektionen */}
          <div className="py-12 space-y-20">
            {/* Music Player Section */}
            {hasFeaturedTracks && (
              <section>
                <SectionHeader title="Music" variant="medium" />
                <MusicPlayer tracks={page.featured_tracks} />
              </section>
            )}

            {/* Shows Section */}
            {hasShows && (
              <section>
                <SectionHeader title="Shows" variant="medium" />
                <ShowList items={upcomingShows} />
              </section>
            )}

            {/* Releases/Discography Section */}
            {hasReleases && (
              <section>
                <SectionHeader title="Releases" variant="medium" />
                <ReleaseList items={page.releases} />
              </section>
            )}

            {/* Videos Section */}
            {hasVideos && (
              <section>
                <SectionHeader title="Videos" variant="medium" />
                <VideoList items={page.videos!} />
              </section>
            )}
          </div>

          {/* Block 4 - Visuelles: Gallery (later in page flow) */}
          {hasGallery && (
            <section className="pt-20 pb-16">
              <SectionHeader title="Gallery" variant="medium" />
              <GalleryGrid items={page.gallery_images!} />
            </section>
          )}

          {/* Block 5 - Kontakt: clear endpoint */}
          {hasContact && (
            <section className="pt-20 pb-12">
              <SectionHeader title="Contact" variant="medium" />
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

        {/* Footer */}
        <Footer displayName={page.display_name || "Artist"} />
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Featured Release Component
// -----------------------------------------------------------------------------

function FeaturedReleaseHero({ release }: { release: ReleaseItem }) {
  return (
    <div className="rounded-2xl border border-default bg-surface p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-surface-hover text-secondary rounded-full mb-6">
        New Release
      </span>

      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
      >
        {/* Cover Image */}
        <div className="relative shrink-0 w-44 h-44 sm:w-56 sm:h-56 overflow-hidden rounded-2xl shadow-xl border border-default">
          {release.cover_url ? (
            <img
              src={release.cover_url}
              alt={release.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full bg-surface flex items-center justify-center">
              <span className="text-6xl text-muted">♪</span>
            </div>
          )}
        </div>

        {/* Release Info */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-3xl sm:text-4xl font-bold text-primary leading-tight">
            {release.title}
          </h3>

          {release.release_date && (
            <p className="mt-3 text-base text-muted">
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
