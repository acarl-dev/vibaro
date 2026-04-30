import { redirect } from "next/navigation";
import { fetchShareDistributionServerData } from "@/lib/api/studio-share.server";
import ShareClient from "../ShareClient";

export default async function DistributionPage() {
  const { shouldRedirect, activeSpotlight, pageUrl } = await fetchShareDistributionServerData();
  if (shouldRedirect) redirect("/studio/share");

  return <ShareClient activeSpotlight={activeSpotlight} pageUrl={pageUrl} />;
}
