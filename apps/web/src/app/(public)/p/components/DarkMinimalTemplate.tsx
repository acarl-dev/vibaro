import {
  PublicArtistPageData,
  Hero,
  FocusSection,
  Section,
  LinkList,
  ShowList,
  ReleaseList,
  Footer,
  getSectionTitle,
  getFocusItems,
  getOptionalSections,
} from "./shared";

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

        {/* Optional Sections - minimal spacing */}
        {optionalSections.map((section) => (
          <Section key={section.type} title={getSectionTitle(section.type)}>
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
