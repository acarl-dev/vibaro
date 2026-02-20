"use client";

import { useMemo } from "react";
import {
  PublicArtistPageData,
  ReleaseItem,
  ShowItem,
  LinkItem,
  getUpcomingShows,
} from "./shared";
import { PreviewBanner } from "./PreviewBanner";
import LazyVideoEmbed from "./LazyVideoEmbed";
import ProjectHeroBanner from "@/components/public-page/ProjectHeroBanner";

/**
 * EditorialTemplate - Text-led, quiet, curated (Artist Plan only)
 *
 * Design Philosophy (from docs/THEMES/EDITORIAL.md):
 * - "Editorial ist kein Hero-Template."
 * - "Es ist textgeführt, ruhig und reduziert."
 * - "Bilder begleiten – Typografie führt."
 *
 * NOT allowed:
 * - Full-Bleed Hero
 * - Centered Headlines
 * - Feature-Listen
 * - Conversion-CTAs
 *
 * Allowed:
 * - Asymmetrie
 * - Leere
 * - Zurückhaltung
 */

// -----------------------------------------------------------------------------
// Design Tokens (from Styleguide Section 3 & 6)
// -----------------------------------------------------------------------------

const TOKENS = {
  // Colors (Section 6.2)
  bgPrimary: "#0E0E0F",
  bgSecondary: "#141416",
  textPrimary: "#F4F4F5",
  textSecondary: "#CFCFD2",
  textMuted: "#8B8B91",
  borderSubtle: "rgba(255,255,255,0.08)",

  // Spacing (Section 3)
  space: {
    "2xs": "8px",
    xs: "16px",
    sm: "32px",
    md: "56px",
    lg: "96px",
    xl: "160px",
    "2xl": "240px",
  },

  // Layout (Section 2)
  maxWidth: "1200px",
  paddingInline: "clamp(24px, 6vw, 96px)",
  maxTextWidth: "60ch",
} as const;

// -----------------------------------------------------------------------------
// Main Template Component
// -----------------------------------------------------------------------------

