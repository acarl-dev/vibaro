import { redirect } from "next/navigation";
import { fetchStudioVideos } from "@/lib/api/studio-page.server";
import VideosClient from "../../videos/VideosClient";

export default async function PageVideosPage() {
  const videos = await fetchStudioVideos();

  return <VideosClient initialVideos={videos} />;
}
