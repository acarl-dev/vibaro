import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
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
      id: data.id,
      handle: data.handle,
      display_name: data.display_name,
      bio: data.bio ?? null,
      is_published: Boolean(data.is_published),
      avatar_url: data.avatar_url ?? null,
      hero_image_url: data.hero_image_url ?? null,
    };
  } catch {
    return null;
  }
}

export default async function StudioOverviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio");
  }

  const page = await fetchArtistPage(token);

  if (!page) {
    redirect("/studio/onboarding");
  }

  const isReady = !!(page.handle && page.display_name && page.bio);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Deine Seite</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bearbeite deine Inhalte und sieh dir das Ergebnis direkt an.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Profil-Basics</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-xs font-medium text-zinc-400 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="displayName"
                  defaultValue={page.display_name}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-medium text-zinc-400 mb-1">
                  Bio *
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  defaultValue={page.bio ?? ""}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
                  placeholder="Erzähl kurz über dich..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Avatar
                </label>
                <div className="text-xs text-zinc-600">
                  {page.avatar_url ? (
                    <span>Bild: {page.avatar_url.slice(0, 40)}...</span>
                  ) : (
                    <span>Kein Bild hochgeladen</span>
                  )}
                </div>
                <button className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  Bild hinzufügen (TODO)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Hero Image
                </label>
                <div className="text-xs text-zinc-600">
                  {page.hero_image_url ? (
                    <span>Bild: {page.hero_image_url.slice(0, 40)}...</span>
                  ) : (
                    <span>Kein Bild hochgeladen</span>
                  )}
                </div>
                <button className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  Bild hinzufügen (TODO)
                </button>
              </div>
            </div>
          </div>

          {/* Publishing Readiness */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Veröffentlichungs-Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {page.handle ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Handle</span>
              </div>
              <div className="flex items-center gap-2">
                {page.display_name ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Display Name</span>
              </div>
              <div className="flex items-center gap-2">
                {page.bio ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-zinc-600">✕</span>
                )}
                <span className="text-zinc-400">Bio</span>
              </div>
            </div>

            {!isReady && (
              <p className="mt-4 text-xs text-zinc-600">
                Fülle die erforderlichen Felder aus, um zu veröffentlichen.
              </p>
            )}
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 h-full">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
              <span className="text-xs text-zinc-500">Live Preview</span>
              <span className="font-mono text-[10px] text-zinc-600">/p/{page.handle}</span>
            </div>
            
            {page.is_published ? (
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
                <iframe
                  src={`/p/${page.handle}`}
                  title={`Vorschau von ${page.display_name}`}
                  className="h-[calc(100vh-14rem)] w-full border-0"
                />
              </div>
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm font-medium text-zinc-300">Vorschau noch nicht verfügbar</p>
                <p className="max-w-xs text-xs text-zinc-600">
                  Veröffentliche deine Seite, um die Live-Vorschau zu sehen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

