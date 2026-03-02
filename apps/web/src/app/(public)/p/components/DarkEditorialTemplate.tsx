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
  setupFocus,
  getOptionalSections,
} from "./shared";
import { containerStyle } from "./constants";
import PhaseHero from "@/components/public-page/PhaseHero";

export default function DarkEditorialTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  // Setup focus (MVP: Free plan = links focus by default)
  const focus = setupFocus(page);

  // Get optional sections (max 2, excluding focus type, only if has items)
  const optionalSections = getOptionalSections(page, focus.type);

  // Find featured release
  const featuredRelease = page.releases.find((r: ReleaseItem) => r.is_featured);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Full-bleed Hero with overlay text */}
      <Hero page={page} />

      {/* Phase Hero — dominant spotlight section */}
      {page.active_spotlight && (
        <PhaseHero spotlight={page.active_spotlight} />
      )}

      {/* First section: Links (directly after hero) */}
      <FocusSection
        type={focus.type}
        items={focus.items}
      />

      {/* Featured Release Section */}
      {featuredRelease && <FeaturedReleaseSection release={featuredRelease} />}

      {/* Music Player Section */}
      {<MusicSection page={page} />}

      {/* Optional Sections (max 2, excluding focus) + Videos/Gallery/Contact */}
      <main className="mx-auto" style={containerStyle()}>
        {optionalSections.map((section) => (
          <OptionalSectionRenderer key={section.type} section={section} page={page} />
        ))}
        
        <OptionalSections page={page} />
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
