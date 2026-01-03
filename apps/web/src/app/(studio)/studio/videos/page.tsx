import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import VideosClient from "./VideosClient";

type Video = {
  id: number;
  title: string;
  platform: string;
  video_id: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  position: number;
};

async function fetchVideos(): Promise<Video[]> {
  try {
    const res = await backendFetch("/api/v1/studio/videos", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function StudioVideosPage() {
  const videos = await fetchVideos();

  return <VideosClient initialVideos={videos} />;
}
