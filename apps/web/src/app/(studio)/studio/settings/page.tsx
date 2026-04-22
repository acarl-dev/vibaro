import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";
import { backendFetch } from "@/lib/api/backend";

type ArtistPage = {
  handle: string;
  is_published: boolean;
};

async function fetchArtistPage(): Promise<ArtistPage | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    return {
      handle: data.handle,
      is_published: Boolean(data.is_published),
    };
  } catch {
    return null;
  }
}

export default async function StudioSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio/settings");
  }

  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine Seite und dein Konto
        </p>
      </div>

      <SettingsClient handle={page.handle} isPublished={page.is_published} />
    </div>
  );
}
