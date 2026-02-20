import { backendFetch } from "@/lib/api/backend";
import ShareClient from "./ShareClient";

type Spotlight = {
  id: number;
  title: string;
  slug: string;
  status: string;
  primary_url?: string | null;
};

async function fetchActiveSpotlight(): Promise<{ id: number; title: string; slug: string; primary_url?: string } | null> {
  try {
    const res = await backendFetch("/api/v1/spotlights/active", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data as Spotlight | null;
    
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      primary_url: data.primary_url || undefined,
    };
  } catch {
    return null;
  }
}

export default async function SharePage() {
  const activeSpotlight = await fetchActiveSpotlight();

  return <ShareClient activeSpotlight={activeSpotlight} />;
}
