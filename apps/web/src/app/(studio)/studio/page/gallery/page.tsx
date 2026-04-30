import { redirect } from "next/navigation";
import { fetchStudioGalleryImages } from "@/lib/api/studio-page.server";
import GalleryClient from "../../gallery/GalleryClient";

export default async function PageGalleryPage() {
  const images = await fetchStudioGalleryImages();

  return <GalleryClient initialImages={images} />;
}
