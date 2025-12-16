import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import AppearanceClient from "./AppearanceClient";

async function fetchArtistPage() {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function AppearancePage() {
  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  return (
    <AppearanceClient
      artistPageId={page.id}
      initialThemeKey={page.theme_key || "dark-editorial"}
      initialThemeVariant={page.theme_variant || "auto"}
    />
  );
}
