// -----------------------------------------------------------------------------
// Public page shared types
// -----------------------------------------------------------------------------

export type LinkItem = {
  type?: string;
  title: string;
  url: string;
};

export type ShowItem = {
  title: string;
  venue: string;
  city: string;
  address?: string | null;
  date: string;
  time?: string;
  price?: number | null;
  is_free?: boolean;
  support_acts?: string[];
  url?: string;
  flyer_url?: string | null;
};

export type ReleaseItem = {
  title: string;
  cover_url?: string;
  url?: string;
  release_date?: string;
  release_type?: string;
  is_featured?: boolean;
};

export type FeaturedTrackItem = {
  title: string;
  artist_name: string | null;
  platform:
    | "spotify"
    | "youtubemusic"
    | "soundcloud";
  platform_url: string;
  embed_id: string | null;
};

export type VideoItem = {
  title: string;
  platform: "youtube" | "vimeo";
  video_id: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_featured?: boolean;
};

export type GalleryImageItem = {
  title?: string | null;
  image_url: string;
};

export type SpotlightItem = {
  title: string;
  type: string;
  primary_url: string;
  cover_image_url?: string | null;
  subtitle?: string | null;
  description?: string | null;
  cta_label?: string | null;
  secondary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  background_image_url?: string | null;
  meta?: Record<string, unknown> | null;
};

export type ContactItem = {
  label: string;
  type: "email" | "whatsapp";
  value?: string;
};

export type PublicArtistPageData = {
  handle: string;
  display_name: string;
  bio: string | null;
  is_published?: boolean;
  active_spotlight?: SpotlightItem | null;
  visible_sections?: string[];
  images: {
    avatar_url: string | null;
    hero_image_url: string | null;
    logo_url?: string | null;
    hero_focal_x?: number | null;
    hero_focal_y?: number | null;
  };
  focus?: {
    type: "links" | "shows" | "releases";
    limit: number;
  };
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
  featured_tracks: FeaturedTrackItem[];
  videos?: VideoItem[];
  gallery_images?: GalleryImageItem[];
  contacts?: ContactItem[];
  contact_message?: string | null;
  theme?: {
    key: string | null;
    variant: string | null;
  };
};
