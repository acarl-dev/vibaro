import { redirect } from "next/navigation";
import { fetchArtistPage, fetchArtistPageLinks } from "@/lib/api/studio-page.server";
import LinksClient from "../../links/LinksClient";

export default async function PageLinksPage() {
  const page = await fetchArtistPage();
  if (!page) {
    redirect("/studio/onboarding");
  }

  const links = await fetchArtistPageLinks();

  return <LinksClient initialLinks={links} />;
}
