export default function StudioProfilePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bearbeite deine Profil-Informationen und Bilder.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Basis-Informationen</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-xs font-medium text-zinc-400 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-medium text-zinc-400 mb-1">
                  Bio * <span className="text-zinc-600">(max. 300 Zeichen)</span>
                </label>
                <textarea
                  id="bio"
                  rows={5}
                  maxLength={300}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
                  placeholder="Erzähl kurz über dich..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Bilder</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Hero Image <span className="text-zinc-600">(bevorzugt)</span>
                </label>
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  <p className="text-xs text-zinc-600 mb-2">Kein Bild hochgeladen</p>
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Bild hinzufügen (TODO)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Avatar <span className="text-zinc-600">(Fallback, wenn kein Hero)</span>
                </label>
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                  <p className="text-xs text-zinc-600 mb-2">Kein Bild hochgeladen</p>
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Bild hinzufügen (TODO)
                  </button>
                </div>
              </div>
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
                Änderungen werden hier sofort sichtbar (TODO: Live Preview)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
