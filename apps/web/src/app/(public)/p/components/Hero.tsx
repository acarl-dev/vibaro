import type { PublicArtistPageData } from "./types";
import { getInitials } from "./helpers";
import {
  containerStyle,
  bioTextStyle,
  PADDING_HERO_NO_IMAGE,
} from "./constants";

// -----------------------------------------------------------------------------
// Hero Component
// -----------------------------------------------------------------------------

export function Hero({ page }: { page: PublicArtistPageData }) {
  const hasHeroImage = !!page.images.hero_image_url;
  const hasAvatar = !!page.images.avatar_url;
  const hasLogo = !!page.images.logo_url;
  const focalX = page.images.hero_focal_x ?? 50;
  const focalY = page.images.hero_focal_y ?? 35;

  if (!hasHeroImage) {
    return (
      <section className="w-full bg-zinc-950">
        <header
          className="relative w-full"
          style={{
            minHeight: "min(50vh, 480px)",
            padding: PADDING_HERO_NO_IMAGE,
            background: "linear-gradient(to bottom, rgb(24, 24, 27), rgb(9, 9, 11))",
          }}
        >
          <div className="h-full flex flex-col items-center justify-center text-center mx-auto" style={containerStyle()}>
            {hasAvatar ? (
              <div className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 overflow-hidden rounded-full ring-2 ring-zinc-800/50 shadow-2xl mb-8">
                <img
                  src={page.images.avatar_url!}
                  alt={`${page.display_name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-40 w-40 md:h-48 md:w-48 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-zinc-800/50 mb-8">
                <span className="text-5xl md:text-6xl font-light text-zinc-600">
                  {getInitials(page.display_name)}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
              {page.display_name}
            </h1>
            {page.bio && (
              <p className="mt-4 text-zinc-300 text-base md:text-lg leading-relaxed mx-auto" style={bioTextStyle()}>
                {page.bio}
              </p>
            )}
          </div>
        </header>
      </section>
    );
  }

  return (
    <header className="stage-hero">
      <div className="stage-hero__container">
        {/* Banner wrapper – provides the positioning context for the logo badge */}
        <div className="stage-hero__bannerWrap">
          <div className="stage-hero__banner">
            <img
              className="stage-hero__img"
              src={page.images.hero_image_url!}
              alt={`${page.display_name} hero image`}
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
            />
            <div className="stage-hero__overlay" aria-hidden="true" />
          </div>

          {/* Logo Badge – centred on the bottom border of the banner */}
          <div className="stage-hero__logoWrap">
            <div className="stage-hero__logoBadge">
              {hasLogo ? (
                <img
                  className="stage-hero__logoImg"
                  src={page.images.logo_url!}
                  alt={`${page.display_name} logo`}
                />
              ) : hasAvatar ? (
                <img
                  className="stage-hero__logoImg"
                  src={page.images.avatar_url!}
                  alt={`${page.display_name} logo`}
                />
              ) : (
                <span className="text-white font-light" style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
                  {getInitials(page.display_name)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name Dock */}
        <div className="stage-hero__transition">
          <div className="stage-hero__nameDock">
            <h1 className="stage-hero__title">{page.display_name}</h1>
            {page.bio && (
              <p className="stage-hero__subtitle">{page.bio}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
