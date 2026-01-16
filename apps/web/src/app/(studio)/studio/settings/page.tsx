import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ArtistPage = {
  handle: string;
  is_published: boolean;
};

async function fetchArtistPage(token: string): Promise<ArtistPage | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/artist-pages/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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

  const page = await fetchArtistPage(token);

  if (!page) {
    redirect("/studio/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine Seiten-Einstellungen und dein Konto.
        </p>
      </div>

      <div className="space-y-6">
        <SettingsClient handle={page.handle} isPublished={page.is_published} />
      </div>
    </div>
  );
}
