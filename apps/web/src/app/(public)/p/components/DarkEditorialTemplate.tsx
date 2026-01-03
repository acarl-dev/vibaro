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

      {/* Optional Sections */}
      {optionalSections.length > 0 && (
        <main className="mx-auto" style={{ maxWidth: '980px', padding: '0 clamp(16px, 4vw, 48px)' }}>
          {optionalSections.map((section) => (
            <Section key={section.type} title={getSectionTitle(section.type)}>
              {section.type === "links" && <LinkList items={page.links} />}
              {section.type === "shows" && <ShowList items={page.shows} />}
              {section.type === "releases" && <ReleaseList items={page.releases} />}
            </Section>
          ))}
        </main>
      )}

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
