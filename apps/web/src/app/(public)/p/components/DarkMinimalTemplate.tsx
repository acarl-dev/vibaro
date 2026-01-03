import {
  PublicArtistPageData,
  Hero,
  FocusSection,
  Section,
  LinkList,
  ShowList,
  ReleaseList,
  FeaturedReleaseSection,
  Footer,
  getSectionTitle,
  getFocusItems,
  getOptionalSections,
} from "./shared";
import MusicPlayer from "./MusicPlayer";

export default function DarkMinimalTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const focus = page.focus ?? { type: "links" as const, limit: 3 };
  const focusType = focus.type;
  const focusLimit = focus.limit;

  const focusItems = getFocusItems(page, focusType, focusLimit);
  const optionalSections = getOptionalSections(page, focusType);
  const featuredRelease = page.releases.find((r: ReleaseItem) => r.is_featured);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero (minimal style - tighter spacing) */}
      <Hero page={page} />

      {/* Main Content - minimal spacing */}
      <main className="mx-auto max-w-xl px-6 pb-16">
        {/* Focus Section */}
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
        {page.featured_tracks && page.featured_tracks.length > 0 && (
          <Section title="Music">
            <MusicPlayer tracks={page.featured_tracks} />
          </Section>
        )}

        {/* Optional Sections - minimal spacing */}
        {optionalSections.map((section) => (
          <Section key={section.type} title={getSectionTitle(section.type === "releases" ? "Discography" : section.type)}>
            {section.type === "links" && <LinkList items={page.links} />}
            {section.type === "shows" && <ShowList items={page.shows} />}
            {section.type === "releases" && <ReleaseList items={page.releases} />}
          </Section>
        ))}
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
