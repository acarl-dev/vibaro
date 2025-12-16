import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type LinkItem = {
  title: string;
  url: string;
};

type ShowItem = {
  title: string;
  venue: string;
  date: string;
  url?: string;
};

type ReleaseItem = {
  title: string;
  cover_url?: string;
  url?: string;
  release_date?: string;
};

type PublicArtistPageData = {
  handle: string;
  display_name: string;
  bio: string | null;
  images: {
    avatar_url: string | null;
    hero_image_url: string | null;
  };
  focus?: {
    type: "links" | "shows" | "releases";
    limit: number;
  };
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
  theme?: {
    key: string | null;
    variant: string | null;
  };
};

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function fetchPublicPage(handle: string): Promise<PublicArtistPageData | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/p/${handle}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const page = await fetchPublicPage(handle);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: `${page.display_name} | Vibaro`,
    description: page.bio ?? `${page.display_name} on Vibaro`,
  };
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function PublicArtistPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const page = await fetchPublicPage(handle);

  if (!page) {
    notFound();
  }

  // Default focus for MVP (Free plan = links)
  const focus = page.focus ?? { type: "links" as const, limit: 3 };
  const focusType = focus.type;
  const focusLimit = focus.limit;

  // Get focus items
  const focusItems = getFocusItems(page, focusType, focusLimit);

  // Get optional sections (max 2, excluding focus type, only if has items)
  const optionalSections = getOptionalSections(page, focusType);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <Hero page={page} />

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 pb-20">
        {/* Focus Section (always rendered) */}
        <FocusSection
          type={focusType}
          items={focusItems}
          links={page.links}
          shows={page.shows}
          releases={page.releases}
        />

        {/* Optional Sections (max 2) */}
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

// -----------------------------------------------------------------------------
// Hero Component
// -----------------------------------------------------------------------------

function Hero({ page }: { page: PublicArtistPageData }) {
  const hasHeroImage = !!page.images.hero_image_url;
  const hasAvatar = !!page.images.avatar_url;

  return (
    <header className="relative pt-16 pb-12 px-6">
      {/* Hero Image Background */}
      {hasHeroImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={page.images.hero_image_url!}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        </div>
      )}

      {/* Hero Placeholder Background (no hero image) */}
      {!hasHeroImage && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950" />
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        {/* Avatar (only if no hero image) */}
        {!hasHeroImage && hasAvatar && (
          <div className="mb-8 flex justify-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-zinc-800">
              <Image
                src={page.images.avatar_url!}
                alt={page.display_name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Avatar Placeholder (no hero, no avatar) */}
        {!hasHeroImage && !hasAvatar && (
          <div className="mb-8 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-700">
              <span className="text-3xl text-zinc-500">
                {getInitials(page.display_name)}
              </span>
            </div>
          </div>
        )}

        {/* Display Name */}
        <h1 className="text-4xl font-semibold tracking-tight text-center leading-tight md:text-5xl">
          {page.display_name}
        </h1>

        {/* Bio */}
        {page.bio && (
          <p className="mt-4 text-center text-zinc-400 text-base leading-relaxed max-w-lg mx-auto">
            {truncateBio(page.bio, 300)}
          </p>
        )}
      </div>
    </header>
  );
}

// -----------------------------------------------------------------------------
// Section Components
// -----------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FocusSection({
  type,
  items,
  links,
  shows,
  releases,
}: {
  type: "links" | "shows" | "releases";
  items: unknown[];
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
}) {
  const isEmpty = items.length === 0;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500 mb-4">
        {getSectionTitle(type)}
      </h2>

      {isEmpty ? (
        <EmptyState type={type} />
      ) : (
        <>
          {type === "links" && <LinkList items={links.slice(0, items.length)} />}
          {type === "shows" && <ShowList items={shows.slice(0, items.length)} />}
          {type === "releases" && <ReleaseList items={releases.slice(0, items.length)} />}
        </>
      )}
    </section>
  );
}

function EmptyState({ type }: { type: "links" | "shows" | "releases" }) {
  const messages: Record<string, string> = {
    links: "No links yet.",
    shows: "No upcoming shows.",
    releases: "No releases yet.",
  };

  return (
    <p className="text-sm text-zinc-600 py-4">
      {messages[type]}
    </p>
  );
}

// -----------------------------------------------------------------------------
// List Components
// -----------------------------------------------------------------------------

function LinkList({ items }: { items: LinkItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-3">
      {items.map((link, index) => (
        <li key={index}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-center text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800 hover:border-zinc-700"
          >
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ShowList({ items }: { items: ShowItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-3">
      {items.map((show, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-100 truncate">{show.title}</p>
            <p className="text-xs text-zinc-500 truncate">{show.venue}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <time className="text-xs text-zinc-500">{formatDate(show.date)}</time>
            {show.url && (
              <a
                href={show.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Tickets
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReleaseList({ items }: { items: ReleaseItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {items.map((release, index) => (
        <li key={index}>
          <a
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-colors hover:border-zinc-700"
          >
            {release.cover_url ? (
              <div className="relative aspect-square w-full">
                <Image
                  src={release.cover_url}
                  alt={release.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-zinc-800 flex items-center justify-center">
                <span className="text-3xl text-zinc-600">♫</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-medium text-zinc-100 truncate">{release.title}</p>
              {release.release_date && (
                <p className="text-xs text-zinc-500 mt-1">{release.release_date}</p>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

function Footer({ displayName }: { displayName: string }) {
  return (
    <footer className="border-t border-zinc-900 py-8 px-6">
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-zinc-600">© {displayName}</p>
        <p className="text-[10px] text-zinc-700">Vibaro</p>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getSectionTitle(type: "links" | "shows" | "releases"): string {
  const titles: Record<string, string> = {
    links: "Links",
    shows: "Shows",
    releases: "Releases",
  };
  return titles[type];
}

function getFocusItems(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases",
  limit: number
): unknown[] {
  const items =
    focusType === "links"
      ? page.links
      : focusType === "shows"
        ? page.shows
        : page.releases;
  return items.slice(0, limit);
}

function getOptionalSections(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases"
): { type: "links" | "shows" | "releases" }[] {
  // Priority: releases > shows > links
  const priority: ("links" | "shows" | "releases")[] = ["releases", "shows", "links"];
  const sections: { type: "links" | "shows" | "releases" }[] = [];

  for (const type of priority) {
    if (type === focusType) continue; // skip focus type
    if (sections.length >= 2) break; // max 2 sections

    const items =
      type === "links"
        ? page.links
        : type === "shows"
          ? page.shows
          : page.releases;

    if (items.length > 0) {
      sections.push({ type });
    }
  }

  return sections;
}

function truncateBio(bio: string, maxLength: number): string {
  if (bio.length <= maxLength) return bio;
  return bio.slice(0, maxLength).trim() + "…";
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
}
