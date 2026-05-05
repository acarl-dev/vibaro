"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  PublicArtistPageData,
  ContactItem,
  ReleaseItem,
  ShowItem,
  LinkItem,
  getUpcomingShows,
} from "./shared";
import { PreviewBanner } from "./PreviewBanner";
import PhaseHero from "@/components/public-page/PhaseHero";
import { safeHref } from "@/lib/safe-href";

/**
 * MinimalTemplate - Ultra-reduced, typography-first, no decoration
 *
 * Design Philosophy:
 * - Single column, max 720px
 * - Black/white only, no accent colors
 * - No cards, shadows, gradients, icons, buttons
 * - Typography + whitespace only
 * - No animations (except link hover)
 *
 * Hard Rules:
 * - MUST be single column at all breakpoints
 * - MUST NOT use cards, panels, bordered boxes, shadows, gradients, glow, blur, glass
 * - MUST NOT use accent colors (only monochrome)
 * - MUST NOT use icons (including social icons)
 * - MUST NOT use UI buttons (only text links)
 * - MUST NOT use animations
 * - Images optional - max 1 in header, square, no effects
 */

// -----------------------------------------------------------------------------
// Design Tokens (Section 1)
// -----------------------------------------------------------------------------

const TOKENS = {
  // Colors (1.1)
  bg: "#0B0B0B",
  fg: "#FFFFFF",
  fgMuted: "rgba(255,255,255,0.62)",
  fgDim: "rgba(255,255,255,0.42)",
  divider: "rgba(255,255,255,0.12)",
  link: "#FFFFFF",
  linkHover: "rgba(255,255,255,0.62)",
  focus: "rgba(255,255,255,0.28)",

  // Typography (1.2)
  fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",

  // Name
  nameSize: "clamp(42px, 5vw, 56px)",
  nameWeight: 600,
  nameTracking: "-0.02em",
  nameLeading: 1.08,

  // Body
  bodySize: "17px",
  bodySizeSm: "16px",
  bodyLeading: 1.72,
  bodyWeight: 400,

  // Section title
  sectionTitleSize: "14px",
  sectionTitleWeight: 500,
  sectionTitleTracking: "0.14em",
  sectionTitleLeading: 1.2,

  // Meta
  metaSize: "14px",
  metaWeight: 400,
  metaLeading: 1.5,

  // Spacing Scale (1.3)
  space: {
    1: "8px",
    2: "12px",
    3: "16px",
    4: "24px",
    5: "32px",
    6: "48px",
    7: "64px",
    8: "96px",
    9: "128px",
  },

  // Container (2.2)
  containerMax: "720px",
  padDesktop: "32px",
  padTablet: "24px",
  padMobile: "20px",
} as const;

// -----------------------------------------------------------------------------
// Main Template Component
// -----------------------------------------------------------------------------

