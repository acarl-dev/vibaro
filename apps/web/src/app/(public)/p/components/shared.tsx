"use client";

import { useState } from "react";
import { ImageModal } from "./ImageModal";
import MusicPlayer from "./MusicPlayer";
import { useLazyLoad } from "../hooks/useLazyLoad";
import {
  EmptyLinksState,
  EmptyShowsState,
  EmptyReleasesState,
  EmptyVideosState,
  EmptyGalleryState,
} from "./EmptyStates";
import {
  containerStyle,
  bioTextStyle,
  PADDING_HERO_NO_IMAGE,
  PADDING_HERO_MOBILE,
  PADDING_SECTION_FULL,
} from "./constants";

// Image component removed - using native img for localhost compatibility

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type LinkItem = {
  type?: string;
  title: string;
  url: string;
};

export type ShowItem = {
  title: string;
  venue: string;
  city: string;
  address?: string | null;
  date: string;
  time?: string;
  price?: number | null;
  is_free?: boolean;
  support_acts?: string[];
  url?: string;
  flyer_url?: string | null;
};

export type ReleaseItem = {
  title: string;
  cover_url?: string;
  url?: string;
  release_date?: string;
  is_featured?: boolean;
};

export type FeaturedTrackItem = {
  title: string;
  artist_name: string | null;
  platform: "spotify" | "soundcloud" | "youtube";
  platform_url: string;
  embed_id: string | null;
};

export type VideoItem = {
  title: string;
  platform: "youtube" | "vimeo";
  video_id: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
};

export type GalleryImageItem = {
  title?: string | null;
  image_url: string;
};

export type PublicArtistPageData = {
  handle: string;
  display_name: string;
  bio: string | null;
  images: {
    avatar_url: string | null;
    hero_image_url: string | null;
  };
  focus?: {
    type: "links" | "shows" | "releases";
    limit: number;
  };
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
  featured_tracks: FeaturedTrackItem[];
  videos?: VideoItem[];
  gallery_images?: GalleryImageItem[];
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
  theme?: {
    key: string | null;
    variant: string | null;
  };
};

// -----------------------------------------------------------------------------
// Hero Component
// -----------------------------------------------------------------------------

