/**
 * Client-side API for Spotlights
 * Used in "use client" components
 */

export type SpotlightType = "single" | "album" | "tour" | "event" | "video" | "merch" | "livestream" | "collab" | "studio" | "focus";
export type SpotlightStatus = "scheduled" | "active" | "ended";

export type SpotlightData = {
  id: number;
  title: string;
  slug: string;
  type: SpotlightType;
  status: SpotlightStatus;
  starts_at: string | null;
  ends_at: string | null;
  primary_url: string;
  cover_image_url: string | null;
  artist_name: string | null;
  platform_name: string | null;
  description: string | null;
  subtitle: string | null;
  cta_label: string | null;
  secondary_cta_url: string | null;
  secondary_cta_label: string | null;
  background_image_url: string | null;
  meta: Record<string, unknown> | null;
  show_on_page: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SpotlightMetadata = {
  title: string | null;
  artist_name: string | null;
  cover_image_url: string | null;
  platform_name: string | null;
  suggested_type: SpotlightType | null;
};

export type CreateSpotlightRequest = {
  title: string;
  type: SpotlightType;
  starts_at?: string | null;
  ends_at?: string | null;
  primary_url: string;
  cover_image_url?: string | null;
  artist_name?: string | null;
  platform_name?: string | null;
  description?: string | null;
  subtitle?: string | null;
  cta_label?: string | null;
  secondary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  background_image_url?: string | null;
  meta?: Record<string, unknown> | null;
  show_on_page?: boolean;
  activate?: boolean;
};

export type UpdateSpotlightRequest = Partial<Omit<CreateSpotlightRequest, "show_on_page">>;

/**
 * Fetch oEmbed metadata from a public URL (Spotify, YouTube, SoundCloud, etc.)
 */
export async function fetchSpotlightMetadata(
  url: string
): Promise<SpotlightMetadata | null> {
  try {
    const res = await fetch(
      `/api/studio/spotlights/fetch-metadata?url=${encodeURIComponent(url)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching spotlight metadata:", error);
    return null;
  }
}

/**
 * Fetch all spotlights for current user
 */
export async function fetchSpotlights(): Promise<SpotlightData[]> {
  try {
    const res = await fetch("/api/studio/spotlights", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch spotlights:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("Error fetching spotlights:", error);
    return [];
  }
}

/**
 * Fetch archived spotlights for current user
 */
export async function fetchArchivedSpotlights(): Promise<SpotlightData[]> {
  try {
    const res = await fetch("/api/studio/spotlights?archived=1", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch archived spotlights:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("Error fetching archived spotlights:", error);
    return [];
  }
}

/**
 * Fetch active spotlight
 */
export async function fetchActiveSpotlight(): Promise<SpotlightData | null> {
  try {
    const res = await fetch("/api/studio/spotlights/active", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch active spotlight:", res.status);
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching active spotlight:", error);
    return null;
  }
}

/**
 * Create a new spotlight
 */
export async function createSpotlight(
  data: CreateSpotlightRequest
): Promise<{ success: boolean; data?: SpotlightData; error?: string }> {
  try {
    const res = await fetch("/api/studio/spotlights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Erstellen der Phase",
      };
    }

    return {
      success: true,
      data: json?.data,
    };
  } catch (error) {
    console.error("Error creating spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Update an existing spotlight
 */
export async function updateSpotlight(
  id: number,
  data: UpdateSpotlightRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Aktualisieren der Phase",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Activate a spotlight (sets status to 'active', deactivates others)
 */
export async function activateSpotlight(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}/activate`, {
      method: "POST",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Aktivieren der Phase",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error activating spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * End a spotlight (sets status to 'ended')
 */
export async function endSpotlight(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}/end`, {
      method: "POST",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Beenden der Phase",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error ending spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Archive a spotlight (soft delete)
 */
export async function archiveSpotlight(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}/archive`, {
      method: "POST",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Archivieren der Phase",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error archiving spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Restore an archived spotlight
 */
export async function restoreSpotlight(
  id: number
): Promise<{ success: boolean; data?: SpotlightData; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}/restore`, {
      method: "POST",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Wiederherstellen der Phase",
      };
    }

    return {
      success: true,
      data: json?.data,
    };
  } catch (error) {
    console.error("Error restoring spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Toggle show_on_page visibility
 */
export async function toggleSpotlightVisibility(
  id: number,
  show_on_page: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ show_on_page }),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Ändern der Sichtbarkeit",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error toggling visibility:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}

/**
 * Permanently delete an archived spotlight
 */
export async function deleteSpotlight(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/spotlights/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json?.error?.message || "Fehler beim L\u00f6schen des Projekts",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting spotlight:", error);
    return {
      success: false,
      error: "Netzwerkfehler",
    };
  }
}
