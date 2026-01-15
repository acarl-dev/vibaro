import {
  PublicArtistPageData,
  Hero,
  FocusSection,
  Section,
  LinkList,
  ShowList,
  ReleaseList,
  VideoList,
  GalleryGrid,
  ContactSection,
  ReleaseItem,
  FeaturedReleaseSection,
  Footer,
  getSectionTitle,
  getFocusItems,
  getOptionalSections,
} from "./shared";
import MusicPlayer from "./MusicPlayer";

export default function DarkStageTemplate({
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

  const hasVideos = page.videos && page.videos.length > 0;
  const hasGallery = page.gallery_images && page.gallery_images.length > 0;
  const hasContact =
    page.booking_email || page.management_email || page.press_email || page.whatsapp_number;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero (stage style - more dramatic) */}
      <Hero page={page} />

      {/* Main Content - wider layout for stage-inspired design */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
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

        {/* Optional Sections - stage-inspired layout */}
        {optionalSections.map((section) => (
          <Section key={section.type} title={getSectionTitle(section.type === "releases" ? "Discography" : section.type)}>
            {section.type === "links" && <LinkList items={page.links} />}
            {section.type === "shows" && <ShowList items={page.shows} />}
            {section.type === "releases" && <ReleaseList items={page.releases} />}
          </Section>
        ))}

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
            <ContactSection
              booking_email={page.booking_email}
              management_email={page.management_email}
              press_email={page.press_email}
              whatsapp_number={page.whatsapp_number}
            />
          </Section>
        )}
      </main>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
