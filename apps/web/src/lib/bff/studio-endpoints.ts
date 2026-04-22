export const studioEndpoints = {
  spotlights: () => "/api/v1/spotlights",
  spotlightById: (id: string) => `/api/v1/spotlights/${id}`,
  spotlightActive: () => "/api/v1/spotlights/active",
  spotlightFetchMetadata: (url: string) =>
    `/api/v1/spotlights/fetch-metadata?url=${encodeURIComponent(url)}`,
  spotlightActivate: (id: string) => `/api/v1/spotlights/${id}/activate`,
  spotlightEnd: (id: string) => `/api/v1/spotlights/${id}/end`,
  spotlightArchive: (id: string) => `/api/v1/spotlights/${id}/archive`,
  spotlightRestore: (id: string) => `/api/v1/spotlights/${id}/restore`,
};