export default function EditorialTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const upcomingShows = useMemo(
    () => getUpcomingShows(page.shows || []),
    [page.shows]
  );

  const hasReleases = (page.releases?.length ?? 0) > 0;
  const hasShows = upcomingShows.length > 0;
  const hasLinks = (page.links?.length ?? 0) > 0;
  const hasVideos = (page.videos?.length ?? 0) > 0;
  const hasGallery = (page.gallery_images?.length ?? 0) > 0;

  // Fokus-Sektion: nur EINE (Section 7.2)
  const featuredRelease =
    page.releases?.find((r) => r.is_featured) || page.releases?.[0];
  const featuredVideo = page.videos?.[0];
  const nextShow = upcomingShows[0];

  // Priorität: Release > Video > Show
  const fokusType = hasReleases
    ? "release"
    : hasVideos
      ? "video"
      : hasShows
        ? "show"
        : null;

  return (
    <>
      <PreviewBanner isPublished={page.is_published} />
      <div
        className="min-h-screen"
        style={{
          backgroundColor: TOKENS.bgPrimary,
          color: TOKENS.textPrimary,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          ...(page.is_published === false ? { marginTop: "52px" } : {}),
        }}
      >
        {/* Editorial Opening (Section 4) - Text links, Bild rechts */}
        <EditorialOpening page={page} />

        {/* Active Project Hero Banner */}
        {page.active_spotlight && (
          <div
            style={{
              maxWidth: TOKENS.maxWidth,
              marginInline: "auto",
              paddingInline: TOKENS.paddingInline,
              paddingBottom: TOKENS.space.sm,
            }}
          >
            <ProjectHeroBanner
              title={page.active_spotlight.title}
              type={page.active_spotlight.type}
              primaryUrl={page.active_spotlight.primary_url}
            />
          </div>
        )}

        {/* Intro-Text / Bio (Section 7.1) */}
        {page.bio && <EditorialIntro bio={page.bio} />}

        {/* Fokus-Sektion - genau EINE (Section 7.2) */}
        {fokusType === "release" && featuredRelease && (
          <EditorialFokusRelease release={featuredRelease} />
        )}
        {fokusType === "video" && featuredVideo && (
          <EditorialFokusVideo video={featuredVideo} />
        )}
        {fokusType === "show" && nextShow && (
          <EditorialFokusShow show={nextShow} />
        )}

        {/* Weitere Releases (nur wenn Fokus != Release oder mehr als 1) */}
        {hasReleases && page.releases!.length > 1 && (
          <EditorialReleases
            items={page.releases!.filter((r) => r !== featuredRelease)}
          />
        )}

        {/* Shows (nur wenn nicht Fokus) */}
        {hasShows && fokusType !== "show" && (
          <EditorialShows items={upcomingShows} />
        )}

        {/* Galerie (Section 7.3) */}
        {hasGallery && <EditorialGallery images={page.gallery_images!} />}

        {/* Footer */}
        <EditorialFooter
          links={hasLinks ? page.links : []}
          booking_email={page.booking_email}
          management_email={page.management_email}
          press_email={page.press_email}
          displayName={page.display_name}
        />
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Editorial Opening (Section 4)
// Zweispaltig, asymmetrisch: Text links (~60%), Bild rechts (~40%)
// Mobile: Text zuerst, Bild darunter
// -----------------------------------------------------------------------------

function EditorialOpening({ page }: { page: PublicArtistPageData }) {
  const hasImage = !!page.images.hero_image_url || !!page.images.avatar_url;
  const imageUrl = page.images.hero_image_url || page.images.avatar_url;

  return (
    <header
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space["2xl"],
        paddingBottom: TOKENS.space.xl,
      }}
    >
      <div className="flex flex-col lg:flex-row lg:gap-20">
        {/* Text-Seite (dominant, ~60%) */}
        <div className="lg:w-[58%] lg:shrink-0">
          {/* Künstlername - primär, sehr groß */}
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 96px)",
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: TOKENS.textPrimary,
            }}
          >
            {page.display_name}
          </h1>
        </div>

        {/* Bild-Seite (begleitend, ~40%) - tiefer positioniert */}
        {hasImage && imageUrl && (
          <div
            className="mt-16 lg:mt-20 lg:w-[35%]"
            style={{
              // Bild sitzt bewusst tiefer als der Name (Section 16.3)
            }}
          >
            <img
              src={imageUrl}
              alt={page.display_name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "45vh",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}

// -----------------------------------------------------------------------------
// Intro-Text (Section 7.1)
// Direkt nach Opening, einspaltig, max 6-8 Zeilen
// -----------------------------------------------------------------------------

function EditorialIntro({ bio }: { bio: string }) {
  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.md,
        paddingBottom: TOKENS.space.xl,
      }}
    >
      <p
        style={{
          fontSize: "clamp(17px, 1.8vw, 20px)",
          fontWeight: 400,
          lineHeight: 1.8,
          color: TOKENS.textSecondary,
          maxWidth: TOKENS.maxTextWidth,
        }}
      >
        {bio}
      </p>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Fokus-Sektion: Release (Section 7.2)
// -----------------------------------------------------------------------------

function EditorialFokusRelease({ release }: { release: ReleaseItem }) {
  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.md,
        paddingBottom: TOKENS.space.xl,
      }}
    >
      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        style={{ maxWidth: "480px" }}
      >
        {release.cover_url && (
          <div
            style={{
              aspectRatio: "1 / 1",
              marginBottom: TOKENS.space.sm,
              overflow: "hidden",
            }}
          >
            <img
              src={release.cover_url}
              alt={release.title}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <h2
          style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: 600,
            lineHeight: 1.2,
            color: TOKENS.textPrimary,
          }}
        >
          {release.title}
        </h2>

        {release.release_date && (
          <p
            style={{
              fontSize: "14px",
              color: TOKENS.textMuted,
              marginTop: TOKENS.space["2xs"],
            }}
          >
            {new Date(release.release_date).getFullYear()}
          </p>
        )}
      </a>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Fokus-Sektion: Video (Section 7.2 & 8.2)
// -----------------------------------------------------------------------------

