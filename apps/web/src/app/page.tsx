import type { Metadata } from "next";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   SEO METADATA
   Next.js App Router – static metadata export (Server Component)
   ───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Vibaro – Die digitale Bühne für Musiker",
  description:
    "Die professionelle Homepage für Musiker – mit allem, was du brauchst. Profil, Shows, Releases und Performance-Tracking. In Minuten live.",
  openGraph: {
    title: "Vibaro – Die digitale Bühne für Musiker",
    description:
      "Deine Musik verdient eine eigene Bühne. Profil, Shows, Releases und Tracking – in Minuten live.",
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
      "Deine Musik verdient eine eigene Bühne. In Minuten live.",
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
          <Link href="/" className="text-xl font-semibold tracking-tight" aria-label="Vibaro Startseite">
            vibaro
          </Link>
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
              Deine Bühne starten
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ════════════════ 1 · HERO ════════════════ */}
        <section className="relative overflow-hidden pt-16" style={{ minHeight: "100svh" }} aria-label="Hero">

          {/* ── Bild ── */}
          <div className="absolute inset-0">
            <img
              src="/images/landing/erik-mclean-PQqV2XerrhM-unsplash.jpg"
              alt="Musiker auf der Bühne – atmosphärische Live-Szene"
              className="h-full w-full object-cover"
              style={{ objectPosition: "65% 22%" }}
              loading="eager"
              fetchPriority="high"
            />

            {/* Links dunkel → rechts offen */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.74) 32%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.10) 76%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Oben abdunkeln (Nav-Bereich) */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 28%)" }}
            />

            {/* Unten in Seitenfarbe auslaufen */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0"
              style={{ height: "220px", background: "linear-gradient(to bottom, transparent, rgb(9,9,11))" }}
            />
          </div>

          {/* ── Inhalt ── */}
          <div
            className="relative flex px-6 lg:px-16"
            style={{ minHeight: "100svh", alignItems: "center", paddingLeft: "clamp(1.5rem, 27vw, 38rem)" }}
          >
            <div style={{ maxWidth: "640px", paddingBottom: "8vh" }}>

              {/* Kicker */}
              <p
                className="mb-6 text-xs font-semibold uppercase tracking-[0.26em]"
                style={{ color: "rgba(255,255,255,0.56)" }}
              >
                Für Musiker, die es ernst meinen
              </p>

              {/* Headline */}
              <h1
                className="font-semibold text-white"
                style={{
                  fontSize: "clamp(2.75rem, 6.5vw, 6.25rem)",
                  lineHeight: 1.03,
                  letterSpacing: "-0.03em",
                }}
              >
                Own Your
                <br />
                Stage.
              </h1>

              {/* Subline */}
              <p
                className="mt-7 leading-relaxed"
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                  color: "rgba(255,255,255,0.52)",
                  maxWidth: "480px",
                }}
              >
                Die professionelle Homepage für Musiker – mit allem, was du brauchst.
                <br />
                In Minuten live. Ohne Baukasten. Ohne Abhängigkeit.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.03] hover:bg-zinc-200"
                >
                  Deine Bühne starten
                </a>
                <a
                  href="#buehne"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  So sieht&apos;s aus
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 2 · PROBLEM ════════════════ */}
        <section className="py-24 lg:py-32" aria-labelledby="problem-heading">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2
              id="problem-heading"
              className="text-center text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
            >
              Deine Musik verdient mehr
              <br className="hidden sm:block" />
              als einen Bio-Link.
            </h2>
            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
              <p>
                Social-Profile sind flüchtig.
                <br />
                Posts verschwinden. Algorithmen entscheiden.
              </p>
              <p className="text-zinc-300">
                Aber deine Musik ist kein Content.
              </p>
              <p>
                Booker, Veranstalter und Fans brauchen einen klaren Ort,
                <br className="hidden lg:block" />
                an dem alles zusammenkommt – Profil, Shows, Releases, Kontakt.
              </p>
              <p>
                Einen Ort, den du kontrollierst.
                <br />
                <span className="text-zinc-300">Nicht eine Plattform.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════ 3 · DIE BÜHNE ════════════════ */}
        <section id="buehne" className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="buehne-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2
              id="buehne-heading"
              className="text-center text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
            >
              Eine Bühne, die mit
              <br className="hidden sm:block" />
              deiner Band wächst.
            </h2>

            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
              <p>
                Deine Vibaro-Seite ist kein Baukasten.
                <br />
                Sie ist deine digitale Bühne.
              </p>
              <p>
                Mit eigener URL.
                <br />
                Mit deinem Look.
                <br />
                Mit klarer Struktur.
              </p>
              <p className="text-zinc-300">
                Alles, was wichtig ist – auf einer Seite:
              </p>
            </div>

            <ul className="mx-auto mt-8 max-w-2xl space-y-3">
              {[
                "Profil mit Bio, Bild und Genre",
                "Shows & Tourdaten",
                "Releases mit Streaming-Links",
                "Videos & Galerie",
                "Kontakt für Booking & Presse",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg text-zinc-300">
                  <CheckIcon className="h-5 w-5 shrink-0 text-zinc-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-zinc-500">
              Keine Plugins. Keine Widgets. Kein Chaos.
            </p>
          </div>
        </section>

        {/* ════════════════ 4 · SPOTLIGHT & PHASEN ════════════════ */}
        <section className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="spotlight-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="spotlight-heading"
                className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
              >
                Fokus statt Feed.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 lg:text-xl">
                Setze dein wichtigstes Projekt in den Fokus.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
              <p className="text-zinc-300">
                Single. Album. Tour. Phase.
              </p>
              <p>
                Mit Vibaro definierst du eine Phase –
                <br />
                und sie steht im Mittelpunkt deiner Seite.
              </p>
              <p>
                Eigener Banner.
                <br />
                Eigene Botschaft.
                <br />
                Eigener Call-to-Action.
              </p>
              <p>
                Nicht alles gleichzeitig.
                <br />
                <span className="text-zinc-300">Sondern das, was jetzt zählt.</span>
              </p>
              <p>
                So bleibt deine Seite klar.
                <br />
                Und deine Kommunikation präzise.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════ 5 · PERFORMANCE ════════════════ */}
        <section className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="performance-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="performance-heading"
                className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
              >
                Verstehe, was wirklich
                <br className="hidden sm:block" />
                funktioniert.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 lg:text-xl">
                Nicht raten. Nicht hoffen. Wissen.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-zinc-400 lg:text-xl lg:leading-relaxed">
              <p>
                Woher kommen deine Klicks?
                <br />
                Welche Story konvertiert?
                <br />
                Funktioniert Instagram besser als TikTok?
                <br />
                Bringt der QR-Code auf deinem Poster wirklich Traffic?
              </p>
              <p className="text-zinc-300">
                Vibaro zeigt dir:
              </p>
            </div>

            <ul className="mx-auto mt-6 max-w-2xl space-y-3">
              {[
                "Klicks nach Plattform",
                "Story vs. Bio vs. Reel",
                "Conversion Rate",
                "Tages-Trends",
                "Referrer",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg text-zinc-300">
                  <CheckIcon className="h-5 w-5 shrink-0 text-zinc-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-zinc-500">
              Datenschutzkonform. Ohne Drittanbieter. Ohne externe Tracker.
              <br />
              <span className="text-zinc-300">Deine Daten gehören dir.</span>
            </p>
          </div>
        </section>

        {/* ════════════════ 6 · KLARHEIT – DAS PRINZIP ════════════════ */}
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
                <br className="hidden sm:block" />
                Keine unnötigen Features.
                <br className="hidden sm:block" />
                Nur Werkzeuge, die für Musiker wirklich zählen.
              </p>
            </div>

            <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {/* Card 1 – Deine Bühne */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Deine Bühne</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Alle Inhalte an einem Ort – unter deinem eigenen Link.
                </p>
              </div>

              {/* Card 2 – Dein Fokus */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                    <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
                    <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Dein Fokus</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Ein Projekt im Mittelpunkt. Keine Ablenkung.
                </p>
              </div>

              {/* Card 3 – Deine Kontrolle */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-colors hover:border-zinc-700 sm:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l4-4 4 2 5-6" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">Deine Kontrolle</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">
                  Verstehe deine Performance – ohne externe Plattformen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 7 · SO EINFACH IST ES ════════════════ */}
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
                { step: "02", title: "Einrichten", desc: "Füge Profil, Shows und Releases hinzu." },
                { step: "03", title: "Veröffentlichen", desc: "Teile deinen Link. Deine Seite ist sofort online." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center sm:text-left">
                  <div className="text-4xl font-bold text-zinc-800">{step}</div>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-50">{title}</h3>
                  <p className="mt-2 leading-relaxed text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-16 text-center text-lg font-medium text-zinc-500">
              Fertig.
            </p>
          </div>
        </section>

        {/* ════════════════ 8 · TESTIMONIAL ════════════════ */}
        <section className="border-t border-zinc-800/50 py-24 lg:py-32" aria-label="Testimonial">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <blockquote>
              <p className="text-2xl font-medium leading-relaxed text-zinc-200 sm:text-3xl sm:leading-relaxed lg:text-4xl lg:leading-snug">
                &ldquo;Endlich habe ich einen Ort, den ich Bookern schicken kann
                – ohne mich rechtfertigen zu müssen.&rdquo;
              </p>
              <footer className="mt-8">
                <div className="text-base font-semibold text-zinc-300">Mara Delgado</div>
                <div className="mt-1 text-sm text-zinc-500">Singer-Songwriter, Berlin</div>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ════════════════ 9 · PRICING ════════════════ */}
        <section id="pricing" className="border-t border-zinc-800/50 py-24 lg:py-32" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="text-center">
              <h2
                id="pricing-heading"
                className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-zinc-50 sm:text-4xl lg:text-5xl"
              >
                Deine Bühne. Ein Preis.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                Alles inklusive. Keine Module. Keine versteckten Upgrades.
              </p>
            </div>

            {/* Single plan card */}
            <div className="mx-auto mt-16 max-w-lg">
              <div className="flex flex-col rounded-2xl border-2 border-white bg-white p-8 text-zinc-950 sm:p-10">
                <div className="text-sm font-medium text-zinc-800">Vibaro Artist</div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-[-0.01em] text-zinc-950">29&thinsp;€</span>
                  <span className="text-base text-zinc-600">/ Monat</span>
                </div>
                <ul className="mt-8 flex-1 space-y-4">
                  {[
                    "Eigene Musiker-Website",
                    "Shows, Releases & Galerie",
                    "Phase-Management",
                    "Tracking & Performance",
                    "QR-Codes",
                    "Alle Themes",
                    "Kein Vibaro-Branding",
                    "DSGVO-konform",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950" />
                      <span className="text-sm font-medium text-zinc-900">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className="mt-10 block w-full rounded-full bg-zinc-950 py-3.5 text-center font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  Jetzt deine Bühne starten
                </a>
                <p className="mt-4 text-center text-xs text-zinc-500">
                  30 Tage kostenlos testen. Jederzeit kündbar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ 10 · FINAL CTA ════════════════ */}
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
                <br className="hidden sm:block" />
                Professionell. Klar. Unter deiner Kontrolle.
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

      {/* Structured Data (JSON-LD) */}
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
              { "@type": "Offer", price: "29", priceCurrency: "EUR", name: "Artist", billingIncrement: "P1M" },
            ],
          }),
        }}
      />
    </div>
  );
}
