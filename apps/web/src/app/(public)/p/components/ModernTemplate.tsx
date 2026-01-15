import Image from "next/image";
import {
  PublicArtistPageData,
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
        
        {/* Featured Release Banner (if exists) */}
        {featuredRelease && <FeaturedReleaseHero release={featuredRelease} />}

        {/* Links Section */}
        {hasLinks && (
          <section className="py-10 md:py-12 border-b border-zinc-800/40">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-6">
              {getSectionTitle("links")}
            </h2>
            <LinkList items={page.links} />
          </section>
        )}

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
// Hero Component (Compact, Mobile-First)
// -----------------------------------------------------------------------------

function Hero({ page }: { page: PublicArtistPageData }) {
  const hasHeroImage = !!page.images.hero_image_url;
  const hasAvatar = !!page.images.avatar_url;

  if (hasHeroImage) {
    return (
      <header>
        {/* Hero Image Container - Compact with aspect ratio */}
        <div className="relative w-full bg-zinc-950">
          <Image
            src={page.images.hero_image_url!}
            alt=""
            width={1920}
            height={1080}
            className="block w-full h-auto"
            priority
          />
          
          {/* Subtle gradient fade to content area */}
          <div 
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.6) 60%, rgb(9,9,11) 100%)'
            }}
          />
        </div>
        
        {/* Name & Bio - Below image for better readability */}
        <div 
          className="relative bg-zinc-950"
          style={{ 
            marginTop: '-1px',
            padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 48px)'
          }}
        >
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              {page.display_name}
            </h1>
            
            {page.bio && (
              <p 
                className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed"
                style={{ maxWidth: '55ch' }}
              >
                {page.bio}
              </p>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Fallback: No Hero Image - Compact centered layout
  return (
    <header 
      className="relative w-full flex flex-col items-center justify-center text-center"
      style={{ 
        minHeight: 'min(45vh, 320px)',
        padding: 'clamp(40px, 8vh, 80px) clamp(16px, 4vw, 48px)',
        background: 'linear-gradient(to bottom, rgb(24, 24, 27), rgb(9, 9, 11))' 
      }}
    >
      {hasAvatar && (
        <div className="mb-6">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full ring-2 ring-zinc-800/50">
            <Image
              src={page.images.avatar_url!}
              alt=""
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
        {page.display_name}
      </h1>
      
      {page.bio && (
        <p 
          className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed mx-auto"
          style={{ maxWidth: '55ch' }}
        >
          {page.bio}
        </p>
      )}
    </header>
  );
}

// -----------------------------------------------------------------------------
// Featured Release Hero Component (Compact, Mobile-First)
// -----------------------------------------------------------------------------

function FeaturedReleaseHero({ release }: { release: ReleaseItem }) {
  return (
    <section className="py-8 md:py-10 border-b border-zinc-800/40">
      <span className="inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest bg-zinc-800/80 text-zinc-400 rounded-full mb-5">
        New Release
      </span>
      
      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 sm:gap-6 items-start"
      >
        {/* Cover Image - Fixed size, doesn't dominate on mobile */}
        <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden rounded-xl shadow-lg">
          {release.cover_url ? (
            <img
              src={release.cover_url}
              alt={release.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <span className="text-4xl text-zinc-700">♪</span>
            </div>
          )}
        </div>
        
        {/* Release Info */}
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-50 leading-tight truncate">
            {release.title}
          </h3>
          
          {release.release_date && (
            <p className="mt-1.5 text-sm text-zinc-500">{formatReleaseDate(release.release_date)}</p>
          )}
          
          {release.url && (
            <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-zinc-950 font-medium text-sm rounded-full transition-colors group-hover:bg-zinc-100">
              Listen Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          )}
        </div>
      </a>
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