export function Hero({ page }: { page: PublicArtistPageData }) {
  const hasHeroImage = !!page.images.hero_image_url;
  const hasAvatar = !!page.images.avatar_url;

  return (
    <section className="w-full bg-zinc-950">
      {hasHeroImage ? (
        <header>
          {/* Hero image: mobile = full image (auto height), desktop = full-bleed cover */}
          <div className="relative w-full overflow-hidden bg-zinc-950 md:h-screen">
            <img
              src={page.images.hero_image_url!}
              alt={`${page.display_name} hero image`}
              className="block w-full h-auto md:absolute md:inset-0 md:w-full md:h-full md:object-cover md:object-[50%_0%]"
            />

            {/* Mobile-only subtle fade into page background */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 60%, rgb(9, 9, 11) 100%)",
              }}
            />

            {/* Desktop-only gradient overlay for readability */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0) 45%, rgba(9,9,11,0.35) 55%, rgba(9,9,11,0.65) 70%, rgba(9,9,11,0.85) 82%, rgba(9,9,11,0.95) 92%, rgba(9,9,11,0.98) 100%)",
              }}
            />

            {/* Desktop-only text overlay (unchanged layout) */}
            <div
              className="hidden md:block absolute"
              style={{
                top: "68%",
                left: 0,
                right: 0,
                transform: "translateY(-5%)",
                paddingBottom: "2rem",
              }}
            >
              <div
                className="mx-auto"
                style={containerStyle()}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
                  {page.display_name}
                </h1>

                {page.bio && (
                  <p
                    className="mt-3 text-zinc-200 text-base md:text-lg leading-relaxed"
                    style={bioTextStyle()}
                  >
                    {page.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only: name & bio below image (no overlay) */}
          <div
            className="md:hidden relative bg-zinc-950"
            style={{
              marginTop: "-1px",
              padding: PADDING_HERO_MOBILE,
            }}
          >
            <div className="mx-auto" style={containerStyle()}>
              <h1 className="text-4xl font-semibold tracking-tight leading-tight text-white">
                {page.display_name}
              </h1>

              {page.bio && (
                <p
                  className="mt-3 text-zinc-300 text-base leading-relaxed"
                  style={bioTextStyle()}
                >
                  {page.bio}
                </p>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header
          className="relative w-full flex items-center justify-center"
          style={{
            minHeight: "min(45vh, 360px)",
            padding: PADDING_HERO_NO_IMAGE,
            background: "linear-gradient(to bottom, rgb(24, 24, 27), rgb(9, 9, 11))",
          }}
        >
          {hasAvatar ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-full ring-1 ring-zinc-800/50">
              <img
                src={page.images.avatar_url!}
                alt={page.display_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800/50">
              <span className="text-5xl font-light text-zinc-600">
                {getInitials(page.display_name)}
              </span>
            </div>
          )}
        </header>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Section Components
// -----------------------------------------------------------------------------

/**
 * SectionHeader - Reusable section heading component
 * @param title - Section title text
 * @param variant - Size variant: "xs" (12px), "small" (10px), "medium" (11px)
 */
export function SectionHeader({
  title,
  variant = "xs",
}: {
  title: string;
  variant?: "xs" | "small" | "medium";
}) {
  const sizeClasses = {
    xs: "text-xs text-zinc-500",      // 12px - used in Section component
    small: "text-[10px] text-zinc-600", // 10px - used in FocusSection
    medium: "text-[11px] text-zinc-500", // 11px - used in ModernTemplate
  };

  return (
    <h2 className={`${sizeClasses[variant]} font-medium uppercase tracking-widest mb-6`}>
      {title}
    </h2>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 pt-12 border-t border-zinc-800/20">
      <SectionHeader title={title} variant="xs" />
      {children}
    </section>
  );
}

export function FocusSection({
  type,
  items,
}: {
  type: "links" | "shows" | "releases";
  items: LinkItem[] | ShowItem[] | ReleaseItem[];
}) {
  const isEmpty = items.length === 0;

  return (
    <section className="mx-auto" style={{ maxWidth: containerStyle().maxWidth, padding: PADDING_SECTION_FULL }}>
      <SectionHeader title={getSectionTitle(type)} variant="small" />

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {type === "links" && <LinkList items={items as LinkItem[]} />}
          {type === "shows" && <ShowList items={items as ShowItem[]} />}
          {type === "releases" && <ReleaseList items={items as ReleaseItem[]} />}
        </>
      )}
    </section>
  );
}

function EmptyState() {
  // Calm empty states - no call to action
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-zinc-700">—</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// List Components
// -----------------------------------------------------------------------------

export function LinkList({ items }: { items: LinkItem[] }) {
  if (items.length === 0) return <EmptyLinksState />;

  // Dynamic import for icons to avoid bundling issues
  const getSocialIcon = (type?: string) => {
    const iconClass = "w-6 h-6 md:w-7 md:h-7";
    
    switch (type) {
      case 'instagram':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        );
      case 'x':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'spotify':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        );
      case 'applemusic':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 00-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.62.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a4.948 4.948 0 002.12-2.325c.25-.63.345-1.29.398-1.96.025-.323.017-.648.024-.973L24 6.124zM6.16 4.457h11.68c.22 0 .433.02.643.05.57.08 1.03.32 1.384.74.35.42.524.914.524 1.486v10.093c0 .97-.49 1.665-1.425 1.963-.165.053-.333.086-.503.105-.068.008-.136.013-.204.016H6.4c-.26 0-.516-.028-.767-.09-.645-.16-1.096-.56-1.335-1.177a2.38 2.38 0 01-.124-.747V6.733c0-.97.49-1.665 1.425-1.963.165-.053.333-.086.503-.105.068-.008.136-.013.204-.016.285-.003.57 0 .854-.192z" />
          </svg>
        );
      case 'soundcloud':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.078.042-.089.092L0 14.479l.187 1.318c0 .056.038.092.089.092.05 0 .089-.036.095-.092l.21-1.318-.21-1.334c-.006-.05-.045-.092-.095-.092m1.83-1.229c-.06 0-.11.051-.117.117l-.2 2.359.2 2.237c.006.066.056.117.116.117.063 0 .11-.051.122-.117l.227-2.237-.227-2.359c-.011-.066-.059-.117-.121-.117m.941-.439c-.07 0-.132.06-.138.131l-.182 2.797.182 2.724c.006.071.068.132.138.132.062 0 .124-.061.133-.132l.21-2.724-.21-2.797c-.009-.071-.071-.131-.133-.131m.97-.452c-.08 0-.144.063-.153.149l-.166 3.246.166 3.16c.009.085.073.148.153.148.074 0 .136-.063.148-.148l.19-3.16-.19-3.246c-.012-.086-.074-.149-.148-.149m1.009-.091c-.082 0-.151.068-.16.154l-.149 3.337.149 3.258c.009.087.078.155.16.155.081 0 .15-.068.157-.155l.172-3.258-.172-3.337c-.007-.086-.076-.154-.157-.154m.964.039c-.09 0-.161.073-.172.166l-.138 3.298.138 3.218c.011.093.082.165.172.165.089 0 .159-.072.172-.165l.16-3.218-.16-3.298c-.013-.093-.083-.166-.172-.166m1.013.124c-.095 0-.168.077-.179.175l-.124 3.174.124 3.096c.011.099.084.176.179.176.093 0 .168-.077.179-.176l.142-3.096-.142-3.174c-.011-.098-.086-.175-.179-.175m.986.103c-.101 0-.181.081-.191.186l-.113 3.071.113 3.058c.01.104.09.186.191.186.1 0 .181-.082.191-.186l.13-3.058-.13-3.071c-.01-.105-.091-.186-.191-.186m1.005.17c-.106 0-.19.087-.2.196l-.101 2.901.101 2.98c.01.11.094.196.2.196.11 0 .19-.086.202-.196l.117-2.98-.117-2.901c-.012-.109-.092-.196-.202-.196m.962.119c-.111 0-.196.091-.206.204l-.09 2.782.09 2.973c.01.112.095.204.206.204.112 0 .196-.092.206-.204l.105-2.973-.105-2.782c-.01-.113-.094-.204-.206-.204m1.008.165c-.117 0-.206.095-.216.211l-.083 2.617.083 2.967c.01.118.099.213.216.213.118 0 .206-.095.216-.213l.096-2.967-.096-2.617c-.01-.116-.098-.211-.216-.211m.965.143c-.121 0-.216.099-.227.225l-.074 2.474.074 2.962c.011.125.106.225.227.225.123 0 .218-.1.227-.225l.087-2.962-.087-2.474c-.009-.126-.104-.225-.227-.225m1.007.126c-.128 0-.226.103-.236.232l-.065 2.348.065 2.957c.01.129.108.231.236.231.128 0 .226-.102.237-.231l.078-2.957-.078-2.348c-.011-.129-.109-.232-.237-.232m.993.162c-.133 0-.236.107-.246.241l-.057 2.186.057 2.952c.01.135.113.241.246.241.133 0 .235-.106.245-.241l.066-2.952-.066-2.186c-.01-.134-.112-.241-.245-.241m1.007.091c-.138 0-.246.111-.255.25l-.048 2.095.048 2.946c.009.139.117.25.255.25.14 0 .247-.111.256-.25l.057-2.946-.057-2.095c-.009-.139-.116-.25-.256-.25m.969.082c-.144 0-.251.115-.259.261l-.041 2.013.041 2.942c.008.146.115.261.259.261.145 0 .251-.115.26-.261l.05-2.942-.05-2.013c-.009-.146-.115-.261-.26-.261m1.006.077c-.151 0-.261.119-.269.269l-.032 1.931.032 2.938c.008.15.118.269.269.269.149 0 .261-.119.269-.269l.039-2.938-.039-1.931c-.008-.15-.12-.269-.269-.269m.986.064c-.155 0-.27.123-.279.279l-.023 1.867.023 2.934c.009.156.124.279.279.279.155 0 .27-.123.278-.279l.029-2.934-.029-1.867c-.008-.156-.123-.279-.278-.279m1.006.052c-.16 0-.279.127-.287.287l-.014 1.815.014 2.93c.008.161.127.288.287.288.161 0 .279-.127.288-.288l.018-2.93-.018-1.815c-.009-.16-.127-.287-.288-.287m.968.039c-.166 0-.288.131-.295.297l-.007 1.776.007 2.925c.007.167.129.297.295.297.167 0 .288-.13.295-.297l.009-2.925-.009-1.776c-.007-.166-.128-.297-.295-.297m1.007.025c-.171 0-.292.135-.3.305l-.001 1.751.001 2.922c.008.169.129.305.3.305.172 0 .293-.136.301-.305v-2.922c0-.17-.129-.305-.301-.305m.975.013c-.177 0-.302.139-.309.313v4.673c.007.174.132.313.309.313.176 0 .302-.139.309-.313V12.66c-.007-.174-.133-.313-.309-.313" />
          </svg>
        );
      case 'bandcamp':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 9.6l6.842 4.8H24L17.158 9.6H0z" />
          </svg>
        );
      case 'website':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {items.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-zinc-400 transition-colors hover:text-white"
          title={link.title}
          aria-label={link.title}
        >
          {getSocialIcon(link.type)}
        </a>
      ))}
    </div>
  );
}

