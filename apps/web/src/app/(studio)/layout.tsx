import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";
import StudioSidebar from "./components/StudioSidebar";
import StudioBottomNav from "./components/StudioBottomNav";
import { ToastProvider } from "@/context/ToastContext";

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

async function fetchMe(): Promise<{ data: { artist_page?: { is_onboarded: boolean } | null } | null; status: number }> {
  try {
    const res = await backendFetch("/api/v1/me", { cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status };
    const json = await res.json();
    return { data: json?.data ?? null, status: res.status };
  } catch {
    return { data: null, status: 500 };
  }
}

async function fetchArtistPage(): Promise<{ data: ArtistPageData | null; status: number }> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status };
    const json = await res.json();
    const raw = json?.data;
    if (!raw) return { data: null, status: 200 };
    return {
      data: {
        id: raw.id,
        handle: raw.handle,
        display_name: raw.display_name,
        bio: raw.bio ?? null,
        is_published: Boolean(raw.is_published),
        avatar_url: raw.avatar_url ?? null,
        hero_image_url: raw.hero_image_url ?? null,
        theme_key: raw.theme_key ?? "modern",
        theme_variant: raw.theme_variant ?? "auto",
      },
      status: 200,
    };
  } catch {
    return { data: null, status: 500 };
  }
}

export default async function StudioLayout({ children }: { children: ReactNode }) {
  const token = await getTokenFromCookies();
  if (!token) redirect("/login?next=/studio");

  const { data: me, status: meStatus } = await fetchMe();
  if (meStatus === 401 || meStatus === 403) redirect("/login?next=/studio");
  if (me?.artist_page?.is_onboarded === false) redirect("/studio/onboarding");

  const { data: page, status: pageStatus } = await fetchArtistPage();
  if (pageStatus === 401 || pageStatus === 403) redirect("/login?next=/studio");
  if (!page) redirect("/studio/onboarding");

  return (
    <ToastProvider>
      <div
        data-theme="studio"
        className="flex min-h-screen"
        style={{ background: "var(--studio-bg)", color: "var(--studio-text-primary)" }}
      >
        <StudioSidebar page={page} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
        <StudioBottomNav />
      </div>
    </ToastProvider>
  );
}
