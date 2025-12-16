import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        {/* Handle */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">Deine Webadresse</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Handle <span className="text-zinc-600">(stabil)</span>
              </label>
              <input
                type="text"
                value={page.handle}
                disabled
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-zinc-600">
                Dein Handle bleibt stabil und kann später geändert werden.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`/p/${page.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Öffentliche Seite ansehen →
              </a>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">Konto</h2>
          
          <div className="space-y-3">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>

        {/* Publishing */}
        {page.is_published && (
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Veröffentlichung</h2>
            
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">
                Deine Seite ist aktuell veröffentlicht und unter /p/{page.handle} erreichbar.
              </p>
              
              <button
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Seite zurückziehen (Unpublish)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
