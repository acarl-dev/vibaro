/**
 * Client-side API for Tracking Links
 * Used in "use client" components
 */

export type TrackingLinkData = {
  id: number;
  short_code: string;
  slug?: string;
  module?: string;
  spotlight_id: number;
  spotlight_title?: string;
  campaign_id?: number;
  campaign_name?: string;
  platform: string;
  placement: string;
  label: string;
  tracking_url: string;
  target_url: string;
  click_count: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  is_active?: boolean;
  created_at: string;
};

export type CreateTrackingLinkRequest = {
  spotlight_id: number;
  platform: string;
  placement: string;
  target_url: string;
  label?: string; // Optional, auto-generated if not provided
};

/**
 * Fetch all tracking links for current user
 */
export async function fetchTrackingLinks(): Promise<TrackingLinkData[]> {
  try {
    const res = await fetch("/api/studio/tracking-links", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch tracking links:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("Error fetching tracking links:", error);
    return [];
  }
}

/**
 * Check if a tracking link exists for given spotlight/platform/placement
 */
export async function checkTrackingLinkExists(
  spotlightId: number,
  platform: string,
  placement: string
): Promise<TrackingLinkData | null> {
  const links = await fetchTrackingLinks();
  
  const existing = links.find(
    (link) =>
      link.spotlight_id === spotlightId &&
      link.platform === platform &&
      link.placement === placement
  );

  return existing || null;
}

/**
 * Create a new tracking link
 */
export async function createTrackingLink(
  data: CreateTrackingLinkRequest
): Promise<{ success: boolean; data?: TrackingLinkData; error?: string }> {
  try {
    const res = await fetch("/api/studio/tracking-links", {
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
        error: json?.error?.message || "Fehler beim Erstellen des Links",
      };
    }

    return {
      success: true,
      data: json?.data,
    };
  } catch (error) {
    console.error("Error creating tracking link:", error);
    return {
      success: false,
      error: "Netzwerkfehler. Bitte versuche es erneut.",
    };
  }
}

/**
 * Delete a tracking link (archives it)
 */
export async function deleteTrackingLink(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/studio/tracking-links/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        error: json?.error?.message || "Fehler beim Löschen des Links",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting tracking link:", error);
    return {
      success: false,
      error: "Netzwerkfehler. Bitte versuche es erneut.",
    };
  }
}
