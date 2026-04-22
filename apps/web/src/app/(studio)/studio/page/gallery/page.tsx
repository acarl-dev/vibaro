import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import GalleryClient from "../../gallery/GalleryClient";

type GalleryImage = {
  id: number;
  title: string | null;
  image_url: string;
  image_path: string;
  position: number;
};

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await backendFetch("/api/v1/studio/gallery", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function PageGalleryPage() {
  const images = await fetchGalleryImages();

  return <GalleryClient initialImages={images} />;
}
