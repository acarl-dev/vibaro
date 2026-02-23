import { useMemo } from "react";
import {
  PublicArtistPageData,
  Hero,
  LinkList,
  ShowList,
  ReleaseList,
  VideoList,
  ContactInquiryButton,
  Footer,
  ReleaseItem,
  SectionHeader,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import GallerySlider from "./GallerySlider";
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
  const hasContact = !!(page.contacts?.length);

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
            <div className="py-16 flex justify-center">
              <div style={{ maxWidth: "860px", width: "100%" }}>
                <FeaturedReleaseHero release={featuredRelease} />
              </div>
            </div>
          )}

          {/* Block 3 - Inhalt: gleichwertige Content-Sektionen */}
          <div className="py-12 space-y-20">
            {/* Music Player Section */}
            {hasFeaturedTracks && (
              <section className="flex justify-center">
                <div style={{ maxWidth: "860px", width: "100%" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      color: "#fff",
                      marginBottom: "32px",
                      textAlign: "center",
                    }}
                  >
                    Music
                  </p>
                  <MusicPlayer tracks={page.featured_tracks} />
                </div>
              </section>
            )}

            {/* Shows Section */}
            {hasShows && (
              <section className="flex justify-center">
                <div style={{ maxWidth: "860px", width: "100%" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      color: "#fff",
                      marginBottom: "32px",
                      textAlign: "center",
                    }}
                  >
                    Shows
                  </p>
                  <ShowList items={upcomingShows} />
                </div>
              </section>
            )}

            {/* Releases/Discography Section */}
            {hasReleases && (
              <section className="flex justify-center">
                <div style={{ maxWidth: "860px", width: "100%" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      color: "#fff",
                      marginBottom: "32px",
                      textAlign: "center",
                    }}
                  >
                    Releases
                  </p>
                  <ReleaseList items={page.releases} />
                </div>
              </section>
            )}

            {/* Videos Section */}
            {hasVideos && (
              <section className="flex justify-center">
                <div style={{ maxWidth: "860px", width: "100%" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      color: "#fff",
                      marginBottom: "32px",
                      textAlign: "center",
                    }}
                  >
                    Videos
                  </p>
                  <VideoList items={page.videos!} />
                </div>
              </section>
            )}
          </div>

          {/* Block 4 - Visuelles: Gallery (later in page flow) */}
          {hasGallery && (
            <section className="pt-20 pb-16 flex justify-center">
              <div style={{ maxWidth: "860px", width: "100%" }}>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: 0.5,
                    color: "#fff",
                    marginBottom: "32px",
                    textAlign: "center",
                  }}
                >
                  Gallery
                </p>
                <GallerySlider items={page.gallery_images!} />
              </div>
            </section>
          )}

          {/* Block 5 - Kontakt: clear endpoint */}
          {hasContact && (
            <section className="flex justify-center" style={{ paddingTop: "80px", paddingBottom: "48px" }}>
              <div style={{ maxWidth: "860px", width: "100%" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.5, color: "#fff", marginBottom: "32px", textAlign: "center" }}>Contact</p>
                <ContactInquiryButton
                  contacts={page.contacts}
                  contact_message={page.contact_message}
                />
              </div>
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
    <div>
      {/* Label */}
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.5,
          color: "#fff",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        New Release
      </p>

      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start"
      >
        {/* Cover Image — raw panel, no card chrome */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: "clamp(198px, 24.2vw, 308px)",
            height: "clamp(198px, 24.2vw, 308px)",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.06) inset",
          }}
        >
          {release.cover_url ? (
            <img
              src={release.cover_url}
              alt={release.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span style={{ fontSize: "4rem", color: "rgba(255,255,255,0.15)" }}>♪</span>
            </div>
          )}
        </div>

        {/* Release Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left" style={{ paddingTop: "8px" }}>
          <h3
            style={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontSize: "clamp(28px, 3.5vw, 48px)",
            }}
          >
            {release.title}
          </h3>

          {release.release_date && (
            <p
              style={{
                marginTop: "20px",
                fontSize: "clamp(11px, 0.9vw, 13px)",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em",
              }}
            >
              {formatReleaseDate(release.release_date)}
            </p>
          )}

          {release.url && (
            <span
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                marginTop: "32px",
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
              Listen Now
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
