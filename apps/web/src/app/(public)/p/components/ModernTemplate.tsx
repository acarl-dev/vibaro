import {
  PublicArtistPageData,
  Hero,
  LinkList,
  ShowList,
  ReleaseList,
  VideoList,
  GalleryGrid,
  ContactSection,
  Footer,
  getSectionTitle,
  ReleaseItem,
} from "./shared";
import MusicPlayer from "./MusicPlayer";

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
  const featuredRelease = page.releases.find((r) => r.is_featured);
  
  // Check what content is available
  const hasLinks = page.links.length > 0;
  const hasShows = page.shows.length > 0;
  const hasReleases = page.releases.length > 0;
  const hasFeaturedTracks = page.featured_tracks && page.featured_tracks.length > 0;
  const hasVideos = page.videos && page.videos.length > 0;
  const hasGallery = page.gallery_images && page.gallery_images.length > 0;
  const hasContact = page.booking_email || page.management_email || page.press_email || page.whatsapp_number;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero Section */}
      <Hero page={page} />

      {/* Main Content Container - tighter max-width for better readability */}
      <main 
        className="mx-auto pb-8"
        style={{ 
          maxWidth: '800px', 
          padding: '0 clamp(16px, 4vw, 32px)' 
        }}
      >

        {/* Links Section */}
        {hasLinks && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              {getSectionTitle("links")}
            </h2>
            <LinkList items={page.links} />
          </section>
        )}

        {/* Featured Release Banner (if exists) */}
        {featuredRelease && <FeaturedReleaseHero release={featuredRelease} />}

        {/* Music Player Section */}
        {hasFeaturedTracks && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              Music
            </h2>
            <MusicPlayer tracks={page.featured_tracks} />
          </section>
        )}

        {/* Shows Section */}
        {hasShows && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              {getSectionTitle("shows")}
            </h2>
            <ShowList items={page.shows} />
          </section>
        )}

        {/* Releases/Discography Section */}
        {hasReleases && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              Releases
            </h2>
            <ReleaseList items={page.releases} />
          </section>
        )}

        {/* Videos Section */}
        {hasVideos && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              Videos
            </h2>
            <VideoList items={page.videos!} />
          </section>
        )}

        {/* Gallery Section */}
        {hasGallery && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              Gallery
            </h2>
            <GalleryGrid items={page.gallery_images!} />
          </section>
        )}

        {/* Contact Section */}
        {hasContact && (
          <section className="py-10 md:py-12">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              Contact
            </h2>
            <ContactSection
              booking_email={page.booking_email}
              management_email={page.management_email}
              press_email={page.press_email}
              whatsapp_number={page.whatsapp_number}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Featured Release Hero Component (Compact, Mobile-First)
// -----------------------------------------------------------------------------

function FeaturedReleaseHero({ release }: { release: ReleaseItem }) {
  return (
    <section className="py-10 md:py-14 border-b border-zinc-800/40">
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-5 sm:p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-zinc-800/70 text-zinc-300 rounded-full mb-6">
          New Release
        </span>

        <a
          href={release.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row gap-5 sm:gap-7 items-start"
        >
          {/* Cover Image - bigger & more dominant */}
          <div className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/5">
            {release.cover_url ? (
              <img
                src={release.cover_url}
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-5xl text-zinc-700">♪</span>
              </div>
            )}
          </div>

          {/* Release Info */}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-50 leading-tight">
              {release.title}
            </h3>

            {release.release_date && (
              <p className="mt-2 text-sm md:text-base text-zinc-400">
                {formatReleaseDate(release.release_date)}
              </p>
            )}

            {release.url && (
              <span className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white text-zinc-950 font-semibold text-sm rounded-full transition-colors group-hover:bg-zinc-100">
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
