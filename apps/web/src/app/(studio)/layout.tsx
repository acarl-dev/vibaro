import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";
import StudioHeader from "./components/StudioHeader";
import StudioSidebar from "./components/StudioSidebar";

export type ArtistPageData = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  theme_key?: string | null;
  theme_variant?: string | null;
};

async function fetchMe(): Promise<{ artist_page?: { is_onboarded: boolean } | null } | null> {
  try {
    const res = await backendFetch("/api/v1/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function fetchArtistPage(): Promise<ArtistPageData | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    return {
      id: data.id,
      handle: data.handle,
      display_name: data.display_name,
      bio: data.bio ?? null,
      is_published: Boolean(data.is_published),
      avatar_url: data.avatar_url ?? null,
      hero_image_url: data.hero_image_url ?? null,
      theme_key: data.theme_key ?? "dark-editorial",
      theme_variant: data.theme_variant ?? "auto",
    };
  } catch {
    return null;
  }
}

export default async function StudioLayout({ children }: { children: ReactNode }) {
  // Auth Guard
  const token = await getTokenFromCookies();

  if (!token) {
    redirect("/login?next=/studio");
  }

  // Check onboarding status
  const me = await fetchMe();
  if (me?.artist_page?.is_onboarded === false) {
    redirect("/studio/onboarding");
  }

  // Fetch artist page
  const page = await fetchArtistPage();
  if (!page) {
    redirect("/studio/onboarding");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <StudioHeader page={page} />
      
      <div className="mx-auto flex max-w-7xl">
        <StudioSidebar page={page} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
