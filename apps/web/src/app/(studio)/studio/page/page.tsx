import { redirect } from "next/navigation";
import { fetchStudioPageServerData } from "@/lib/api/studio-page.server";
import PageOverviewClient from "./PageOverviewClient";

export default async function PageEditorPage() {
  const { page, activeSpotlight } = await fetchStudioPageServerData();

  if (!page) redirect("/studio/onboarding");

  return <PageOverviewClient page={page} activeSpotlight={activeSpotlight} />;
}
