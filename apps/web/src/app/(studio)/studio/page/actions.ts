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
