import { backendFetch } from "@/lib/api/backend";
import { fetchStudioHome } from "@/lib/api/studio";
import ShareClient from "../ShareClient";

type Spotlight = {
  id: number;
  title: string;
  slug: string;
  status: string;
  primary_url?: string | null;
};

async function fetchBestSpotlight(): Promise<{ id: number; title: string; slug: string; primary_url?: string } | null> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const list = (json?.data ?? []) as Spotlight[];
    if (list.length === 0) return null;
    const priority = ["active", "scheduled"];
    let best: Spotlight | null = null;
    for (const status of priority) {
      best = list.find((s) => s.status === status) ?? null;
      if (best) break;
    }
    if (!best) best = list[0];
    return { id: best.id, title: best.title, slug: best.slug, primary_url: best.primary_url || undefined };
  } catch {
    return null;
  }
}

export default async function DistributionPage() {
  const [activeSpotlight, homeData] = await Promise.all([
    fetchBestSpotlight(),
    fetchStudioHome(),
  ]);

  const handle = homeData?.page?.handle;
  const pageUrl = handle
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/p/${handle}`
    : null;

  return <ShareClient activeSpotlight={activeSpotlight} pageUrl={pageUrl} />;
}
