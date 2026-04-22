import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import ShowsClient from "../../shows/ShowsClient";

type Show = {
  id: number;
  starts_at: string;
  venue: string;
  city: string;
  address: string | null;
  ticket_url: string | null;
  price: number | null;
  is_free: boolean;
  support_acts: string[] | null;
  flyer_path: string | null;
  status: string;
};

async function fetchArtistPageId(): Promise<number | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchShows(artistPageId: number): Promise<Show[]> {
  try {
    const res = await backendFetch(`/api/v1/artist-pages/${artistPageId}/shows`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function PageShowsPage() {
  const artistPageId = await fetchArtistPageId();

  if (!artistPageId) {
    redirect("/login");
  }

  const shows = await fetchShows(artistPageId);

  return <ShowsClient initialShows={shows} />;
}
