import Link from "next/link";

export default function StudioReleasesPage() {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-12 text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">Releases</h1>
        
        <p className="text-sm text-zinc-400 mb-1">
          Releases sind im Artist Plan verfügbar.
        </p>
        <p className="text-xs text-zinc-600 mb-8">
          Präsentiere deine Alben, EPs und Singles mit Cover-Bildern.
        </p>

        <Link
          href="/pricing"
          className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-6 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
        >
          Artist Plan ansehen
        </Link>
      </div>
    </div>
  );
}
