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
import PhaseHero from "@/components/public-page/PhaseHero";

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

      {/* Phase Hero — dominant spotlight section */}
      {page.active_spotlight && (
        <PhaseHero spotlight={page.active_spotlight} />
      )}

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
        {<MusicSection page={page} />}

        {/* Optional Sections - minimal spacing */}
        {optionalSections.map((section) => (
          <OptionalSectionRenderer key={section.type} section={section} page={page} />
        ))}

        {/* Videos, Gallery, Contact */}
        <OptionalSections page={page} />
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
