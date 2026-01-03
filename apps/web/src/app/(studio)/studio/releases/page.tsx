import Link from "next/link";

export default function StudioReleasesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Releases</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Präsentiere deine Alben, EPs und Singles.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <div className="text-center py-12">
          <p className="text-sm text-zinc-600">Noch keine Releases hinzugefügt</p>
          <button className="mt-4 rounded-lg bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200">
            + Neues Release
          </button>
        </div>
      </div>
    </div>
  );
}
