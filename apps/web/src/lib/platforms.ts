export type Placement = {
  id: string;
  label: string;
};

export type Platform = {
  id: string;
  label: string;
  icon: string; // Emoji for now
  placements: Placement[];
  copyHints: {
    [placementId: string]: string;
  };
};

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "📷",
    placements: [
      { id: "bio", label: "Bio" },
      { id: "story", label: "Story" },
      { id: "post", label: "Post" },
      { id: "reel", label: "Reel" },
    ],
    copyHints: {
      bio: "Füge den Link in deine Instagram-Bio ein (Profil bearbeiten → Website).",
      story: "Teile den Link über Story → Link-Sticker oder Swipe-Up.",
      post: "Füge den Link in deinen Post-Text ein oder nutze Kommentare.",
      reel: "Teile den Link in der Reel-Beschreibung.",
    },
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "🎵",
    placements: [
      { id: "bio", label: "Bio" },
      { id: "video", label: "Video" },
      { id: "comment", label: "Kommentar" },
    ],
    copyHints: {
      bio: "Füge den Link in deine TikTok-Bio ein (Profil bearbeiten → Bio).",
      video: "Teile den Link in der Video-Beschreibung.",
      comment: "Poste den Link als ersten Kommentar unter deinem Video.",
    },
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "▶️",
    placements: [
      { id: "description", label: "Beschreibung" },
      { id: "comment", label: "Kommentar" },
      { id: "community", label: "Community-Post" },
    ],
    copyHints: {
      description: "Füge den Link in die Video-Beschreibung ein.",
      comment: "Pinne den Link als Kommentar unter deinem Video.",
      community: "Teile den Link in einem Community-Post.",
    },
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "👥",
    placements: [
      { id: "post", label: "Post" },
      { id: "story", label: "Story" },
      { id: "about", label: "Info-Bereich" },
    ],
    copyHints: {
      post: "Teile den Link in einem Facebook-Post.",
      story: "Teile den Link über Story mit Link-Sticker.",
      about: "Füge den Link im Info-Bereich deiner Seite hinzu.",
    },
  },
  {
    id: "twitter",
    label: "Twitter/X",
    icon: "🐦",
    placements: [
      { id: "tweet", label: "Tweet" },
      { id: "bio", label: "Bio" },
      { id: "pinned", label: "Angepinnt" },
    ],
    copyHints: {
      tweet: "Teile den Link in einem Tweet.",
      bio: "Füge den Link in deine Twitter-Bio ein.",
      pinned: "Pinne einen Tweet mit dem Link an dein Profil.",
    },
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: "🎧",
    placements: [
      { id: "artist_bio", label: "Künstler-Bio" },
      { id: "playlist", label: "Playlist" },
    ],
    copyHints: {
      artist_bio: "Füge den Link in deine Spotify-Künstler-Bio ein (über Spotify for Artists).",
      playlist: "Füge den Link in die Playlist-Beschreibung ein.",
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    placements: [
      { id: "status", label: "Status" },
      { id: "message", label: "Nachricht" },
      { id: "broadcast", label: "Broadcast" },
    ],
    copyHints: {
      status: "Teile den Link in deinem WhatsApp-Status.",
      message: "Sende den Link an deine Kontakte oder Gruppen.",
      broadcast: "Versende den Link über eine Broadcast-Liste.",
    },
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈️",
    placements: [
      { id: "channel", label: "Kanal" },
      { id: "group", label: "Gruppe" },
      { id: "bio", label: "Bio" },
    ],
    copyHints: {
      channel: "Teile den Link in deinem Telegram-Kanal.",
      group: "Teile den Link in einer Telegram-Gruppe.",
      bio: "Füge den Link in deine Telegram-Bio ein.",
    },
  },
  {
    id: "email",
    label: "E-Mail",
    icon: "📧",
    placements: [
      { id: "newsletter", label: "Newsletter" },
      { id: "signature", label: "Signatur" },
    ],
    copyHints: {
      newsletter: "Füge den Link in deinen E-Mail-Newsletter ein.",
      signature: "Füge den Link in deine E-Mail-Signatur ein.",
    },
  },
  {
    id: "other",
    label: "Andere",
    icon: "🔗",
    placements: [
      { id: "website", label: "Website" },
      { id: "forum", label: "Forum" },
      { id: "print", label: "Print" },
    ],
    copyHints: {
      website: "Füge den Link auf deiner Website ein.",
      forum: "Teile den Link in Foren oder Communities.",
      print: "Nutze den Link für Flyer, Plakate oder Print-Medien.",
    },
  },
];

/**
 * Get platform by ID
 */
export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

/**
 * Get placement label
 */
export function getPlacementLabel(platformId: string, placementId: string): string {
  const platform = getPlatformById(platformId);
  const placement = platform?.placements.find((p) => p.id === placementId);
  return placement?.label || placementId;
}

/**
 * Get copy hint for platform/placement combination
 */
export function getCopyHint(platformId: string, placementId: string): string {
  const platform = getPlatformById(platformId);
  return platform?.copyHints[placementId] || "Teile diesen Link auf deinem Kanal.";
}
