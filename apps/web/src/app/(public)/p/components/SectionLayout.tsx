import type {
  LinkItem,
  ShowItem,
  ReleaseItem,
  PublicArtistPageData,
} from "./types";
import {
  getSectionTitle,
  getAvailableSections,
} from "./helpers";
import { LinkList } from "./LinkList";
import { ShowList } from "./ShowList";
import { ReleaseList } from "./ReleaseList";
import { VideoList } from "./VideoList";
import { GalleryGrid } from "./GalleryGrid";
import { ContactInquiryButton } from "./ContactInquiryButton";
import MusicPlayer from "./MusicPlayer";
import { containerStyle, PADDING_SECTION_FULL } from "./constants";

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
// Composite Section Components
// -----------------------------------------------------------------------------

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
            contacts={page.contacts}
            contact_message={page.contact_message}
            handle={page.handle}
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
  const { isSectionVisible } = getAvailableSections(page);

  // Check if section is visible based on visible_sections
  if (!isSectionVisible(section.type)) {
    return null;
  }

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
