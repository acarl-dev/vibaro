import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
};

async function fetchArtistPage(token: string): Promise<ArtistPage | null> {
  if (!API_BASE_URL) return null;

  const res = await fetch(`${API_BASE_URL}/api/v1/artist-pages/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;
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
  };
}

export default async function StudioHomePage() {
  if (!API_BASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold tracking-tight">Studio nicht verfügbar</h1>
          <p className="text-sm text-zinc-400">
            Die API Basis-URL ist nicht konfiguriert. Bitte prüfe die Umgebungsvariable
            <span className="font-mono"> NEXT_PUBLIC_API_BASE_URL</span>.
          </p>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio");
  }

  const page = await fetchArtistPage(token);

  // Wenn noch keine Artist Page existiert, direkt in das Onboarding schicken
  if (!page) {
    redirect("/studio/onboarding");
  }

  const statusLabel = page.is_published ? "Veröffentlicht" : "Entwurf";
  const statusClasses = page.is_published
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
    : "border-zinc-700 bg-zinc-900/70 text-zinc-300";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-tight">vibaro</div>

          <div className="flex items-center gap-4 text-sm">
            <div
              className={`${statusClasses} inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  page.is_published ? "bg-emerald-400" : "bg-zinc-500"
                }`}
              />
              <span>{statusLabel}</span>
            </div>

            <a
              href={`/p/${page.handle}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
            >
              Vorschau
            </a>

            {/* Publish-Button: tatsächliche Publish-Logik folgt separat */}
            <button
              type="button"
              className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
              disabled
            >
              Veröffentlichen
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex max-w-6xl gap-8 px-6 pb-10 pt-6">
        {/* Linke Spalte: Editor-Navigation */}
        <aside className="w-52 shrink-0 border-r border-zinc-900/80 pr-6 pt-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Deine Seite</p>
            <p className="mt-1 text-sm font-medium text-zinc-100 truncate">{page.display_name}</p>
            <p className="text-xs text-zinc-500">/@{page.handle}</p>
          </div>

          <nav className="space-y-1 text-sm">
            <button className="flex w-full items-center justify-between rounded-full bg-zinc-900 px-3 py-2 text-left font-medium text-zinc-50">
              <span>Profil</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
              <span>Shows</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
              <span>Releases</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
              <span>Links</span>
            </button>
            <button className="mt-2 flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Rechte Spalte: Live Preview / Arbeitsfläche */}
        <section className="flex-1 pt-4">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Studio</h1>
              <p className="mt-1 text-xs text-zinc-500">
                Ruhige Arbeitsfläche für deine Vibaro-Seite. Links bearbeitest du die Inhalte, rechts siehst du das Ergebnis.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-4">
            {page.is_published ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3 text-xs text-zinc-400">
                  <span>Live-Vorschau deiner öffentlichen Seite</span>
                  <span className="font-mono text-[11px] text-zinc-500">/p/{page.handle}</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-900 bg-black">
                  <iframe
                    src={`/p/${page.handle}`}
                    title={`Vorschau von ${page.display_name}`}
                    className="h-[640px] w-full border-0"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-[420px] flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm font-medium text-zinc-100">Deine Vorschau ist fast bereit.</p>
                <p className="max-w-sm text-xs text-zinc-500">
                  Sobald du deine Seite veröffentlichst, siehst du hier eine Live-Vorschau deiner öffentlichen Seite unter
                  <span className="font-mono"> /p/{page.handle}</span>.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