export function ShowList({ items }: { items: ShowItem[] }) {
  if (items.length === 0) return <EmptyShowsState />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {items.map((show, index) => (
        <li
          key={index}
          className="h-full flex flex-col"
        >
          <div
            className="group h-full rounded-xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 hover:border-zinc-700/70"
          >
            <div className="flex h-full">
              <div className="relative w-24 sm:w-28 md:w-32 shrink-0 aspect-[3/4] bg-zinc-900">
                {show.flyer_url ? (
                  <img
                    src={show.flyer_url}
                    alt={`${show.title} Flyer`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-600 text-4xl">
                    ♪
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg font-semibold text-zinc-100 truncate">{show.venue}</p>
                    <p className="text-sm text-zinc-400 truncate">{show.city}</p>
                  </div>
                  <span className="hidden sm:inline-flex text-xs text-white whitespace-nowrap bg-black/70 px-2 py-1 rounded-full">
                    {formatDate(show.date)}
                  </span>
                </div>

                {/* Time, Price, Support Acts */}
                <div className="flex flex-col gap-2 text-xs sm:text-sm text-zinc-400">
                  {/* Time */}
                  {show.time && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{show.time} Uhr</span>
                    </div>
                  )}

                  {/* Price */}
                  {(show.is_free || show.price) && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <path d="M12 2v4m0 8v4M4.22 4.22l2.83 2.83m3.95 3.95l2.83 2.83M2 12h4m8 0h4M4.22 19.78l2.83-2.83m3.95-3.95l2.83-2.83M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                      </svg>
                      <span className="text-zinc-300 font-medium">
                        {show.is_free ? "Kostenlos" : `${parseFloat(String(show.price)).toFixed(2)}€`}
                      </span>
                    </div>
                  )}

                  {/* Support Acts */}
                  {show.support_acts && show.support_acts.length > 0 && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="text-zinc-300 line-clamp-2">
                        mit {show.support_acts.join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {show.address && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(show.address)}`, '_blank')}
                      className="flex gap-2 hover:text-accent transition-colors bg-none border-none cursor-pointer p-0 items-start"
                    >
                      <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div className="text-zinc-300 text-xs leading-snug">
                        {show.address.split(',').map((part, idx) => (
                          <div key={idx} className="whitespace-nowrap">
                            {part.trim()}
                          </div>
                        ))}
                      </div>
                    </button>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400">
                  <span className="inline-flex items-center gap-2 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]" aria-hidden="true"></span>
                    Live
                  </span>
                  {show.url && (
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded px-1 py-0.5"
                    >
                      Tickets
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ReleaseList({ items }: { items: ReleaseItem[] }) {
  if (items.length === 0) return <EmptyReleasesState />;

  return (
    <ul className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((release, index) => (
        <li key={index}>
          <a
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-md border border-zinc-800/50 bg-zinc-900/30 overflow-hidden transition-all hover:border-zinc-700/70 hover:shadow-lg hover:shadow-zinc-900/50 cursor-pointer active:scale-[0.98]"
          >
            {release.cover_url ? (
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={release.cover_url}
                  alt={release.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                {/* Play Icon Badge - always visible on mobile, overlay on desktop */}
                <div className="absolute bottom-2 right-2 md:inset-0 bg-black/70 md:bg-black/0 md:group-hover:bg-black/30 rounded-full md:rounded-none p-2 md:p-0 transition-all duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white drop-shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity transition-transform duration-300 md:group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="relative aspect-square w-full bg-zinc-900 flex items-center justify-center">
                <span className="text-4xl text-zinc-700">♪</span>
                {/* Play Icon Badge for no-cover case */}
                <div className="absolute bottom-2 right-2 md:inset-0 bg-black/70 md:bg-black/0 md:group-hover:bg-black/30 rounded-full md:rounded-none p-2 md:p-0 transition-all duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white drop-shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity transition-transform duration-300 md:group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
            <div className="p-3 sm:p-4">
              <p className="text-sm font-medium text-zinc-100 truncate group-hover:text-white transition-colors">{release.title}</p>
              {release.release_date && (
                <p className="text-xs text-zinc-500 mt-1.5">{release.release_date}</p>
              )}
              {/* "Anhören" text - always visible on mobile, hover on desktop */}
              <p className="text-xs text-accent mt-2 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Anhören
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function VideoList({ items }: { items: VideoItem[] }) {
  const [ref, isVisible] = useLazyLoad<HTMLUListElement>();

  if (items.length === 0) return <EmptyVideosState />;

  const getEmbedSrc = (video: VideoItem): string | null => {
    if (!video.video_id) return null;

    if (video.platform === "youtube") {
      return `https://www.youtube-nocookie.com/embed/${video.video_id}`;
    }

    if (video.platform === "vimeo") {
      return `https://player.vimeo.com/video/${video.video_id}`;
    }

    return null;
  };

  return (
    <ul ref={ref} className="grid w-full gap-6 grid-cols-1 md:grid-cols-2">
      {items.map((video, index) => (
        <li key={index}>
          <div className="block rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 transition-all hover:border-zinc-700/70">
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              {isVisible && getEmbedSrc(video) ? (
                <iframe
                  src={getEmbedSrc(video)!}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute left-0 top-0 h-full w-full"
                />
              ) : !isVisible ? (
                // Skeleton placeholder while not visible
                <div className="w-full h-full bg-zinc-900 animate-pulse" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{video.title}</p>
                    <p className="mt-2 text-xs text-zinc-500">Video kann nicht eingebettet werden.</p>
                    {video.url && (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs font-medium transition-colors hover:bg-zinc-800"
                      >
                        Extern öffnen
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-zinc-100 line-clamp-2">{video.title}</p>
              {video.description && (
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{video.description}</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function GalleryGrid({ items }: { items: GalleryImageItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (items.length === 0) return <EmptyGalleryState />;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
        {items.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            type="button"
            className="group mb-4 block w-full break-inside-avoid text-left"
            aria-label={image.title ? `Bild öffnen: ${image.title}` : `Bild öffnen ${index + 1}`}
          >
            <div className="overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 transition-colors group-hover:border-zinc-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40">
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  loading="lazy"
                  className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 21l-4.35-4.35" />
                      <circle cx="11" cy="11" r="7" />
                      <path d="M11 8v6" />
                      <path d="M8 11h6" />
                    </svg>
                    Öffnen
                  </span>
                </div>
              </div>

              {image.title && (
                <div className="border-t border-zinc-800/50 px-3 py-2">
                  <p className="text-xs text-zinc-300 line-clamp-2">{image.title}</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          images={items}
          initialIndex={selectedIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

// Legacy ContactSection (DEPRECATED - do not use on public pages)
// Contact data is now hidden from public view for security
// Use ContactInquiryModal instead
export function ContactSection({
  booking_email,
  management_email,
  press_email,
  whatsapp_number,
}: {
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
}) {
  // DEPRECATED: This component is no longer used on public pages
  // Contact information is private and only shown in studio settings
  return null;
}

// New public contact component - shows button with no exposed contact details
export function ContactInquiryButton({
  booking_email,
  management_email,
  press_email,
  whatsapp_number,
}: {
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasAnyContact = booking_email || management_email || press_email || whatsapp_number;

  if (!hasAnyContact) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-200 hover:text-white transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Get in Touch
      </button>

      {isOpen && (
        <ContactInquiryModal
          booking_email={booking_email}
          management_email={management_email}
          press_email={press_email}
          whatsapp_number={whatsapp_number}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// Modal for selecting which contact to reach out to
function ContactInquiryModal({
  booking_email,
  management_email,
  press_email,
  whatsapp_number,
  onClose,
}: {
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
  onClose: () => void;
}) {
  const contacts = [
    { label: "Bookings", email: booking_email, type: "email" as const },
    { label: "Management", email: management_email, type: "email" as const },
    { label: "Press", email: press_email, type: "email" as const },
    { label: "WhatsApp", email: whatsapp_number, type: "whatsapp" as const },
  ].filter((c) => c.email);

  const getContactLink = (contact: typeof contacts[0]) => {
    if (contact.type === "whatsapp") {
      const cleanNumber = contact.email!.replace(/[^0-9+]/g, "");
      return `https://wa.me/${cleanNumber}`;
    }
    return `mailto:${contact.email}`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-w-sm w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-50">Get in Touch</h3>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-400 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contact options */}
          <div className="p-6 space-y-3">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={getContactLink(contact)}
                target={contact.type === "whatsapp" ? "_blank" : undefined}
                rel={contact.type === "whatsapp" ? "noopener noreferrer" : undefined}
                className="block p-4 rounded-lg border border-zinc-800/50 bg-zinc-800/20 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all text-left"
              >
                <div className="text-sm font-medium text-zinc-300 mb-1">
                  {contact.label}
                </div>
                <div className="text-xs text-zinc-500">
                  {contact.type === "whatsapp"
                    ? "Start a chat on WhatsApp"
                    : "Send an email inquiry"}
                </div>
              </a>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
            <p className="text-xs text-zinc-500 text-center">
              We'll get back to you as soon as possible
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function FeaturedReleaseSection({ release }: { release: ReleaseItem }) {
  return (
    <section className="mx-auto" style={{ maxWidth: containerStyle().maxWidth, padding: PADDING_SECTION_FULL }}>
      <SectionHeader title="New Release" variant="small" />
      
      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Cover Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {release.cover_url ? (
              <img
                src={release.cover_url}
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-6xl text-zinc-700">♪</span>
              </div>
            )}
          </div>
          
          {/* Release Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
              {release.title}
            </h3>
            {release.release_date && (
              <p className="text-sm text-zinc-500 mb-6">{release.release_date}</p>
            )}
            {release.url && (
              <span className="inline-block px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg transition-colors group-hover:bg-zinc-100">
                Jetzt anhören
              </span>
            )}
          </div>
        </div>
      </a>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

export function Footer({ displayName }: { displayName: string }) {
  return (
    <footer className="border-t border-zinc-900/50 py-10 px-6 mt-16">
      <div className="mx-auto max-w-xl flex flex-col items-center gap-3 text-center">
        <p className="text-xs text-zinc-600">© {displayName}</p>
        <p className="text-[10px] text-zinc-800 font-light tracking-wider uppercase">
          Vibaro
        </p>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function getSectionTitle(type: "links" | "shows" | "releases" | "Discography"): string {
  const titles: Record<string, string> = {
    links: "Links",
    shows: "Shows",
    releases: "Releases",
    Discography: "Discography",
  };
  return titles[type];
}

export function getFocusItems(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases",
  limit: number
): LinkItem[] | ShowItem[] | ReleaseItem[] {
  const items =
    focusType === "links"
      ? page.links
      : focusType === "shows"
        ? page.shows
        : page.releases;
  return items.slice(0, limit);
}

export function getOptionalSections(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases"
): { type: "links" | "shows" | "releases" }[] {
  // Priority: releases > shows > links
  const priority: ("links" | "shows" | "releases")[] = ["releases", "shows", "links"];
  const sections: { type: "links" | "shows" | "releases" }[] = [];

  for (const type of priority) {
    if (type === focusType) continue; // skip focus type
    if (sections.length >= 2) break; // max 2 sections

    const items =
      type === "links"
        ? page.links
        : type === "shows"
          ? page.shows
          : page.releases;

    if (items.length > 0) {
      sections.push({ type });
    }
  }

  return sections;
}

/**
 * Setup focus configuration with defaults
 * MVP: Free plan = links focus by default (limit: 3)
 */
export function setupFocus(page: PublicArtistPageData) {
  const focus = page.focus ?? { type: "links" as const, limit: 3 };
  const focusType = focus.type;
  const focusLimit = focus.limit;
  const focusItems = getFocusItems(page, focusType, focusLimit);

  return {
    type: focusType,
    limit: focusLimit,
    items: focusItems,
  };
}

// New Refactored Helpers for cleaner templates

/**
 * Checks which optional sections are available
 */
export function getAvailableSections(page: PublicArtistPageData) {
  return {
    hasVideos: (page.videos?.length ?? 0) > 0,
    hasGallery: (page.gallery_images?.length ?? 0) > 0,
    hasContact: !!(page.booking_email || page.management_email || page.press_email || page.whatsapp_number),
    hasMusicPlayer: (page.featured_tracks?.length ?? 0) > 0,
  };
}

/**
 * Renders Videos, Gallery, and Contact sections
 * Replaces repetitive conditional rendering in templates
 */
export function OptionalSections({ page }: { page: PublicArtistPageData }) {
  const { hasVideos, hasGallery, hasContact } = getAvailableSections(page);

  return (
    <>
      {hasVideos && (
        <Section title="Videos">
          <VideoList items={page.videos!} />
        </Section>
      )}

      {hasGallery && (
        <Section title="Gallery">
          <GalleryGrid items={page.gallery_images!} />
        </Section>
      )}

      {hasContact && (
        <Section title="Contact">
          <ContactInquiryButton
            booking_email={page.booking_email}
            management_email={page.management_email}
            press_email={page.press_email}
            whatsapp_number={page.whatsapp_number}
          />
        </Section>
      )}
    </>
  );
}

/**
 * Renders a single optional section (for use in .map)
 * Used by optional sections that vary per template
 */
export function OptionalSectionRenderer({
  section,
  page,
}: {
  section: { type: "links" | "shows" | "releases" };
  page: PublicArtistPageData;
}) {
  return (
    <Section key={section.type} title={getSectionTitle(section.type === "releases" ? "Discography" : section.type)}>
      {section.type === "links" && <LinkList items={page.links} />}
      {section.type === "shows" && <ShowList items={page.shows} />}
      {section.type === "releases" && <ReleaseList items={page.releases} />}
    </Section>
  );
}

/**
 * Renders music player section if featured tracks exist
 */
export function MusicSection({ page }: { page: PublicArtistPageData }) {
  const { hasMusicPlayer } = getAvailableSections(page);

  if (!hasMusicPlayer) return null;

  return (
    <Section title="Music">
      <MusicPlayer tracks={page.featured_tracks!} />
    </Section>
  );
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Filter out past shows
export function getUpcomingShows(shows: ShowItem[]): ShowItem[] {
  const now = new Date();
  return shows.filter(show => {
    const showDate = new Date(show.date);
    return showDate >= now;
  });
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
}
