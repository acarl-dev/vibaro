import { notFound } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PublicArtistPage = {
  handle: string;
  display_name: string;
  bio: string | null;
};

async function fetchPublicPage(handle: string): Promise<PublicArtistPage | null> {
  if (!API_BASE_URL) return null;

  const res = await fetch(`${API_BASE_URL}/api/v1/p/${handle}`, {
    // public, no auth
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  const json = await res.json();
  const data = json?.data;
  if (!data) return null;

  return {
    handle: data.handle,
    display_name: data.display_name,
    bio: data.bio ?? null,
  };
}

export default async function PublicArtistPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const page = await fetchPublicPage(handle);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{page.display_name}</h1>
        {page.bio && <p className="text-sm text-zinc-300 whitespace-pre-line">{page.bio}</p>}
        <p className="text-xs text-zinc-500">/@{page.handle}</p>
      </div>
    </div>
  );
}