export default function MinimalTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const upcomingShows = useMemo(
    () => getUpcomingShows(page.shows || []),
    [page.shows]
  );

  // Check what content is available
  const hasBio = !!page.bio && page.bio.trim().length > 0;
  const hasReleases = (page.releases?.length ?? 0) > 0;
  const hasShows = upcomingShows.length > 0;
  const hasVideos = (page.videos?.length ?? 0) > 0;
  const hasLinks = (page.links?.length ?? 0) > 0;
  const hasContact = (page.contacts?.length ?? 0) > 0;

  return (
    <>
      <PreviewBanner isPublished={page.is_published} />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: TOKENS.bg,
          color: TOKENS.fg,
          fontFamily: TOKENS.fontFamily,
          ...(page.is_published === false ? { marginTop: "52px" } : {}),
        }}
      >
        {/* Header (Artist Intro) - Section 4 */}
        <MinimalHeader page={page} />

        {/* Main Content Container */}
        <main
          style={{
            maxWidth: TOKENS.containerMax,
            marginInline: "auto",
            paddingInline: `clamp(${TOKENS.padMobile}, 5vw, ${TOKENS.padDesktop})`,
            paddingBottom: `clamp(${TOKENS.space[8]}, 10vw, ${TOKENS.space[9]})`,
          }}
        >
          {/* About - Section 6.1 */}
          {hasBio && <MinimalAbout bio={page.bio!} />}

          {/* Phase Hero — dominant spotlight section */}
          {page.active_spotlight && (
            <div style={{ marginLeft: `calc(-1 * clamp(${TOKENS.padMobile}, 5vw, ${TOKENS.padDesktop}))`, marginRight: `calc(-1 * clamp(${TOKENS.padMobile}, 5vw, ${TOKENS.padDesktop}))`, marginBottom: TOKENS.space[6] }}>
              <PhaseHero spotlight={page.active_spotlight} />
            </div>
          )}

          {/* Releases - Section 6.2 */}
          {hasReleases && <MinimalReleases items={page.releases} />}

          {/* Shows - Section 6.3 */}
          {hasShows && <MinimalShows items={upcomingShows} />}

          {/* Videos - Section 6.4 */}
          {hasVideos && <MinimalVideos items={page.videos!} />}

          {/* Links - Section 6.5 */}
          {hasLinks && <MinimalLinks items={page.links} />}

          {/* Contact - Section 6.6 */}
          {hasContact && (
            <MinimalContact
              contacts={page.contacts}
              handle={page.handle}
            />
          )}
        </main>

        {/* Footer */}
        <MinimalFooter displayName={page.display_name} />
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Header Component (Section 4)
// Image rules: MAY render exactly one image, optional, disabled by default.
// If rendered: standalone, no overlay, no caption, no border, no shadow.
// -----------------------------------------------------------------------------

function MinimalHeader({ page }: { page: PublicArtistPageData }) {
  // Use hero_image_url as that's the only image artists can upload currently
  // Image is optional and only renders if explicitly provided
  const imageUrl = page.images.hero_image_url;
  const hasImage = !!imageUrl;

  return (
    <header
      style={{
        maxWidth: TOKENS.containerMax,
        marginInline: "auto",
        paddingInline: `clamp(${TOKENS.padMobile}, 5vw, ${TOKENS.padDesktop})`,
        paddingTop: `clamp(${TOKENS.space[7]}, 8vw, ${TOKENS.space[8]})`,
        paddingBottom: `clamp(${TOKENS.space[5]}, 4vw, ${TOKENS.space[6]})`,
      }}
    >
      {/* Artist name (Section 4.2, 4.3) */}
      <h1
        style={{
          fontSize: TOKENS.nameSize,
          fontWeight: TOKENS.nameWeight,
          letterSpacing: TOKENS.nameTracking,
          lineHeight: TOKENS.nameLeading,
          color: TOKENS.fg,
          margin: 0,
        }}
      >
        {page.display_name}
      </h1>

      {/* Optional single image - between name and bio, no overlay/caption/border/shadow */}
      {hasImage && (
        <div
          style={{
            marginTop: TOKENS.space[5],
            position: "relative",
            width: "100%",
            maxWidth: "clamp(240px, 40vw, 360px)",
            aspectRatio: "1 / 1",
          }}
        >
          <Image
            src={imageUrl}
            alt={page.display_name}
            fill
            style={{
              objectFit: "cover",
              // No border, no shadow, no border-radius
            }}
            sizes="(max-width: 768px) 240px, 360px"
            priority
          />
        </div>
      )}
    </header>
  );
}

// -----------------------------------------------------------------------------
// Section Wrapper Component (Section 5)
// -----------------------------------------------------------------------------

function MinimalSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        paddingTop: `clamp(${TOKENS.space[6]}, 6vw, ${TOKENS.space[8]})`,
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: TOKENS.sectionTitleSize,
            fontWeight: TOKENS.sectionTitleWeight,
            letterSpacing: TOKENS.sectionTitleTracking,
            lineHeight: TOKENS.sectionTitleLeading,
            color: TOKENS.fgDim,
            textTransform: "uppercase",
            marginBottom: TOKENS.space[4],
            margin: 0,
            marginBlockEnd: TOKENS.space[4],
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// -----------------------------------------------------------------------------
// About Component (Section 6.1)
// -----------------------------------------------------------------------------

