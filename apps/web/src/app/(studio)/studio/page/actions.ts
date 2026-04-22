"use server";

import { backendFetch } from "@/lib/api/backend";
import { revalidatePath } from "next/cache";

export async function togglePublishAction(pageId: number, currentlyPublished: boolean) {
  try {
    const endpoint = currentlyPublished
      ? `/api/v1/artist-pages/${pageId}/unpublish`
      : `/api/v1/artist-pages/${pageId}/publish`;

    const res = await backendFetch(endpoint, {
      method: "POST",
    });

    if (!res.ok) {
      const json = await res.json();
      return {
        success: false,
        error: json?.message || "Fehler beim Veröffentlichen",
      };
    }

    revalidatePath("/studio/page");
    return { success: true };
  } catch (error) {
    console.error("Publish error:", error);
    return {
      success: false,
      error: "Fehler beim Veröffentlichen",
    };
  }
}

export async function updateVisibleSectionsAction(
  pageId: number,
  sections: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await backendFetch(`/api/v1/artist-pages/${pageId}/sections`, {
      method: "PATCH",
      body: JSON.stringify({ visible_sections: sections }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { success: false, error: json?.message || "Fehler beim Aktualisieren" };
    }

    revalidatePath("/studio/page");
    return { success: true };
  } catch (error) {
    console.error("updateVisibleSections error:", error);
    return { success: false, error: "Fehler beim Aktualisieren" };
  }
}
