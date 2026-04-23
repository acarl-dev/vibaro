import type {
  LinkItem,
  ShowItem,
  ReleaseItem,
  PublicArtistPageData,
} from "./types";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function getSectionTitle(type: "links" | "shows" | "releases" | "Discography"): string {
  const titles: Record<string, string> = {
    links: "Links",
    shows: "Shows",
    releases: "Releases",
    Discography: "Discography",
  };
  return titles[type];
}

export function getFocusItems(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases",
  limit: number
): LinkItem[] | ShowItem[] | ReleaseItem[] {
  const items =
    focusType === "links"
      ? page.links
      : focusType === "shows"
        ? page.shows
        : page.releases;
  return items.slice(0, limit);
}

export function getOptionalSections(
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

/**
 * Setup focus configuration with defaults
 */
export function setupFocus(page: PublicArtistPageData) {
  const focus = page.focus ?? { type: "links" as const, limit: 3 };
  const focusType = focus.type;
  const focusLimit = focus.limit;
  const focusItems = getFocusItems(page, focusType, focusLimit);

  return {
    type: focusType,
    limit: focusLimit,
    items: focusItems,
  };
}

/**
 * Checks which optional sections are available
 */
export function getAvailableSections(page: PublicArtistPageData) {
  const visibleSections = page.visible_sections ?? ["profile", "links", "music", "shows", "releases", "videos", "gallery", "contact"];

  const isSectionVisible = (key: string) => visibleSections.includes(key);

  return {
    hasVideos: (page.videos?.length ?? 0) > 0 && isSectionVisible("videos"),
    hasGallery: (page.gallery_images?.length ?? 0) > 0 && isSectionVisible("gallery"),
    hasContact: (page.contacts?.length ?? 0) > 0 && isSectionVisible("contact"),
    hasMusicPlayer: (page.featured_tracks?.length ?? 0) > 0 && isSectionVisible("music"),
    hasLinks: (page.links?.length ?? 0) > 0 && isSectionVisible("links"),
    hasShows: (page.shows?.length ?? 0) > 0 && isSectionVisible("shows"),
    hasReleases: (page.releases?.length ?? 0) > 0 && isSectionVisible("releases"),
    isSectionVisible,
  };
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Filter out past shows
export function getUpcomingShows(shows: ShowItem[]): ShowItem[] {
  const now = new Date();
  return shows.filter(show => {
    const showDate = new Date(show.date);
    return showDate >= now;
  });
}

export function formatDate(dateString: string): string {
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
