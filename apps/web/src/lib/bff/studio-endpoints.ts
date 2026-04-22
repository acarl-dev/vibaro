export const studioEndpoints = {
  // ─── Spotlights ─────────────────────────────────────────────────────────────
  spotlights: () => "/api/v1/spotlights",
  spotlightById: (id: string) => `/api/v1/spotlights/${id}`,
  spotlightActive: () => "/api/v1/spotlights/active",
  spotlightFetchMetadata: (url: string) =>
    `/api/v1/spotlights/fetch-metadata?url=${encodeURIComponent(url)}`,
  spotlightActivate: (id: string) => `/api/v1/spotlights/${id}/activate`,
  spotlightEnd: (id: string) => `/api/v1/spotlights/${id}/end`,
  spotlightArchive: (id: string) => `/api/v1/spotlights/${id}/archive`,
  spotlightRestore: (id: string) => `/api/v1/spotlights/${id}/restore`,

  // ─── Artist Pages ────────────────────────────────────────────────────────────
  artistPages: () => "/api/v1/artist-pages",
  artistPageById: (id: number | string) => `/api/v1/artist-pages/${id}`,
  artistPagePublish: (id: number | string) =>
    `/api/v1/artist-pages/${id}/publish`,
  artistPageUnpublish: (id: number | string) =>
    `/api/v1/artist-pages/${id}/unpublish`,
  artistPageUploadHero: () => "/api/v1/artist-pages/upload-hero",
  artistPageUploadLogo: () => "/api/v1/artist-pages/upload-logo",
  artistPageUploadAvatar: () => "/api/v1/artist-pages/upload-avatar",
  artistPageDeleteHero: () => "/api/v1/artist-pages/delete-hero",
  artistPageDeleteLogo: () => "/api/v1/artist-pages/delete-logo",
  artistPageDeleteAvatar: () => "/api/v1/artist-pages/delete-avatar",
  artistPageUpdateHeroFocal: () => "/api/v1/artist-pages/update-hero-focal",

  // ─── Releases ────────────────────────────────────────────────────────────────
  releases: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/releases`,
  releaseById: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/releases/${id}`,
  releaseUploadCover: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/releases/${id}/upload-cover`,
  releaseDeleteCover: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/releases/${id}/cover`,

  // ─── Shows ───────────────────────────────────────────────────────────────────
  shows: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/shows`,
  showById: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/shows/${id}`,
  showUploadFlyer: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/shows/${id}/upload-flyer`,
  showDeleteFlyer: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/shows/${id}/flyer`,

  // ─── Links ───────────────────────────────────────────────────────────────────
  links: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/links`,
  linkById: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/links/${id}`,
  linksReorder: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/links/reorder`,

  // ─── Featured Tracks ─────────────────────────────────────────────────────────
  featuredTracks: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/featured-tracks`,
  featuredTrackById: (artistPageId: number, id: string) =>
    `/api/v1/artist-pages/${artistPageId}/featured-tracks/${id}`,
  featuredTracksReorder: (artistPageId: number) =>
    `/api/v1/artist-pages/${artistPageId}/featured-tracks/reorder`,

  // ─── Videos ──────────────────────────────────────────────────────────────────
  videos: () => "/api/v1/studio/videos",
  videoById: (id: string) => `/api/v1/studio/videos/${id}`,
  videoFeatured: (id: string) => `/api/v1/studio/videos/${id}/featured`,
  videosReorder: () => "/api/v1/studio/videos/reorder",

  // ─── Gallery ─────────────────────────────────────────────────────────────────
  gallery: () => "/api/v1/studio/gallery",
  galleryById: (id: string) => `/api/v1/studio/gallery/${id}`,
  galleryReorder: () => "/api/v1/studio/gallery/reorder",

  // ─── Tracking Links ──────────────────────────────────────────────────────────
  trackingLinks: () => "/api/v1/tracking-links",
  trackingLinkById: (id: string) => `/api/v1/tracking-links/${id}`,

  // ─── Handles ─────────────────────────────────────────────────────────────────
  handlesCheck: () => "/api/v1/handles/check",

  // ─── Analytics ───────────────────────────────────────────────────────────────
  analyticsBreakdown: (searchParams?: string) =>
    `/api/v1/analytics/breakdown${searchParams ? `?${searchParams}` : ""}`,
};
