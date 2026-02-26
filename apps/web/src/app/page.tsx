import type { Metadata } from "next";

/* ─────────────────────────────────────────────────────────
   SEO METADATA
   Next.js App Router – static metadata export (Server Component)
   Ref: Next.js docs "Metadata and OG Images"
   ───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Vibaro – Die digitale Bühne für Musiker",
  description:
    "Erstelle deine professionelle Musiker-Homepage in Minuten. Profil, Shows, Releases und Performance-Tracking – alles an einem Ort. Kostenlos starten.",
  openGraph: {
    title: "Vibaro – Die digitale Bühne für Musiker",
    description:
      "Deine Musik verdient eine eigene Bühne. Profil, Shows, Releases und Tracking – kostenlos starten.",
    url: "https://vibaro.de",
    siteName: "Vibaro",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/images/landing/og-vibaro.jpg",
        width: 1200,
        height: 630,
        alt: "Vibaro – Die digitale Bühne für Musiker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibaro – Die digitale Bühne für Musiker",
    description:
      "Deine Musik verdient eine eigene Bühne. Kostenlos starten.",
  },
  alternates: {
    canonical: "https://vibaro.de",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ─── Inline SVG icons (no extra deps) ─── */

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING PAGE (Server Component – zero client JS)
   ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ════════════════ NAVIGATION ════════════════ */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Hauptnavigation">
          <a href="/" className="text-xl font-semibold tracking-tight" aria-label="Vibaro Startseite">
            vibaro
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline">
              Features
            </a>
            <a href="#pricing" className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline">
              Preise
            </a>
            <a href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Anmelden
            </a>
            <a
              href="/register"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Kostenlos starten
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ════════════════ 1 · HERO ════════════════
            Psychologie: Emotional Hook – 3-Sekunden-Regel
            STYLEGUIDE: image-driven, one headline, one sentence, one CTA
        */}
        <section className="relative min-h-screen overflow-hidden pt-16" aria-label="Hero">
          <div className="absolute inset-0">
            <img
              src="/images/landing/hero_vibaro.jpg"
              alt="Musiker auf der Bühne – atmosphärische Live-Szene"
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 via-30% to-transparent" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950"
            />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-7xl lg:leading-[1.05]">
                Deine Musik.
                <br />
                Deine Bühne.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl lg:text-2xl lg:leading-relaxed">
                Die professionelle Homepage für Musiker&nbsp;–
                <br className="hidden sm:block" />
                mit allem, was du brauchst. In&nbsp;Minuten&nbsp;fertig.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:scale-[1.03] hover:bg-zinc-200"
                >
                  Kostenlos starten
                </a>
                <a
                  href="#preview"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  So sieht's aus
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 2 · SOCIAL PROOF BAR ════════════════
            Psychologie: Bandwagon-Effekt – Zahlen schaffen Vertrauen
        */}
        <section className="border-y border-zinc-800/50 bg-zinc-950" aria-label="Vertrauenssignale">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 px-6 py-10 sm:flex-row sm:gap-16 lg:px-8">
            <div className="text-center">
              <div className="text-2xl font-semibold text-zinc-50">500+</div>
              <div className="mt-1 text-sm text-zinc-500">Künstler-Seiten erstellt</div>
            </div>
            <div className="hidden h-8 w-px bg-zinc-800 sm:block" aria-hidden="true" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-zinc-50">100%</div>
              <div className="mt-1 text-sm text-zinc-500">Privatsphäre – kein Tracking Dritter</div>
            </div>
            <div className="hidden h-8 w-px bg-zinc-800 sm:block" aria-hidden="true" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-zinc-50">&lt; 5 Min</div>
              <div className="mt-1 text-sm text-zinc-500">bis zur fertigen Seite</div>
            </div>
          </div>
        </section>

        {/* ════════════════ 3 · PROBLEM → LÖSUNG ════════════════
            Psychologie: Pain-Agitation-Solution
        */}
        <section className="py-24 lg:py-32" aria-labelledby="problem-heading">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2
              id="problem-heading"
              className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
            >
              Deine Musik verdient mehr
              <br className="hidden sm:block" />
              als einen Linktree.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
              Social-Media-Profile reichen nicht. Booker, Fans und Veranstalter brauchen
              einen Ort, an dem alles zusammenkommt&nbsp;– Profil, Shows, Releases, Kontakt.
              Professionell und unter deiner Kontrolle.
            </p>
          </div>
        </section>

        {/* ════════════════ 4 · PRODUKT-PREVIEW ════════════════
            Psychologie: Show, don't tell – Produkt greifbar machen
        */}
        <section id="preview" className="py-20 lg:py-32" aria-labelledby="preview-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
              {/* Left: Text */}
              <div>
                <h2
                  id="preview-heading"
                  className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
                >
                  So sieht deine
                  <br />
                  Seite aus.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
                  Deine Musik an einem Ort.
                  Klar strukturiert, sofort verständlich&nbsp;–
                  für Fans, Booker und Veranstalter.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Profil mit Bio & Bild",
                    "Shows & Tourdaten",
                    "Releases mit Streaming-Links",
                    "Kontakt für Booking & Presse",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-zinc-300">
                      <CheckIcon className="h-5 w-5 shrink-0 text-zinc-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Laptop Mockup */}
              <div className="relative lg:scale-105 lg:origin-center">
                <div className="relative rounded-t-xl border-[12px] border-zinc-800 bg-zinc-950 shadow-2xl">
                  <div className="aspect-[16/10] overflow-hidden rounded-t-sm bg-zinc-900">
                    {/* TODO: Replace mock with real screenshot when available
                         <img src="/images/preview/artist-page-screenshot.jpg"
                              alt="Vibaro Artist Page Vorschau"
                              className="h-full w-full object-cover object-top" />
                    */}
                    <div className="flex h-full w-full flex-col bg-zinc-950 p-6 sm:p-8">
                      {/* Mock Nav */}
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <span className="text-xs font-semibold text-zinc-400">vibaro</span>
                        <div className="flex gap-4 text-[10px] text-zinc-600">
                          <span>Profil</span><span>Shows</span><span>Releases</span>
                        </div>
                      </div>
                      {/* Mock Profile */}
                      <div className="mt-6 flex items-start gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-full bg-zinc-700 sm:h-20 sm:w-20" />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-bold text-zinc-100 sm:text-xl">Sofia Holloway</h3>
                          <p className="text-xs text-zinc-500">Singer-Songwriter · Berlin</p>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                            Emotionale Songs zwischen Indie-Folk und Chamber-Pop. Neues Album &ldquo;Echoes&rdquo; jetzt überall.
                          </p>
                        </div>
                      </div>
                      {/* Mock Releases */}
                      <div className="mt-6">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Releases</div>
                        <div className="mt-3 flex gap-3">
                          {["Echoes", "Morgen", "Still"].map((title, i) => (
                            <div key={title} className="flex items-center gap-2 rounded bg-zinc-900 px-3 py-2">
                              <div
                                className="h-8 w-8 shrink-0 rounded"
                                style={{ backgroundColor: ["#3b3b4f", "#4a3b2e", "#2e3b4a"][i] }}
                              />
                              <div>
                                <div className="text-[11px] font-medium text-zinc-200">{title}</div>
                                <div className="text-[9px] text-zinc-600">2025</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Mock Shows */}
                      <div className="mt-5">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Upcoming Shows</div>
                        <div className="mt-2 space-y-1.5">
                          {[
                            { city: "Berlin", venue: "Lido", date: "15. März" },
                            { city: "Hamburg", venue: "Knust", date: "22. März" },
                          ].map((show) => (
                            <div
                              key={show.city}
                              className="flex items-center justify-between rounded bg-zinc-900 px-3 py-2 text-[10px]"
                            >
                              <div>
                                <div className="font-medium text-zinc-200">{show.city}</div>
                                <div className="text-zinc-600">{show.date}</div>
                              </div>
                              <div className="text-zinc-500">{show.venue}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop Base */}
                <div className="relative">
                  <div className="h-2 rounded-b-xl bg-gradient-to-b from-zinc-700 to-zinc-800" />
                  <div className="-mt-1 mx-auto h-1 w-[70%] rounded-b-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 5 · FEATURES (3 SÄULEN) ════════════════
            Psychologie: Chunking – 3er-Gruppen sind leicht merkbar
        */}
        <section id="features" className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="features-heading"
                className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
              >
                Alles, was du brauchst.
                <br className="hidden sm:block" />
                Nichts, was du nicht brauchst.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
                Kein Baukasten-Chaos. Keine überladenen Dashboards.
                Nur die Werkzeuge, die für Musiker wirklich zählen.
              </p>
            </div>

            <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Deine Seite</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Profil, Shows, Releases, Galerie und Kontakt&nbsp;– alles auf einer&nbsp;Seite,
                  unter deinem eigenen Link. Kein Code, kein Baukasten.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                    <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
                    <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Spotlights</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Setze dein wichtigstes Projekt in den Fokus&nbsp;– Release, Tour oder
                  Kampagne. Ein Spotlight, das alles bündelt.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700 sm:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l4-4 4 2 5-6" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Performance</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Verstehe, woher deine Klicks kommen. Welcher Kanal funktioniert,
                  welche Kampagne zieht&nbsp;– datenschutzkonform und ohne Dritte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 6 · HOW IT WORKS ════════════════
            Psychologie: Simplicity Bias – einfach = weniger Barriere
        */}
        <section className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="steps-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2
              id="steps-heading"
              className="text-center text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
            >
              In drei Schritten live.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-zinc-400">
              Keine Einrichtungszeit. Kein technisches Wissen nötig.
            </p>

            <div className="mt-20 grid gap-12 sm:grid-cols-3">
              {[
                { step: "01", title: "Registrieren", desc: "Erstelle deinen Account – kostenlos und in Sekunden." },
                { step: "02", title: "Seite einrichten", desc: "Fülle dein Profil, füge Shows und Releases hinzu." },
                { step: "03", title: "Veröffentlichen", desc: "Teile deinen Link – deine Seite ist sofort online." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center sm:text-left">
                  <div className="text-4xl font-bold text-zinc-800">{step}</div>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-50">{title}</h3>
                  <p className="mt-2 leading-relaxed text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ 7 · TESTIMONIAL ════════════════
            Psychologie: Qualitative Social Proof
            STYLEGUIDE: editorial, wie ein Musikmagazin-Zitat
        */}
        <section className="border-t border-zinc-800/50 py-24 lg:py-32" aria-label="Testimonial">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <blockquote>
              <p className="text-2xl font-medium leading-relaxed text-zinc-200 sm:text-3xl sm:leading-relaxed lg:text-4xl lg:leading-snug">
                &ldquo;Endlich hab ich einen Ort, den ich Bookern schicken kann
                – ohne mich rechtfertigen zu müssen.&rdquo;
              </p>
              <footer className="mt-8">
                <div className="text-base font-semibold text-zinc-300">Mara Delgado</div>
                <div className="mt-1 text-sm text-zinc-500">Singer-Songwriter, Berlin</div>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ════════════════ 8 · PRICING ════════════════
            Psychologie: Anchoring – Free als Anker, Artist als Upgrade
        */}
        <section id="pricing" className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="pricing-heading"
                className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
              >
                Fair &amp; transparent
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                Kostenlos starten. Upgraden, wenn du bereit bist.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
              {/* Free */}
              <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
                <div className="text-sm font-medium text-zinc-400">Free</div>
                <div className="mt-4 text-5xl font-semibold tracking-[-0.01em] text-zinc-50">€0</div>
                <div className="mt-1 text-sm text-zinc-500">für immer</div>
                <ul className="mt-8 flex-1 space-y-4">
                  {[
                    "Öffentliche Musiker-Seite",
                    "Profil mit Bio & Bild",
                    "Ausgewählte Themes",
                    "Eigener Link (vibaro.de/p/dein-name)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
                      <span className="text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className="mt-8 block w-full rounded-full border border-zinc-700 py-3 text-center font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  Jetzt starten
                </a>
              </div>

              {/* Artist */}
              <div className="flex flex-col rounded-2xl border-2 border-white bg-white p-8 text-zinc-950">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-zinc-800">Artist</div>
                  <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">Beliebt</div>
                </div>
                <div className="mt-4 text-5xl font-semibold tracking-[-0.01em] text-zinc-950">€9</div>
                <div className="mt-1 text-sm text-zinc-600">pro Monat</div>
                <ul className="mt-8 flex-1 space-y-4">
                  {[
                    "Alles aus Free",
                    "Shows, Releases & Galerie",
                    "Alle Themes & Varianten",
                    "Performance-Tracking & Spotlights",
                    "Kein Vibaro-Branding",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950" />
                      <span className="text-sm font-medium text-zinc-900">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className="mt-8 block w-full rounded-full bg-zinc-950 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  Jetzt upgraden
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 9 · FINAL CTA ════════════════
            Psychologie: Recency Effect – letzter Eindruck bleibt
        */}
        <section className="py-20 lg:py-32" aria-label="Registrierung">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 px-8 py-20 text-center lg:px-16">
              <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl">
                Bereit für deine
                <br />
                eigene Bühne?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
                Erstelle in wenigen Minuten deine persönliche Musiker-Homepage.
                Kostenlos, ohne Verpflichtung.
              </p>
              <a
                href="/register"
                className="mt-10 inline-block rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:scale-[1.03] hover:bg-zinc-200"
              >
                Jetzt loslegen
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-sm text-zinc-500">© 2026 Vibaro</div>
            <nav className="flex gap-6" aria-label="Footer-Navigation">
              <a href="/impressum" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Impressum</a>
              <a href="/datenschutz" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Datenschutz</a>
            </nav>
          </div>
        </div>
      </footer>

      {/* Structured Data (JSON-LD) – SEO: SoftwareApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Vibaro",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Die digitale Bühne für Musiker – professionelle Homepage mit Profil, Shows, Releases und Performance-Tracking.",
            url: "https://vibaro.de",
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "EUR", name: "Free" },
              { "@type": "Offer", price: "9", priceCurrency: "EUR", name: "Artist", billingIncrement: "P1M" },
            ],
          }),
        }}
      />
    </div>
  );
}
