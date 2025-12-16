import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type MeData = {
  artist_page?: {
    is_onboarded: boolean;
  } | null;
};

type ArtistPageData = {
  id: number;
  handle: string;
  display_name: string;
  is_published: boolean;
};

async function fetchMe(token: string): Promise<MeData | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function fetchArtistPage(token: string): Promise<ArtistPageData | null> {
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
      is_published: Boolean(data.is_published),
    };
  } catch {
    return null;
  }
}

export default async function StudioLayout({ children }: { children: ReactNode }) {
  // Auth Guard
  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio");
  }

  // Check onboarding status
  const me = await fetchMe(token);
  if (me?.artist_page?.is_onboarded === false) {
    redirect("/studio/onboarding");
  }

  // Fetch artist page for header
  const page = await fetchArtistPage(token);
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
      <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/studio" className="text-lg font-semibold tracking-tight hover:text-zinc-300 transition-colors">
            vibaro
          </Link>

          <div className="flex items-center gap-3 text-sm">
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

            <Link
              href={`/p/${page.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                page.is_published
                  ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-500 cursor-not-allowed"
              }`}
              {...(!page.is_published && {
                onClick: (e: React.MouseEvent) => e.preventDefault(),
                title: "Veröffentliche deine Seite, um die Vorschau zu sehen",
              })}
            >
              Vorschau
            </Link>

            <form action={page.is_published ? `/api/studio/artist-pages/${page.id}/unpublish` : `/api/studio/artist-pages/${page.id}/publish`} method="POST">
              <button
                type="submit"
                className="rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {page.is_published ? "Zurückziehen" : "Veröffentlichen"}
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-[73px] h-[calc(100vh-73px)] w-56 shrink-0 border-r border-zinc-900/80 p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Deine Seite</p>
            <p className="mt-1 text-sm font-medium text-zinc-100 truncate">{page.display_name}</p>
            <p className="text-xs text-zinc-500">/@{page.handle}</p>
          </div>

          <nav className="space-y-1 text-sm">
            <NavLink href="/studio">Übersicht</NavLink>
            <NavLink href="/studio/profile">Profil</NavLink>
            <NavLink href="/studio/links">Links</NavLink>
            <NavLink href="/studio/shows" locked>Shows</NavLink>
            <NavLink href="/studio/releases" locked>Releases</NavLink>
            <div className="pt-2">
              <NavLink href="/studio/settings">Einstellungen</NavLink>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, children, locked }: { href: string; children: ReactNode; locked?: boolean }) {
  // Simple active detection - in production use usePathname from client component
  const isActive = false; // TODO: implement active state

  return (
    <Link
      href={locked ? "#" : href}
      className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-left transition-colors ${
        isActive
          ? "bg-zinc-900 font-medium text-zinc-50"
          : locked
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
      }`}
      {...(locked && { onClick: (e: React.MouseEvent) => e.preventDefault() })}
    >
      <span>{children}</span>
      {locked && (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
    </Link>
  );
}