function MinimalAbout({ bio }: { bio: string }) {
  return (
    <MinimalSection>
      <p
        style={{
          fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
          fontWeight: TOKENS.bodyWeight,
          lineHeight: TOKENS.bodyLeading,
          color: TOKENS.fg,
          margin: 0,
          // Line clamp to max 4 lines
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {bio}
      </p>
    </MinimalSection>
  );
}

// -----------------------------------------------------------------------------
// Releases Component (Section 6.2)
// -----------------------------------------------------------------------------

function MinimalReleases({ items }: { items: ReleaseItem[] }) {
  return (
    <MinimalSection title="Releases">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: TOKENS.space[3],
        }}
      >
        {items.map((release, index) => (
          <li key={index}>
            <MinimalReleaseRow release={release} />
          </li>
        ))}
      </ul>
    </MinimalSection>
  );
}

function MinimalReleaseRow({ release }: { release: ReleaseItem }) {
  const year = release.release_date
    ? new Date(release.release_date).getFullYear()
    : null;

  const content = (
    <span
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: TOKENS.space[2],
      }}
    >
      <span
        style={{
          fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
          fontWeight: TOKENS.bodyWeight,
          color: TOKENS.fg,
        }}
      >
        {release.title}
      </span>
      {year && (
        <span
          style={{
            fontSize: TOKENS.metaSize,
            color: TOKENS.fgMuted,
          }}
        >
          {year}
        </span>
      )}
    </span>
  );

  if (release.url) {
    return (
      <a
        href={safeHref(release.url) ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="minimal-link"
        style={{
          display: "block",
          minHeight: "44px",
          paddingBlock: "8px",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div style={{ minHeight: "44px", paddingBlock: "8px" }}>{content}</div>
  );
}

// -----------------------------------------------------------------------------
// Shows Component (Section 6.3)
// -----------------------------------------------------------------------------

function MinimalShows({ items }: { items: ShowItem[] }) {
  // Show max 5 upcoming shows
  const shows = items.slice(0, 5);

  return (
    <MinimalSection title="Shows">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: TOKENS.space[3],
        }}
      >
        {shows.map((show, index) => (
          <li key={index}>
            <MinimalShowRow show={show} />
          </li>
        ))}
      </ul>
    </MinimalSection>
  );
}

function MinimalShowRow({ show }: { show: ShowItem }) {
  const dateFormatted = formatShowDate(show.date);

  const content = (
    <span
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: TOKENS.space[2],
      }}
    >
      <span
        style={{
          fontSize: TOKENS.metaSize,
          fontWeight: TOKENS.metaWeight,
          color: TOKENS.fgMuted,
          fontFeatureSettings: "'tnum'",
          minWidth: "90px",
        }}
      >
        {dateFormatted}
      </span>
      <span
        style={{
          fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
          fontWeight: TOKENS.bodyWeight,
          color: TOKENS.fg,
        }}
      >
        {show.city}
      </span>
      {show.venue && (
        <span
          style={{
            fontSize: TOKENS.metaSize,
            color: TOKENS.fgMuted,
          }}
        >
          · {show.venue}
        </span>
      )}
    </span>
  );

  if (show.url) {
    return (
      <a
        href={safeHref(show.url) ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="minimal-link"
        style={{
          display: "block",
          minHeight: "44px",
          paddingBlock: "8px",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div style={{ minHeight: "44px", paddingBlock: "8px" }}>{content}</div>
  );
}

// -----------------------------------------------------------------------------
// Videos Component (Section 6.4)
// Text links only - no embeds, no thumbnails
// -----------------------------------------------------------------------------

function MinimalVideos({
  items,
}: {
  items: { title: string; url: string }[];
}) {
  return (
    <MinimalSection title="Videos">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: TOKENS.space[3],
        }}
      >
        {items.map((video, index) => (
          <li key={index}>
            <a
              href={safeHref(video.url) ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="minimal-link"
              style={{
                display: "block",
                minHeight: "44px",
                paddingBlock: "8px",
                fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
                fontWeight: TOKENS.bodyWeight,
                color: TOKENS.fg,
                textDecoration: "none",
              }}
            >
              {video.title}
            </a>
          </li>
        ))}
      </ul>
    </MinimalSection>
  );
}

// -----------------------------------------------------------------------------
// Links Component (Section 6.5)
// Simple vertical list - no icons, no pills
// -----------------------------------------------------------------------------

function MinimalLinks({ items }: { items: LinkItem[] }) {
  return (
    <MinimalSection title="Links">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: TOKENS.space[3],
        }}
      >
        {items.map((link, index) => (
          <li key={index}>
            <a
              href={safeHref(link.url) ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="minimal-link"
              style={{
                display: "block",
                minHeight: "44px",
                paddingBlock: "8px",
                fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
                fontWeight: TOKENS.bodyWeight,
                color: TOKENS.fg,
                textDecoration: "none",
              }}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </MinimalSection>
  );
}

// -----------------------------------------------------------------------------
// Contact Component (Section 6.6)
// Action links only - NO visible email addresses, NO phone numbers
// Labels link to mailto: URLs, email never shown in text
// -----------------------------------------------------------------------------

function MinimalContact({
  contacts,
  handle,
}: {
  contacts?: ContactItem[];
  handle: string;
}) {
  const validContacts = contacts?.filter((c) => c.label) ?? [];
  if (validContacts.length === 0) return null;

  const handleContactClick = async (contact: ContactItem) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(
        `${API_BASE}/api/v1/p/${encodeURIComponent(handle)}/contact/${encodeURIComponent(contact.label)}`,
      );
      if (!res.ok) return;
      const json = await res.json();
      const url: string | undefined = json?.data?.url;
      if (!url) return;
      if (contact.type === "whatsapp") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = url;
      }
    } catch {
      // silently ignore
    }
  };

  return (
    <MinimalSection title="Contact">
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: TOKENS.space[3],
        }}
      >
        {validContacts.map((contact, index) => (
          <li key={index}>
            {/* Only the label is visible - contact resolved server-side on click */}
            <button
              type="button"
              onClick={() => handleContactClick(contact)}
              className="minimal-link"
              style={{
                display: "block",
                minHeight: "44px",
                paddingBlock: "8px",
                fontSize: `clamp(${TOKENS.bodySizeSm}, 2vw, ${TOKENS.bodySize})`,
                fontWeight: TOKENS.bodyWeight,
                color: TOKENS.fg,
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {contact.label}
            </button>
          </li>
        ))}
      </ul>
    </MinimalSection>
  );
}

// -----------------------------------------------------------------------------
// Footer Component
// Minimal - just copyright
// -----------------------------------------------------------------------------

function MinimalFooter({ displayName }: { displayName: string }) {
  return (
    <footer
      style={{
        maxWidth: TOKENS.containerMax,
        marginInline: "auto",
        paddingInline: `clamp(${TOKENS.padMobile}, 5vw, ${TOKENS.padDesktop})`,
        paddingTop: TOKENS.space[6],
        paddingBottom: TOKENS.space[5],
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: TOKENS.fgDim,
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} {displayName}
      </p>

      {/* Global styles for hover states */}
      <style>{`
        .minimal-link {
          transition: none;
        }
        .minimal-link:hover {
          text-decoration: underline;
          text-underline-offset: 0.15em;
          text-decoration-thickness: 1px;
          color: ${TOKENS.linkHover};
        }
        .minimal-link:focus {
          outline: 2px solid ${TOKENS.focus};
          outline-offset: 2px;
        }
      `}</style>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatShowDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
}