function EditorialFokusVideo({
  video,
}: {
  video: {
    video_id: string;
    platform: "youtube" | "vimeo";
    title: string;
    thumbnail_url?: string | null;
  };
}) {
  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.md,
        paddingBottom: TOKENS.space.xl,
      }}
    >
      <div style={{ maxWidth: "800px" }}>
        <LazyVideoEmbed
          videoId={video.video_id}
          platform={video.platform}
          title={video.title}
          thumbnailUrl={video.thumbnail_url}
        />
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Fokus-Sektion: Show (Section 7.2)
// -----------------------------------------------------------------------------

function EditorialFokusShow({ show }: { show: ShowItem }) {
  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.md,
        paddingBottom: TOKENS.space.xl,
      }}
    >
      <div style={{ maxWidth: "500px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: TOKENS.textMuted,
            marginBottom: TOKENS.space.xs,
          }}
        >
          Next
        </p>

        <time
          style={{
            display: "block",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            color: TOKENS.textPrimary,
            marginBottom: TOKENS.space["2xs"],
          }}
        >
          {formatShowDateLong(show.date)}
        </time>

        <p
          style={{
            fontSize: "clamp(18px, 2vw, 22px)",
            fontWeight: 400,
            color: TOKENS.textSecondary,
          }}
        >
          {show.venue}, {show.city}
        </p>

        {show.url && (
          <a
            href={show.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: TOKENS.space.sm,
              fontSize: "14px",
              color: TOKENS.textSecondary,
              borderBottom: `1px solid ${TOKENS.borderSubtle}`,
              paddingBottom: "2px",
            }}
            className="hover:text-white transition-colors duration-200"
          >
            Tickets
          </a>
        )}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Weitere Releases (nicht Fokus)
// -----------------------------------------------------------------------------

