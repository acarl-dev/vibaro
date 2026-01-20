import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicArtistPageData } from "../../components/shared";
import ModernTemplate from "../../components/ModernTemplate";
import StageTemplate from "../../components/StageTemplate";
import EditorialTemplate from "../../components/EditorialTemplate";
import MinimalTemplate from "../../components/MinimalTemplate";

// -----------------------------------------------------------------------------
// Preview Data - Platzhalter für kuratierte Inhalte
// -----------------------------------------------------------------------------

const PREVIEW_DATA: Record<string, PublicArtistPageData> = {
  modern: {
    handle: "preview-modern",
    display_name: "Artist Name",
    bio: "Hier steht die Bio des Artists. Ein kurzer, prägnanter Text, der die Musik und Persönlichkeit beschreibt. Maximal 2-3 Sätze, die einen Eindruck vermitteln.",
    is_published: true,
    images: {
      avatar_url: null,
      hero_image_url: "/images/preview/modern-hero.jpg",
    },
    links: [
      { title: "Spotify", url: "#", type: "spotify" },
      { title: "Apple Music", url: "#", type: "apple_music" },
      { title: "Instagram", url: "#", type: "instagram" },
      { title: "YouTube", url: "#", type: "youtube" },
    ],
    shows: [
      {
        title: "Konzert Titel",
        venue: "Venue Name",
        city: "Berlin",
        date: "2026-03-15",
        time: "20:00",
        url: "#",
      },
      {
        title: "Festival Auftritt",
        venue: "Festival Gelände",
        city: "Hamburg",
        date: "2026-04-20",
        time: "22:30",
        url: "#",
      },
      {
        title: "Club Show",
        venue: "Club Name",
        city: "München",
        date: "2026-05-10",
        time: "21:00",
        url: "#",
      },
    ],
    releases: [
      {
        title: "Album Titel",
        cover_url: "/images/preview/release-cover-1.jpg",
        url: "#",
        release_date: "2025-11-15",
        is_featured: true,
      },
      {
        title: "Single Name",
        cover_url: "/images/preview/release-cover-2.jpg",
        url: "#",
        release_date: "2025-08-01",
      },
      {
        title: "EP Titel",
        cover_url: "/images/preview/release-cover-3.jpg",
        url: "#",
        release_date: "2024-06-20",
      },
    ],
    featured_tracks: [],
    videos: [
      {
        title: "Musikvideo Titel",
        platform: "youtube",
        video_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        is_featured: true,
      },
      {
        title: "Live Session",
        platform: "youtube",
        video_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
    gallery_images: [
      { title: "Foto 1", image_url: "/images/preview/gallery-1.jpg" },
      { title: "Foto 2", image_url: "/images/preview/gallery-2.jpg" },
      { title: "Foto 3", image_url: "/images/preview/gallery-3.jpg" },
      { title: "Foto 4", image_url: "/images/preview/gallery-4.jpg" },
    ],
    booking_email: "booking@example.com",
    management_email: "management@example.com",
    press_email: "press@example.com",
  },

  stage: {
    handle: "preview-stage",
    display_name: "Band Name",
    bio: "Energiegeladene Live-Band seit 2015. Hier steht ein kurzer Text über die Band, ihre Musik und ihre Bühnenpräsenz.",
    is_published: true,
    images: {
      avatar_url: null,
      hero_image_url: "/images/preview/stage-hero.jpg",
    },
    links: [
      { title: "Spotify", url: "#", type: "spotify" },
      { title: "Bandcamp", url: "#", type: "bandcamp" },
      { title: "Instagram", url: "#", type: "instagram" },
      { title: "Merch Shop", url: "#", type: "website" },
    ],
    shows: [
      {
        title: "Headliner Show",
        venue: "Große Halle",
        city: "Berlin",
        date: "2026-02-28",
        time: "20:00",
        url: "#",
      },
      {
        title: "Support für X",
        venue: "Arena",
        city: "Köln",
        date: "2026-03-15",
        time: "19:00",
        url: "#",
      },
      {
        title: "Festival",
        venue: "Open Air Gelände",
        city: "Leipzig",
        date: "2026-06-21",
        time: "23:00",
        url: "#",
      },
      {
        title: "Club Tour",
        venue: "Underground Club",
        city: "Frankfurt",
        date: "2026-07-05",
        time: "21:00",
        url: "#",
      },
    ],
    releases: [
      {
        title: "Neues Album",
        cover_url: "/images/preview/stage-release-1.jpg",
        url: "#",
        release_date: "2025-10-01",
        is_featured: true,
      },
      {
        title: "Live Album",
        cover_url: "/images/preview/stage-release-2.jpg",
        url: "#",
        release_date: "2024-12-15",
      },
    ],
    featured_tracks: [],
    videos: [
      {
        title: "Live at Wacken",
        platform: "youtube",
        video_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        is_featured: true,
      },
      {
        title: "Offizielles Video",
        platform: "youtube",
        video_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Behind the Scenes",
        platform: "youtube",
        video_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
    gallery_images: [
      { title: "Live 1", image_url: "/images/preview/stage-gallery-1.jpg" },
      { title: "Live 2", image_url: "/images/preview/stage-gallery-2.jpg" },
      { title: "Live 3", image_url: "/images/preview/stage-gallery-3.jpg" },
      { title: "Backstage", image_url: "/images/preview/stage-gallery-4.jpg" },
    ],
    booking_email: "booking@example.com",
    management_email: "management@example.com",
  },

  editorial: {
    handle: "preview-editorial",
    display_name: "Künstlername",
    bio: "Eine bewusst gestaltete Künstlerseite. Große Typografie, viel Weißraum und starke Bilder schaffen eine ruhige, hochwertige Atmosphäre.",
    is_published: true,
    images: {
      avatar_url: "/images/preview/editorial-avatar.jpg",
      hero_image_url: "/images/preview/editorial-hero.jpg",
    },
    links: [
      { title: "Spotify", url: "#", type: "spotify" },
      { title: "Apple Music", url: "#", type: "apple_music" },
      { title: "Bandcamp", url: "#", type: "bandcamp" },
    ],
    shows: [
      {
        title: "Intimate Show",
        venue: "Kleiner Saal",
        city: "Wien",
        date: "2026-04-10",
        time: "20:00",
        url: "#",
      },
      {
        title: "Album Release",
        venue: "Konzerthaus",
        city: "Zürich",
        date: "2026-05-22",
        time: "19:30",
        url: "#",
      },
    ],
    releases: [
      {
        title: "Aktuelles Album",
        cover_url: "/images/preview/editorial-release-1.jpg",
        url: "#",
        release_date: "2025-09-01",
        is_featured: true,
      },
      {
        title: "Debut EP",
        cover_url: "/images/preview/editorial-release-2.jpg",
        url: "#",
        release_date: "2023-03-15",
      },
    ],
    featured_tracks: [],
    videos: [
      {
        title: "Musikfilm",
        platform: "vimeo",
        video_id: "123456789",
        url: "https://vimeo.com/123456789",
        is_featured: true,
      },
    ],
    gallery_images: [
      { title: "Portrait", image_url: "/images/preview/editorial-gallery-1.jpg" },
      { title: "Studio", image_url: "/images/preview/editorial-gallery-2.jpg" },
      { title: "Artwork", image_url: "/images/preview/editorial-gallery-3.jpg" },
    ],
    booking_email: "booking@example.com",
    press_email: "press@example.com",
  },

  minimal: {
    handle: "preview-minimal",
    display_name: "Name",
    bio: "Musik für den Moment. Reduktion als Haltung.",
    is_published: true,
    images: {
      avatar_url: null,
      hero_image_url: null, // Minimal funktioniert gut ohne Bild
    },
    links: [
      { title: "Bandcamp", url: "#", type: "bandcamp" },
      { title: "Soundcloud", url: "#", type: "soundcloud" },
    ],
    shows: [
      {
        title: "Performance",
        venue: "Galerie",
        city: "Berlin",
        date: "2026-03-01",
        url: "#",
      },
    ],
    releases: [
      {
        title: "Werk I",
        url: "#",
        release_date: "2025-06-01",
      },
      {
        title: "Werk II",
        url: "#",
        release_date: "2024-01-15",
      },
    ],
    featured_tracks: [],
    videos: [
      {
        title: "Visual",
        platform: "vimeo",
        video_id: "123456789",
        url: "https://vimeo.com/123456789",
      },
    ],
    booking_email: "contact@example.com",
  },
};

// Fallback für unbekannte Templates
const DEFAULT_PREVIEW = PREVIEW_DATA.modern;

// -----------------------------------------------------------------------------
// Valid Templates
// -----------------------------------------------------------------------------

const VALID_TEMPLATES = ["modern", "stage", "editorial", "minimal"];

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ template: string }>;
}): Promise<Metadata> {
  const { template } = await params;
  
  if (!VALID_TEMPLATES.includes(template)) {
    return { title: "Template nicht gefunden" };
  }

  const templateName = template.charAt(0).toUpperCase() + template.slice(1);
  
  return {
    title: `${templateName} Template Vorschau | Vibaro`,
    description: `Vorschau des ${templateName} Templates für Vibaro Artist Pages`,
    robots: "noindex, nofollow",
  };
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;

  if (!VALID_TEMPLATES.includes(template)) {
    notFound();
  }

  const previewData = PREVIEW_DATA[template] || DEFAULT_PREVIEW;

  // Template auswählen
  switch (template) {
    case "modern":
      return <ModernTemplate page={previewData} />;
    case "stage":
      return <StageTemplate page={previewData} />;
    case "editorial":
      return <EditorialTemplate page={previewData} />;
    case "minimal":
      return <MinimalTemplate page={previewData} />;
    default:
      return <ModernTemplate page={previewData} />;
  }
}
