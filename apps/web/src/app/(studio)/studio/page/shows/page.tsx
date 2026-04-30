import { redirect } from "next/navigation";
import { fetchArtistPageId, fetchArtistPageShows } from "@/lib/api/studio-page.server";
import ShowsClient from "../../shows/ShowsClient";

export default async function PageShowsPage() {
  const artistPageId = await fetchArtistPageId();

  if (!artistPageId) {
    redirect("/login");
  }

  const shows = await fetchArtistPageShows(artistPageId);

  return <ShowsClient initialShows={shows} />;
}