function EditorialReleases({ items }: { items: ReleaseItem[] }) {
  const releases = items.slice(0, 4);

  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingBottom: TOKENS.space.lg,
      }}
    >
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: TOKENS.textMuted,
          marginBottom: TOKENS.space.sm,
        }}
      >
        More Music
      </h2>

      <div className="flex flex-col gap-6">
        {releases.map((release, index) => (
          <a
            key={index}
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 hover:opacity-80 transition-opacity duration-200"
          >
            {release.cover_url && (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <img
                  src={release.cover_url}
                  alt={release.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: TOKENS.textSecondary,
                }}
              >
                {release.title}
              </p>
              {release.release_date && (
                <p
                  style={{
                    fontSize: "13px",
                    color: TOKENS.textMuted,
                  }}
                >
                  {new Date(release.release_date).getFullYear()}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Shows (wenn nicht Fokus)
// -----------------------------------------------------------------------------

function EditorialShows({ items }: { items: ShowItem[] }) {
  const shows = items.slice(0, 5);

  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingBottom: TOKENS.space.md,
      }}
    >
      <h2
        style={{
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: TOKENS.textMuted,
          opacity: 0.6,
          marginBottom: TOKENS.space.sm,
        }}
      >
        Shows
      </h2>

      <div className="flex flex-col" style={{ maxWidth: "450px" }}>
        {shows.map((show, index) => (
          <div
            key={index}
            className="group flex items-baseline gap-5 py-3"
            style={{
              borderBottom:
                index < shows.length - 1
                  ? `1px solid ${TOKENS.borderSubtle}`
                  : "none",
            }}
          >
            <time
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: TOKENS.textMuted,
                minWidth: "70px",
                fontFeatureSettings: "'tnum'",
              }}
            >
              {formatShowDateShort(show.date)}
            </time>

            <div className="flex-1">
              <span style={{ fontSize: "14px", color: TOKENS.textMuted }}>
                {show.venue}
              </span>
              <span style={{ fontSize: "14px", color: TOKENS.textMuted, opacity: 0.6 }}>
                , {show.city}
              </span>
            </div>

            {show.url && (
              <a
                href={show.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-30 group-hover:opacity-60 transition-opacity duration-200"
                style={{ fontSize: "13px", color: TOKENS.textMuted }}
              >
                ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Galerie (Section 7.3)
// Kein Grid-Look, unterschiedliche Bildgrößen, unregelmäßige Abstände
// -----------------------------------------------------------------------------

function EditorialGallery({
  images,
}: {
  images: { image_url: string; title?: string | null }[];
}) {
  const galleryImages = images.slice(0, 6);

  // Bewusst unregelmäßige Rhythmik (Section 16.6)
  const layouts = [
    { width: "90%", marginLeft: "0", spacing: TOKENS.space.lg },
    { width: "55%", marginLeft: "30%", spacing: TOKENS.space.md },
    { width: "75%", marginLeft: "8%", spacing: TOKENS.space.xl }, // große Pause
    { width: "48%", marginLeft: "38%", spacing: TOKENS.space.lg },
    { width: "82%", marginLeft: "2%", spacing: TOKENS.space.md },
    { width: "62%", marginLeft: "22%", spacing: TOKENS.space.lg },
  ];

  return (
    <section
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.lg,
        paddingBottom: TOKENS.space.xl,
      }}
    >
      {galleryImages.map((image, index) => {
        const layout = layouts[index % layouts.length];

        return (
          <figure
            key={index}
            className="lg:block"
            style={{
              width: "100%",
              marginBottom:
                index < galleryImages.length - 1 ? layout.spacing : 0,
            }}
          >
            {/* Desktop: Asymmetrisch mit Variation */}
            <div
              className="hidden lg:block"
              style={{
                width: layout.width,
                marginLeft: layout.marginLeft,
              }}
            >
              <img
                src={image.image_url}
                alt={image.title ?? `Image ${index + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "75vh",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Mobile: Einfach untereinander, mehr Abstand */}
            <div
              className="lg:hidden"
              style={{
                marginBottom:
                  index < galleryImages.length - 1 ? TOKENS.space.lg : 0,
              }}
            >
              <img
                src={image.image_url}
                alt={image.title ?? `Image ${index + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          </figure>
        );
      })}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Footer (Section 9 & 15.9)
// Minimal, keine Icons, keine Hervorhebungen
// -----------------------------------------------------------------------------

function EditorialFooter({
  links,
  booking_email,
  management_email,
  press_email,
  displayName,
}: {
  links: LinkItem[];
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  displayName: string;
}) {
  const contacts = [
    { label: "Booking", value: booking_email },
    { label: "Management", value: management_email },
    { label: "Press", value: press_email },
  ].filter((c) => c.value);

  const hasLinks = links.length > 0;
  const hasContacts = contacts.length > 0;

  return (
    <footer
      style={{
        maxWidth: TOKENS.maxWidth,
        marginInline: "auto",
        paddingInline: TOKENS.paddingInline,
        paddingTop: TOKENS.space.md,
        paddingBottom: TOKENS.space.xl,
        borderTop: "none",
      }}
    >
      {/* Links & Contact - sehr zurückhaltend */}
      {(hasLinks || hasContacts) && (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mb-12">
          {hasLinks && (
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: TOKENS.textMuted,
                  opacity: 0.5,
                  marginBottom: TOKENS.space.xs,
                }}
              >
                Links
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity duration-200"
                    style={{
                      fontSize: "13px",
                      color: TOKENS.textMuted,
                    }}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {hasContacts && (
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: TOKENS.textMuted,
                  opacity: 0.5,
                  marginBottom: TOKENS.space.xs,
                }}
              >
                Contact
              </p>
              <div className="flex flex-col gap-1">
                {contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={`mailto:${contact.value}`}
                    className="hover:opacity-70 transition-opacity duration-200"
                    style={{
                      fontSize: "13px",
                      color: TOKENS.textMuted,
                    }}
                  >
                    {contact.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Copyright - verblasst */}
      <p
        style={{
          fontSize: "11px",
          color: TOKENS.textMuted,
          opacity: 0.3,
        }}
      >
        © {new Date().getFullYear()} {displayName}
      </p>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatShowDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return `${day} ${month}`;
  } catch {
    return dateString;
  }
}

function formatShowDateLong(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
