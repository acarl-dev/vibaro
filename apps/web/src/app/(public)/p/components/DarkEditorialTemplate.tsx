import {
  PublicArtistPageData,
  Hero,
  FocusSection,
  OptionalSectionRenderer,
  OptionalSections,
  MusicSection,
  ReleaseItem,
  FeaturedReleaseSection,
  Footer,
  getFocusItems,
  getOptionalSections,
} from "./shared";

export default function DarkEditorialTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  // MVP: Free plan = links focus by default
  const focus = page.focus ?? { type: "links" as const, limit: 3 };
  const focusType = focus.type;
  const focusLimit = focus.limit;

  // Get focus items
  const focusItems = getFocusItems(page, focusType, focusLimit);

  // Get optional sections (max 2, excluding focus type, only if has items)
  const optionalSections = getOptionalSections(page, focusType);

  // Find featured release
  const featuredRelease = page.releases.find((r: ReleaseItem) => r.is_featured);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Full-bleed Hero with overlay text */}
      <Hero page={page} />

      {/* First section: Links (directly after hero) */}
      <FocusSection
        type={focusType}
        items={focusItems}
        links={page.links}
        shows={page.shows}
        releases={page.releases}
      />

      {/* Featured Release Section */}
      {featuredRelease && <FeaturedReleaseSection release={featuredRelease} />}

      {/* Music Player Section */}
      {<MusicSection page={page} />}

      {/* Optional Sections */}
      {optionalSections.length > 0 && (
        <main className="mx-auto" style={{ maxWidth: '980px', padding: '0 clamp(16px, 4vw, 48px)' }}>
          {optionalSections.map((section) => (
            <OptionalSectionRenderer key={section.type} section={section} page={page} />
          ))}
        </main>
      )}

      {(getAvailableSections(page).hasVideos || getAvailableSections(page).hasGallery || getAvailableSections(page).hasContact) && (
        <main className="mx-auto" style={{ maxWidth: '980px', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <OptionalSections page={page} />
        </main>
      )}

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
