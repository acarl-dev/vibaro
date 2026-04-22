export type Placement = {
  id: string;
  label: string;
  description: string;
  utmMedium: string;
};

export type Platform = {
  id: string;
  label: string;
  icon: string;
  utmSource: string;
  placements: Placement[];
  copyHints: Record<string, string>;
};

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "📷",
    utmSource: "instagram",
    placements: [
      { id: "bio", label: "Bio-Link", description: "Für den Link in deiner Instagram-Bio", utmMedium: "bio" },
      { id: "story", label: "Story (Sticker)", description: "Für einen Link-Sticker in deiner Story", utmMedium: "story" },
      { id: "reel", label: "Reel-Beschreibung", description: "Für den Link in der Reel-Caption", utmMedium: "reel" },
      { id: "post", label: "Post-Beschreibung", description: "Für den Link unter einem Foto-Post", utmMedium: "post" },
    ],
    copyHints: {
      bio: "Füge den Link jetzt in deine Instagram-Bio ein. Gehe dazu auf Profil bearbeiten → Website.",
      story: "Füge einen Link-Sticker in deine Story ein und verwende diesen Link.",
      reel: "Füge den Link in die Beschreibung deines Reels ein.",
      post: "Füge den Link in die Beschreibung deines Posts ein.",
    },
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "🎵",
    utmSource: "tiktok",
    placements: [
      { id: "bio", label: "Bio-Link", description: "Für den Link in deinem TikTok-Profil", utmMedium: "bio" },
      { id: "video", label: "Video-Beschreibung", description: "Für den Link unter deinem Video", utmMedium: "video" },
      { id: "comment", label: "Angepinnter Kommentar", description: "Für einen angepinnten Kommentar", utmMedium: "comment" },
    ],
    copyHints: {
      bio: "Gehe zu deinem TikTok-Profil → Profil bearbeiten → Website.",
      video: "Füge den Link in die Beschreibung deines Videos ein.",
      comment: "Poste den Link als Kommentar und pinne ihn an.",
    },
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "▶️",
    utmSource: "youtube",
    placements: [
      { id: "description", label: "Video-Beschreibung", description: "Für die Beschreibung unter deinem Video", utmMedium: "description" },
      { id: "comment", label: "Angepinnter Kommentar", description: "Als Kommentar unter deinem Video", utmMedium: "comment" },
      { id: "about", label: "Kanal-Info", description: "Für deine Kanal-Beschreibung", utmMedium: "about" },
      { id: "shorts", label: "Shorts-Beschreibung", description: "Für ein YouTube Short", utmMedium: "shorts" },
    ],
    copyHints: {
      description: "Füge den Link in die Beschreibung deines Videos ein.",
      comment: "Poste den Link als Kommentar und pinne ihn an.",
      about: "Füge den Link in deine Kanal-Beschreibung ein (Kanal anpassen → Info).",
      shorts: "Füge den Link in die Beschreibung deines Shorts ein.",
    },
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "👥",
    utmSource: "facebook",
    placements: [
      { id: "post", label: "Beitrag", description: "Für einen Post auf deiner Seite/Profil", utmMedium: "post" },
      { id: "story", label: "Story", description: "Für einen Link in deiner Facebook-Story", utmMedium: "story" },
      { id: "reel", label: "Reel", description: "Für ein Facebook-Reel", utmMedium: "reel" },
      { id: "group", label: "Gruppen-Beitrag", description: "Für einen Post in einer Facebook-Gruppe", utmMedium: "group" },
    ],
    copyHints: {
      post: "Erstelle einen neuen Beitrag und füge den Link ein.",
      story: "Erstelle eine Story und füge den Link als Sticker hinzu.",
      reel: "Füge den Link in die Reel-Beschreibung ein.",
      group: "Teile den Link in einer passenden Facebook-Gruppe.",
    },
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: "🐦",
    utmSource: "twitter",
    placements: [
      { id: "tweet", label: "Tweet / Post", description: "Für einen einzelnen Tweet", utmMedium: "tweet" },
      { id: "bio", label: "Bio-Link", description: "Für den Link in deinem X-Profil", utmMedium: "bio" },
      { id: "thread", label: "Thread", description: "Für einen Link innerhalb eines Threads", utmMedium: "thread" },
    ],
    copyHints: {
      tweet: "Erstelle einen neuen Tweet und füge den Link ein.",
      bio: "Gehe zu deinem X-Profil → Profil bearbeiten → Website.",
      thread: "Füge den Link in einen Tweet innerhalb deines Threads ein.",
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    utmSource: "whatsapp",
    placements: [
      { id: "direct", label: "Direktnachricht", description: "Link zum Verschicken an einzelne Kontakte", utmMedium: "direct" },
      { id: "group", label: "Gruppe / Broadcast", description: "Link für eine Gruppen- oder Broadcast-Nachricht", utmMedium: "group" },
      { id: "status", label: "Status", description: "Link für deinen WhatsApp-Status", utmMedium: "status" },
    ],
    copyHints: {
      direct: "Sende diesen Link direkt an deine Kontakte.",
      group: "Teile diesen Link in deiner WhatsApp-Gruppe oder als Broadcast.",
      status: "Poste diesen Link in deinem WhatsApp-Status.",
    },
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈️",
    utmSource: "telegram",
    placements: [
      { id: "channel", label: "Kanal-Post", description: "Für einen Post in deinem Telegram-Kanal", utmMedium: "channel" },
      { id: "group", label: "Gruppen-Nachricht", description: "Für eine Nachricht in einer Telegram-Gruppe", utmMedium: "group" },
      { id: "direct", label: "Direktnachricht", description: "Zum Verschicken an einzelne Kontakte", utmMedium: "direct" },
    ],
    copyHints: {
      channel: "Poste den Link als Nachricht in deinem Telegram-Kanal.",
      group: "Teile den Link in deiner Telegram-Gruppe.",
      direct: "Sende den Link direkt an deine Kontakte.",
    },
  },
  {
    id: "email",
    label: "E-Mail",
    icon: "✉️",
    utmSource: "email",
    placements: [
      { id: "newsletter", label: "Newsletter", description: "Für deinen E-Mail-Newsletter", utmMedium: "newsletter" },
      { id: "personal", label: "Persönliche E-Mail", description: "Für eine direkte E-Mail", utmMedium: "personal" },
    ],
    copyHints: {
      newsletter: "Füge den Link in deinen nächsten Newsletter ein.",
      personal: "Füge den Link in deine E-Mail ein.",
    },
  },
  {
    id: "other",
    label: "Andere",
    icon: "🔗",
    utmSource: "other",
    placements: [
      { id: "website", label: "Website / Blog", description: "Für deine eigene Website oder einen Blog", utmMedium: "website" },
      { id: "press", label: "Pressemitteilung", description: "Für ein Presskit oder Medienmitteilung", utmMedium: "press" },
      { id: "other", label: "Sonstiges", description: "Für alles andere", utmMedium: "other" },
    ],
    copyHints: {
      website: "Füge den Link auf deiner Website oder in deinem Blog ein.",
      press: "Füge den Link in deine Pressemitteilung ein.",
      other: "Verwende diesen Link überall wo du möchtest.",
    },
  },
];

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export function getPlacement(platformId: string, placementId: string): Placement | undefined {
  return getPlatform(platformId)?.placements.find((p) => p.id === placementId);
}

export function getCopyHint(platformId: string, placementId: string): string {
  return getPlatform(platformId)?.copyHints[placementId] ?? "Link kopiert!";
}

export function formatLinkLabel(platform: string, placement: string): string {
  const p = getPlatform(platform);
  const pl = p?.placements.find((x) => x.id === placement);
  return `${p?.label ?? platform} · ${pl?.label ?? placement}`;
}

// Legacy support (kept for backwards compatibility)
export function getPlatformById(id: string): Platform | undefined {
  return getPlatform(id);
}

export function getPlacementLabel(platformId: string, placementId: string): string {
  const placement = getPlacement(platformId, placementId);
  return placement?.label || placementId;
}
