import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – Vibaro",
  description: "Impressum und Anbieterkenntzeichnung für Vibaro.",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="space-y-2">
            <a
              href="/"
              className="inline-flex text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              ← Zur Startseite
            </a>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Impressum
            </h1>
            <p className="text-base text-zinc-400">
              Anbieterkennzeichnung gemäß § 5 DDG
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="prose prose-invert max-w-none">
          {/* Section 1 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              1. Angaben gemäß § 5 DDG
            </h2>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300">
              <div>
                <p className="font-semibold text-white">Vibaro</p>
                <p>[MEIN VOLLSTÄNDIGER NAME ODER FIRMENNAME]</p>
                <p>[STRAẞE UND HAUSNUMMER]</p>
                <p>[PLZ UND ORT]</p>
                <p>[LAND]</p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <p className="mb-2">
                  <strong className="text-white">Rechtsform:</strong> [Einzelunternehmer / Kleinunternehmer / UG / GmbH / Sonstiges]
                </p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <p className="mb-2 font-semibold text-white">Vertreten durch:</p>
                <p>[BEI EINZELUNTERNEHMER: MEIN NAME]</p>
                <p>[BEI UG/GMBH: NAME DER GESCHÄFTSFÜHRUNG]</p>
              </div>
            </div>

            <p className="leading-relaxed text-zinc-300">
              Dieses Impressum gilt für folgende Angebote und technische
              Bereiche von Vibaro:
            </p>

            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Web-App / Frontend: https://vibaro.app</li>
              <li>• API / Backend: https://api.vibaro.app</li>
              <li>
                • Öffentliche Bandseiten, z. B.: https://vibaro.app/p/{`{handle}`}
              </li>
              <li>
                • Tracking-Links, z. B.: https://vibaro.app/t/{`{slug}`}
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Kontakt</h2>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300">
              <div>
                <p className="font-semibold text-white mb-2">E-Mail:</p>
                <p>[IMPRESSUMS-E-MAIL]</p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <p className="font-semibold text-white mb-2">Telefon:</p>
                <p>[TELEFONNUMMER, FALLS ANGEGEBEN / ERFORDERLICH]</p>
              </div>
            </div>

            <p className="leading-relaxed text-zinc-300 text-sm italic">
              Hinweis: Für rechtliche Anfragen, Datenschutzanfragen und sonstige
              geschäftliche Kommunikation sollte eine dauerhaft erreichbare
              E-Mail-Adresse verwendet werden.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Registereintrag</h2>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300">
              <p className="font-semibold text-white">Option A – falls kein Registereintrag vorhanden:</p>
              <p>Es besteht kein Registereintrag.</p>

              <div className="border-t border-zinc-700 pt-4">
                <p className="font-semibold text-white mb-3">
                  Option B – falls Registereintrag vorhanden:
                </p>
                <p className="mb-2">Eintragung im Handelsregister.</p>
                <p>
                  <strong className="text-white">Registergericht:</strong> [REGISTERGERICHT]
                </p>
                <p>
                  <strong className="text-white">Registernummer:</strong> [REGISTERNUMMER]
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Umsatzsteuer</h2>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300">
              <div>
                <p className="font-semibold text-white mb-2">Option A – falls USt-IdNr. vorhanden:</p>
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a
                  Umsatzsteuergesetz:
                </p>
                <p className="mt-2">[USt-IdNr.]</p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <p className="font-semibold text-white mb-2">
                  Option B – falls Kleinunternehmerregelung genutzt wird:
                </p>
                <p>
                  Es wird gemäß § 19 UStG keine Umsatzsteuer berechnet.
                </p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <p className="font-semibold text-white mb-2">
                  Option C – falls keine USt-IdNr. vorhanden:
                </p>
                <p>
                  Eine Umsatzsteuer-Identifikationsnummer wurde nicht vergeben.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              5. Verantwortlich für den Inhalt
            </h2>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300">
              <div>
                <p className="font-semibold text-white mb-2">
                  Verantwortlich für den Inhalt:
                </p>
                <p>[NAME DER VERANTWORTLICHEN PERSON]</p>
                <p>[STRAẞE UND HAUSNUMMER]</p>
                <p>[PLZ UND ORT]</p>
                <p>[LAND]</p>
              </div>
            </div>

            <p className="leading-relaxed text-zinc-300 text-sm italic">
              Hinweis: Falls Vibaro später journalistisch-redaktionelle Inhalte
              anbietet, etwa ein Magazin, redaktionelle Artikel oder regelmäßig
              publizierte Inhalte, sollte dieser Abschnitt zusätzlich rechtlich
              geprüft und gegebenenfalls ausdrücklich als „verantwortlich im
              Sinne von § 18 Abs. 2 MStV" formuliert werden.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              6. Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>

            <p className="leading-relaxed text-zinc-300">
              Wir sind nicht verpflichtet und nicht bereit, an einem
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>

            <p className="leading-relaxed text-zinc-300 text-sm italic">
              Hinweis: Unternehmen müssen Verbraucher grundsätzlich darüber
              informieren, ob sie bereit oder verpflichtet sind, an einem
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Haftung für Inhalte</h2>

            <p className="leading-relaxed text-zinc-300">
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
              nach den allgemeinen gesetzlichen Vorschriften verantwortlich.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Vibaro stellt registrierten Bands und Musikern technische
              Funktionen zur Verfügung, mit denen sie eigene öffentliche
              Bandseiten, Inhalte, Links, QR-Codes und Performance-Auswertungen
              verwalten können. Für Inhalte, die Nutzerinnen und Nutzer
              eigenständig auf ihren Bandseiten veröffentlichen, sind
              grundsätzlich die jeweiligen Nutzerinnen und Nutzer verantwortlich,
              soweit gesetzlich nichts anderes gilt.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Wir behalten uns vor, rechtswidrige oder vertragswidrige Inhalte
              nach Kenntnisnahme zu prüfen und, soweit erforderlich, zu entfernen
              oder den Zugang dazu zu sperren.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Haftung für Links</h2>

            <p className="leading-relaxed text-zinc-300">
              Unser Angebot kann Links zu externen Websites Dritter enthalten,
              auf deren Inhalte wir keinen Einfluss haben. Für diese fremden
              Inhalte übernehmen wir keine Gewähr.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich. Rechtswidrige
              Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
              permanente inhaltliche Kontrolle externer Links ist ohne konkrete
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links
              prüfen und gegebenenfalls entfernen.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Urheberrecht</h2>

            <p className="leading-relaxed text-zinc-300">
              Die durch Vibaro erstellten Inhalte, Designs, Texte,
              Benutzeroberflächen und sonstigen Bestandteile dieses Angebots
              unterliegen, soweit anwendbar, dem deutschen Urheberrecht.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Die Vervielfältigung, Bearbeitung, Verbreitung oder sonstige
              Nutzung außerhalb der Grenzen des Urheberrechts bedarf der
              vorherigen Zustimmung des jeweiligen Rechteinhabers.
            </p>

            <p className="leading-relaxed text-zinc-300">
              Inhalte, die von registrierten Bands, Musikern oder sonstigen
              Nutzerinnen und Nutzern hochgeladen oder veröffentlicht werden,
              verbleiben grundsätzlich bei den jeweiligen Rechteinhabern.
              Nutzerinnen und Nutzer sind dafür verantwortlich, dass sie über
              die erforderlichen Rechte an den von ihnen veröffentlichten
              Inhalten verfügen.
            </p>
          </section>

          {/* Checklist */}
          <section className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-8 space-y-6 text-blue-200">
            <div>
              <h2 className="text-2xl font-bold text-blue-100 mb-4">
                📋 Checkliste vor Veröffentlichung
              </h2>
              <p className="text-sm mb-6">
                Prüfe vor dem Livegang besonders diese Punkte:
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  1. Ladungsfähige Anschrift eintragen
                </p>
                <p className="text-sm">
                  Keine reine Postfachadresse. Es muss eine echte zustellfähige
                  Anschrift sein.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  2. Rechtsform korrekt wählen
                </p>
                <p className="text-sm">
                  Einzelunternehmer, Kleinunternehmer, UG, GmbH oder sonstige
                  Rechtsform sauber benennen.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  3. Vertretungsberechtigte Person korrekt eintragen
                </p>
                <p className="text-sm">
                  Bei Einzelunternehmen dein Name, bei UG/GmbH die
                  Geschäftsführung.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  4. Umsatzsteuer-Abschnitt korrekt auswählen
                </p>
                <p className="text-sm">
                  Nur eine passende Variante verwenden: USt-IdNr.,
                  Kleinunternehmerregelung oder keine USt-IdNr.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  5. Registereintrag nur aufnehmen, wenn vorhanden
                </p>
                <p className="text-sm">
                  Handelsregister, Registernummer und Registergericht nur bei
                  tatsächlichem Eintrag nennen.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  6. Telefonnummer prüfen
                </p>
                <p className="text-sm">
                  Eine Telefonnummer wird im Impressum häufig erwartet, sofern
                  keine andere schnelle und unmittelbare Kommunikation
                  sichergestellt ist.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  7. Impressum überall erreichbar machen
                </p>
                <p className="text-sm">
                  Der Link sollte auf vibaro.app leicht erkennbar, unmittelbar
                  erreichbar und dauerhaft verfügbar sein. § 5 DDG verlangt
                  genau diese Eigenschaften.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  8. AGB und Datenschutzerklärung abstimmen
                </p>
                <p className="text-sm">
                  Impressum, Datenschutzerklärung und AGB sollten dieselben
                  Betreiberdaten, Kontaktangaben, Domains und Begriffe verwenden.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  9. Veraltete OS-Plattform-Links entfernen
                </p>
                <p className="text-sm">
                  Die EU-Online-Streitbeilegungsplattform ist seit dem 20. Juli
                  2025 nicht mehr relevant; nimm deshalb keinen veralteten
                  OS-Plattform-Link auf.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-100">
                  10. Rechtlich prüfen lassen vor Zahlungsstart
                </p>
                <p className="text-sm">
                  Gerade bei SaaS, AGB, Widerruf, B2C/B2B-Abgrenzung,
                  Verbraucherrecht, Zahlungsanbieter und Nutzerinhalten lohnt
                  sich vor dem echten Verkauf eine anwaltliche Prüfung.
                </p>
              </div>
            </div>

            <p className="text-xs italic border-t border-blue-900/50 pt-6 text-blue-300">
              ⓘ Dieses Impressum ist eine praxisnahe Vorlage und ersetzt keine
              individuelle Rechtsberatung.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black/50 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-sm text-zinc-500">
            <div>© 2026 Vibaro</div>
            <nav className="flex gap-6">
              <a href="/datenschutz" className="transition-colors hover:text-zinc-300">
                Datenschutz
              </a>
              <a href="/" className="transition-colors hover:text-zinc-300">
                Zur Startseite
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
