export default function StudioLinksPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Füge Links zu deiner Musik, Social Media oder anderen Projekten hinzu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-300">Deine Links</h2>
              <button className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
                + Neuer Link
              </button>
            </div>

            <div className="space-y-3">
              {/* Empty State */}
              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <p className="text-xs text-zinc-600 mb-2">Noch keine Links hinzugefügt</p>
                <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  Ersten Link hinzufügen
                </button>
              </div>

              {/* TODO: Link List */}
              {/* <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-100">Spotify</p>
                    <p className="text-xs text-zinc-500 truncate">https://spotify.com/artist/...</p>
                  </div>
                  <button className="text-xs text-zinc-500 hover:text-zinc-300">↑</button>
                  <button className="text-xs text-zinc-500 hover:text-zinc-300">↓</button>
                  <button className="text-xs text-zinc-500 hover:text-red-400">✕</button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 h-full">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
              <span className="text-xs text-zinc-500">Live Preview</span>
            </div>
            
            <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-center">
              <p className="text-xs text-zinc-600">
                Deine Links werden hier angezeigt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
