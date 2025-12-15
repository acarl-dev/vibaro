export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-xl font-semibold tracking-tight">vibaro</div>
          <nav className="flex items-center gap-6">
            <a href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Anmelden
            </a>
            <a href="/signup" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
              Kostenlos starten
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative min-h-screen overflow-hidden pt-16">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/images/landing/hero_vibaro.jpg"
              alt="Vibaro musician page example"
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-950"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 via-30% to-transparent"></div>
            {/* Soft fade-out of hero image into page background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950"
            />
          </div>
          
          {/* Content */}
          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.01em] lg:text-7xl lg:leading-[1.05]">
                Deine Musik .
                <br />
                Ein Link. Alles drin.
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300 lg:text-2xl lg:leading-relaxed">
                Deine persönliche Musiker-Homepage. Profil, Shows & Releases – klar und ohne Aufwand.
              </p>
              <div className="mt-8">
                <a href="/signup" className="inline-block rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:scale-105 hover:bg-zinc-200">
                  Kostenlos ausprobieren
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Example Preview */}
        <section className="py-32 lg:py-40"> 
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-20 grid-cols-1 lg:grid-cols-[1fr_1.6fr]">
              {/* Left: Text */}
              <div>
                <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 lg:text-5xl">
                  So sieht deine
                  <br />
                  Seite aus.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 lg:text-xl lg:leading-relaxed">
                  Deine Musik an einem Ort. 
                  <br />
                  Klar strukturiert, sofort
                  <br />
                  verständlich —für Fans, Booker
                  <br />
                  und Veranstalter.
                </p>
              </div>
              
              {/* Right: Laptop Mockup */}
              <div className="relative lg:scale-110 lg:origin-center">
                {/* Laptop Frame */}
                <div className="relative rounded-t-xl border-[12px] border-zinc-800 bg-zinc-950 shadow-2xl">
                  {/* Screen */}
                  <div className="aspect-[16/10] overflow-hidden rounded-t-sm bg-black">
                    {/* Placeholder: Artist Page Screenshot - Replace with actual image */}
                    <div className="h-full w-full bg-zinc-950 p-8">
                      {/* Mock Artist Page Content */}
                      <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                          <div className="text-sm font-semibold">Vibaro</div>
                          <div className="text-xs text-zinc-500">Shows</div>
                        </div>
                        
                        {/* Profile Section */}
                        <div className="mt-8 flex items-start gap-6">
                          <div className="h-24 w-24 rounded-full bg-zinc-700"></div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold">Sofia Holloway</h3>
                            <p className="text-sm text-zinc-500">Musician</p>
                          </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="mt-6 flex gap-6 border-b border-zinc-800 pb-2 text-xs">
                          <div className="border-b-2 border-white pb-2">Profil</div>
                          <div className="text-zinc-500">Shows</div>
                          <div className="text-zinc-500">Releases</div>
                        </div>
                        
                        {/* Content Grid */}
                        <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-2">
                          {/* About */}
                          <div>
                            <div className="text-xs font-semibold">About</div>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                              Singer songwriter based in New York.
                              <br />
                              New album Echoes out now.
                            </p>
                          </div>
                          
                          {/* Releases */}
                          <div>
                            <div className="text-xs font-semibold">Releases</div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-8 w-8 rounded bg-zinc-700"></div>
                              <div>
                                <div className="text-xs font-medium">Echoes</div>
                                <div className="text-[10px] text-zinc-500">Released May 27, 22:38</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Shows Section */}
                        <div className="mt-4">
                          <div className="text-xs font-semibold">Upcoming Shows</div>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between rounded bg-zinc-900 p-2 text-[10px]">
                              <div>
                                <div>Berlin</div>
                                <div className="text-zinc-500">July 23, 2024</div>
                              </div>
                              <div className="text-zinc-500">Music & Frieden</div>
                            </div>
                            <div className="flex items-center justify-between rounded bg-zinc-900 p-2 text-[10px]">
                              <div>
                                <div>Hamburg</div>
                              </div>
                              <div className="text-zinc-500">Knust</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop Base */}
                <div className="relative">
                  <div className="h-2 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-xl"></div>
                  <div className="mx-auto -mt-1 h-1 w-[70%] rounded-b-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 lg:text-5xl">
              Fair & transparent
            </h2>
            <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-300">
              Kostenlos starten. Upgraden, wenn du bereit bist.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
              <div className="text-sm font-medium text-zinc-400">Free</div>
              <div className="mt-4 text-5xl font-semibold tracking-[-0.01em] text-zinc-50">€0</div>
              <div className="mt-1 text-sm text-zinc-400">für immer</div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-zinc-200">Öffentliche Musiker-Seite</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-zinc-200">Basis-Profil & Bio</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-zinc-200">Ausgewählte Themes</span>
                </li>
              </ul>
              <a href="/signup" className="mt-8 block w-full rounded-full border border-zinc-700 py-3 text-center font-medium transition-colors hover:bg-zinc-800">Jetzt starten</a>
            </div>
            <div className="rounded-2xl border-2 border-white bg-white p-8 text-zinc-950">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-zinc-800">Artist</div>
                <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">Beliebt</div>
              </div>
              <div className="mt-4 text-5xl font-semibold tracking-[-0.01em] text-zinc-950">€9</div>
              <div className="mt-1 text-sm text-zinc-600">pro Monat</div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium text-zinc-900">Alles aus Free</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium text-zinc-900">Shows & Releases</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium text-zinc-900">Alle Themes</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium text-zinc-900">Kein Vibaro-Branding</span>
                </li>
              </ul>
              <a href="/signup" className="mt-8 block w-full rounded-full bg-zinc-950 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800">Jetzt upgraden</a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 px-8 py-20 text-center lg:px-16">
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 lg:text-5xl">
              Bereit für deine eigene Seite?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300">
              Erstelle in wenigen Minuten deine persönliche Musiker-Homepage. Kostenlos, ohne Verpflichtung.
            </p>
            <a href="/signup" className="mt-10 inline-block rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:scale-105 hover:bg-zinc-200">Jetzt loslegen</a>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
            <div>© 2025 Vibaro</div>
            <div className="flex gap-6">
              <a href="/impressum" className="hover:text-zinc-300">Impressum</a>
              <a href="/datenschutz" className="hover:text-zinc-300">Datenschutz</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
