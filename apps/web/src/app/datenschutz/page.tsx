import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz – Vibaro",
  description:
    "Datenschutzerklärung von Vibaro. Erfahre, wie wir deine Daten schützen und verarbeiten.",
};

export default function PrivacyPage() {
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
              Datenschutzerklärung
            </h1>
            <p className="text-base text-zinc-400">
              Gültig ab: [Datum eintragen]
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="prose prose-invert max-w-none">
          {/* Section 1 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Allgemeine Hinweise</h2>
            <p className="leading-relaxed text-zinc-300">
              Mit dieser Datenschutzerklärung informieren wir darüber, welche
              personenbezogenen Daten bei der Nutzung von Vibaro verarbeitet
              werden, zu welchen Zwecken dies geschieht und welche Rechte
              betroffene Personen haben.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Vibaro ist eine Webanwendung für Bands und Musiker. Registrierte
              Nutzer können im Studio/Dashboard eine öffentliche Bandseite
              erstellen, Inhalte verwalten, Links verteilen und einfache
              Performance-Auswertungen zu ihrer Bandseite und ihren
              Tracking-Links einsehen.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Die Anwendung ist erreichbar unter:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>Web-App / Frontend: https://vibaro.app</li>
              <li>API / Backend: https://api.vibaro.app</li>
              <li>Öffentliche Bandseiten, z. B.: https://vibaro.app/p/{`{handle}`}</li>
              <li>Tracking-Links, z. B.: https://vibaro.app/t/{`{slug}`}</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Vibaro verwendet keine Werbung, keine Social-Media-Pixel, kein
              Google Analytics, kein werbliches Tracking über Websites hinweg
              und verkauft keine personenbezogenen Daten an Dritte.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Die Verarbeitung personenbezogener Daten erfolgt nach den Vorgaben
              der Datenschutz-Grundverordnung, insbesondere auf Grundlage von
              Art. 6 DSGVO. Die dort genannten Rechtsgrundlagen umfassen unter
              anderem Vertragserfüllung, berechtigte Interessen, gesetzliche
              Pflichten und Einwilligungen.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Verantwortlicher</h2>
            <p className="leading-relaxed text-zinc-300">
              Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-300">
              <p>[Name / Firma]</p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ Ort]</p>
              <p>[Land]</p>
              <p className="mt-4">E-Mail: [E-Mail-Adresse]</p>
              <p>Telefon: [Telefonnummer, optional]</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              3. Datenschutzbeauftragter
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Ein Datenschutzbeauftragter ist derzeit [nicht bestellt / bestellt].
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Begriffe</h2>
            <p className="leading-relaxed text-zinc-300">
              Personenbezogene Daten sind alle Informationen, die sich auf eine
              identifizierte oder identifizierbare natürliche Person beziehen.
              Dazu können zum Beispiel Name, E-Mail-Adresse, IP-Adresse,
              Nutzungsdaten oder technische Kennungen gehören.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Verarbeitung bedeutet jeder Umgang mit personenbezogenen Daten,
              etwa Erheben, Speichern, Verwenden, Übermitteln, Löschen oder
              Auswerten.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              5. Zwecke der Datenverarbeitung
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Wir verarbeiten personenbezogene Daten insbesondere zu folgenden
              Zwecken:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Bereitstellung der Vibaro-Webanwendung</li>
              <li>• Registrierung und Verwaltung von Nutzerkonten</li>
              <li>• Login, Authentifizierung und Session-Verwaltung</li>
              <li>• Erstellung und Veröffentlichung öffentlicher Bandseiten</li>
              <li>
                • Speicherung und Auslieferung von Inhalten, Bildern und Links
              </li>
              <li>• Bereitstellung von Tracking-Links und QR-Code-Zielen</li>
              <li>• einfache Performance-Auswertung für Bands</li>
              <li>• Sicherstellung des technischen Betriebs</li>
              <li>• Schutz vor Missbrauch, Angriffen und Störungen</li>
              <li>• Fehleranalyse und Support</li>
              <li>• Kommunikation mit Nutzern</li>
              <li>• Erfüllung gesetzlicher Pflichten</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              6. Nutzung der Website und technische Bereitstellung
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Beim Aufruf von vibaro.app, api.vibaro.app, öffentlichen
              Bandseiten oder Tracking-Links werden technisch notwendige Daten
              verarbeitet, damit die Website ausgeliefert, angezeigt und sicher
              betrieben werden kann.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Dabei können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• IP-Adresse</li>
              <li>• Datum und Uhrzeit des Zugriffs</li>
              <li>• aufgerufene URL</li>
              <li>• HTTP-Statuscode</li>
              <li>• Referrer, sofern übertragen</li>
              <li>• Browser- und Geräteinformationen</li>
              <li>• User-Agent</li>
              <li>• technische Fehlerdaten</li>
              <li>• Server- und Verbindungsdaten</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Diese Verarbeitung ist technisch erforderlich, um Vibaro
              bereitzustellen, Angriffe zu erkennen, Fehler zu analysieren und
              die Stabilität der Anwendung sicherzustellen.
            </p>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong> Art. 6
              Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im
              sicheren, stabilen und funktionsfähigen Betrieb der
              Webanwendung.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              7. Registrierung und Nutzerkonto
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Bands und Musiker können sich bei Vibaro registrieren und ein
              Nutzerkonto anlegen. Im Rahmen der Registrierung und Nutzung des
              Studios können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Name oder Bandname</li>
              <li>• E-Mail-Adresse</li>
              <li>• Passwort-Hash</li>
              <li>• Login- und Sessiondaten</li>
              <li>• Erstellungsdatum des Accounts</li>
              <li>• letzte Aktualisierung</li>
              <li>• technische Account-Metadaten</li>
              <li>• Einstellungen innerhalb des Studios</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Passwörter werden nicht im Klartext gespeichert, sondern als
              Passwort-Hash verarbeitet.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Die Accountdaten werden benötigt, um den Zugang zum Studio
              bereitzustellen, Nutzer zu authentifizieren und die Nutzung der
              Vibaro-Dienste zu ermöglichen.
            </p>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong>
              <br />
              Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur
              Bereitstellung des Nutzerkontos und der SaaS-Funktionen
              erforderlich ist.
              <br />
              Art. 6 Abs. 1 lit. f DSGVO, soweit Daten zur Sicherheit,
              Missbrauchserkennung oder technischen Stabilität verarbeitet
              werden.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Studio / Dashboard</h2>
            <p className="leading-relaxed text-zinc-300">
              Im eingeloggten Bereich können Nutzer ihre Bandseite, Inhalte,
              Links, Phasen und Performance-Daten verwalten.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Dabei können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Accountdaten</li>
              <li>• Bandseiten-Inhalte</li>
              <li>• Einstellungen zur öffentlichen Bandseite</li>
              <li>• Links und Kontaktinformationen</li>
              <li>• Veröffentlichungsstatus</li>
              <li>• interne technische IDs</li>
              <li>• Zeitpunkte von Änderungen</li>
              <li>• nutzerseitig gespeicherte Einstellungen</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Diese Daten werden verarbeitet, um die Funktionen des Studios
              bereitzustellen und Änderungen an der öffentlichen Bandseite zu
              ermöglichen.
            </p>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong> Art. 6
              Abs. 1 lit. b DSGVO.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              9. Öffentliche Bandseiten
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Registrierte Nutzer können eine öffentliche Bandseite erstellen,
              zum Beispiel unter:
            </p>
            <p className="font-mono text-sm text-zinc-400">
              https://vibaro.app/p/{`{handle}`}
            </p>
            <p className="leading-relaxed text-zinc-300">
              Auf öffentlichen Bandseiten können je nach Eingabe der Band
              insbesondere folgende Inhalte sichtbar sein:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Bandname</li>
              <li>• Handle / öffentliche URL</li>
              <li>• Bio oder Beschreibung</li>
              <li>• Profilbild, Logo oder Hero-Bild</li>
              <li>
                • Links zu Streaming-Plattformen, Social Media, YouTube, Spotify
                oder anderen externen Angeboten
              </li>
              <li>• Shows, Releases, Videos</li>
              <li>• Galerie-Bilder</li>
              <li>
                • Kontaktinformationen, sofern diese freiwillig eingetragen
                werden
              </li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Die Band entscheidet selbst, welche Inhalte sie einträgt und
              veröffentlicht. Öffentlich eingetragene Inhalte können von
              Besuchern der Bandseite abgerufen werden.
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-300">
              <p className="font-semibold text-white">Wichtig:</p>
              <p className="mt-2">
                Nutzer sollten keine personenbezogenen Daten Dritter
                veröffentlichen, wenn sie hierfür keine Berechtigung haben. Dies
                gilt insbesondere für Fotos, Namen, Kontaktinformationen oder
                sonstige Angaben zu anderen Personen.
              </p>
            </div>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong>
              <br />
              Art. 6 Abs. 1 lit. b DSGVO für die Bereitstellung der vom Nutzer
              gewünschten Veröffentlichungsfunktion.
              <br />
              Art. 6 Abs. 1 lit. f DSGVO für die technische Auslieferung und
              Sicherheit der öffentlichen Bandseiten.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Uploads und Bilder</h2>
            <p className="leading-relaxed text-zinc-300">
              Nutzer können freiwillig Bilder oder Dateien hochladen, zum
              Beispiel Logos, Profilbilder, Hero-Bilder oder Galerie-Bilder.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Dabei können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• hochgeladene Datei</li>
              <li>• Dateiname</li>
              <li>• Dateigröße</li>
              <li>• MIME-Type</li>
              <li>• Speicherpfad</li>
              <li>• Upload-Zeitpunkt</li>
              <li>• technische Metadaten</li>
              <li>
                • ggf. Bildinhalte, sofern Personen oder personenbezogene
                Informationen erkennbar sind
              </li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Uploads werden gespeichert, um sie innerhalb der Bandseite oder
              des Studios bereitzustellen.
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-300">
              <p className="font-semibold text-white">Hinweis zu Bildinhalten:</p>
              <p className="mt-2">
                Wenn Nutzer Bilder hochladen, auf denen Personen erkennbar
                sind, sollten sie sicherstellen, dass sie zur Veröffentlichung
                berechtigt sind.
              </p>
            </div>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong>
              <br />
              Art. 6 Abs. 1 lit. b DSGVO für die Bereitstellung der Upload- und
              Veröffentlichungsfunktion.
              <br />
              Art. 6 Abs. 1 lit. f DSGVO für technische Speicherung, Sicherheit,
              Fehleranalyse und Missbrauchsschutz.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              11. Tracking-Links, QR-Codes und einfache Analytics
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Vibaro bietet Bands einfache Performance-Auswertungen. Diese
              dienen dazu, die Nutzung der eigenen Bandseite und der eigenen
              Links besser zu verstehen.
            </p>
            <p className="leading-relaxed text-zinc-300">Beispiele:</p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Wie oft wurde eine öffentliche Bandseite aufgerufen?</li>
              <li>• Wie oft wurde ein Tracking-Link angeklickt?</li>
              <li>• Über welchen Referrer-Host kamen Besucher, sofern verfügbar?</li>
              <li>• Wann fanden Aufrufe oder Klicks statt?</li>
              <li>• Welche Links wurden genutzt?</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Dabei können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• Seitenaufrufe öffentlicher Bandseiten</li>
              <li>• Klicks auf Tracking-Links</li>
              <li>• Zeitpunkt des Aufrufs oder Klicks</li>
              <li>• aufgerufene Seite bzw. aufgerufener Link</li>
              <li>• Referrer-Host, sofern vorhanden</li>
              <li>• User-Agent-Informationen oder ein daraus abgeleiteter Hash</li>
              <li>
                • Visitor-Key-Hash zur groben Wiedererkennung eindeutiger
                Besucher
              </li>
              <li>
                • IP-Adresse kurzfristig zur technischen Verarbeitung oder
                Hash-Bildung
              </li>
              <li>
                • ggf. Land oder Region, sofern über Server-, Netzwerk- oder
                Headerdaten verfügbar
              </li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Die IP-Adresse wird [nach aktuellem Konzept nicht dauerhaft im
              Klartext für Analytics gespeichert]. Sie kann kurzfristig
              technisch verarbeitet werden, zum Beispiel zur Auslieferung der
              Seite, zur Missbrauchserkennung oder zur Bildung eines gekürzten
              bzw. gehashten technischen Schlüssels.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Die Analytics dienen ausschließlich den Bands zur Auswertung ihrer
              eigenen Bandseite und ihrer eigenen Links. Es findet kein
              werbliches Tracking über Websites hinweg statt. Es werden keine
              personenbezogenen Werbeprofile erstellt. Es erfolgt keine
              Weitergabe an Werbenetzwerke und kein Verkauf personenbezogener
              Daten.
            </p>
            <p className="rounded-lg border-l-4 border-zinc-700 bg-zinc-900/50 p-4 text-zinc-300">
              <strong className="text-white">Rechtsgrundlage:</strong> Art. 6
              Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt darin,
              registrierten Bands eine einfache, datensparsame Reichweiten- und
              Link-Auswertung bereitzustellen, die Sicherheit der Anwendung zu
              gewährleisten und Missbrauch zu erkennen.
            </p>
          </section>

          {/* Section 23 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">23. Sicherheit</h2>
            <p className="leading-relaxed text-zinc-300">
              Vibaro setzt technische und organisatorische Maßnahmen ein, um
              personenbezogene Daten vor Verlust, Missbrauch, unbefugtem Zugriff
              und Veränderung zu schützen.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Dazu können insbesondere gehören:
            </p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• verschlüsselte Übertragung per HTTPS</li>
              <li>• Passwort-Hashing</li>
              <li>• Zugriffsbeschränkungen</li>
              <li>• rollen- und nutzerbezogene Zugriffskontrollen</li>
              <li>• sichere Serverkonfiguration</li>
              <li>• regelmäßige Updates</li>
              <li>• Backups</li>
              <li>• Logging sicherheitsrelevanter Ereignisse</li>
              <li>• Trennung von Frontend, API und Datenbank</li>
              <li>• Schutz vor Missbrauch und automatisierten Angriffen</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Die Maßnahmen werden entsprechend dem Stand der Technik, den
              Risiken und der Art der verarbeiteten Daten ausgewählt.
            </p>
          </section>

          {/* Section 24 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              24. Keine Werbung, kein Verkauf von Daten, kein werbliches
              Profiling
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Vibaro verwendet keine personenbezogenen Daten für werbliches
              Tracking über Websites hinweg.
            </p>
            <p className="leading-relaxed text-zinc-300">Insbesondere gilt:</p>
            <ul className="list-inside space-y-2 text-zinc-300">
              <li>• kein Google Analytics</li>
              <li>• keine Social-Media-Pixel</li>
              <li>• keine Werbe-Cookies</li>
              <li>• keine Weitergabe an Werbenetzwerke</li>
              <li>• kein Verkauf personenbezogener Daten</li>
              <li>• keine öffentlichen Rankings</li>
              <li>• kein algorithmischer Feed</li>
              <li>• keine personenbezogene Profilbildung zu Werbezwecken</li>
            </ul>
            <p className="leading-relaxed text-zinc-300">
              Die Performance-Auswertungen innerhalb von Vibaro dienen
              ausschließlich den jeweiligen Bands zur Auswertung ihrer eigenen
              Bandseite und Links.
            </p>
          </section>

          {/* Section 28 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              28. Rechte betroffener Personen
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Betroffene Personen haben nach der DSGVO verschiedene Rechte. Dazu
              gehören insbesondere Auskunft, Berichtigung, Löschung,
              Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch,
              Widerruf von Einwilligungen und Beschwerde bei einer
              Aufsichtsbehörde.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Recht auf Auskunft
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, Auskunft darüber zu
                verlangen, ob personenbezogene Daten über sie verarbeitet
                werden. Ist dies der Fall, können sie Auskunft über diese Daten
                und weitere Informationen verlangen, zum Beispiel über Zwecke,
                Kategorien von Daten, Empfänger und Speicherdauer. Das
                Auskunftsrecht ist in Art. 15 DSGVO geregelt.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Berichtigung
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, die Berichtigung unrichtiger
                personenbezogener Daten zu verlangen.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Löschung
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, die Löschung
                personenbezogener Daten zu verlangen, sofern die gesetzlichen
                Voraussetzungen vorliegen.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Einschränkung der Verarbeitung
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, unter bestimmten
                Voraussetzungen die Einschränkung der Verarbeitung ihrer
                personenbezogenen Daten zu verlangen.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Datenübertragbarkeit
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, personenbezogene Daten, die
                sie bereitgestellt haben, in einem strukturierten, gängigen und
                maschinenlesbaren Format zu erhalten, sofern die gesetzlichen
                Voraussetzungen vorliegen.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Widerspruch
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, aus Gründen, die sich aus
                ihrer besonderen Situation ergeben, der Verarbeitung
                personenbezogener Daten zu widersprechen, soweit die
                Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Recht auf Widerruf von Einwilligungen
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Wenn eine Verarbeitung auf einer Einwilligung beruht, kann diese
                Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen
                werden.
              </p>

              <h3 className="text-lg font-semibold text-white">
                Beschwerderecht bei einer Aufsichtsbehörde
              </h3>
              <p className="leading-relaxed text-zinc-300">
                Betroffene Personen haben das Recht, sich bei einer
                Datenschutzaufsichtsbehörde zu beschweren, wenn sie der Ansicht
                sind, dass die Verarbeitung ihrer personenbezogenen Daten gegen
                Datenschutzrecht verstößt.
              </p>
              <p className="leading-relaxed text-zinc-300">
                Zuständig ist insbesondere die Aufsichtsbehörde am Wohnort der
                betroffenen Person oder am Sitz des Verantwortlichen.
              </p>
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-300">
                <strong className="text-white">
                  Zuständige Aufsichtsbehörde des Verantwortlichen:
                </strong>
                <br />
                [Name und Anschrift der zuständigen
                Datenschutzaufsichtsbehörde ergänzen]
              </p>
            </div>
          </section>

          {/* Section 29 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">29. Minderjährige</h2>
            <p className="leading-relaxed text-zinc-300">
              Vibaro richtet sich grundsätzlich an Bands, Musiker und
              Projektverantwortliche. Die Nutzung durch Minderjährige ist nur
              zulässig, soweit die gesetzlichen Voraussetzungen erfüllt sind.
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-300">
              <p>
                [Bitte ergänzen, ob Vibaro ein Mindestalter vorsieht, z. B. 16
                Jahre, oder ob die Nutzung Minderjähriger ausgeschlossen bzw.
                nur mit Zustimmung der Sorgeberechtigten erlaubt ist.]
              </p>
            </div>
          </section>

          {/* Section 30 */}
          <section className="mb-12 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              30. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Wir können diese Datenschutzerklärung anpassen, wenn sich Vibaro
              weiterentwickelt, neue Funktionen eingeführt werden, sich
              technische Abläufe ändern oder rechtliche Anforderungen dies
              erforderlich machen.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Die jeweils aktuelle Datenschutzerklärung ist unter:
            </p>
            <p className="font-mono text-sm text-zinc-400">
              https://vibaro.app/datenschutz
            </p>
            <p className="leading-relaxed text-zinc-300">abrufbar.</p>
          </section>

          {/* Info Box */}
          <div className="rounded-lg border border-orange-900/50 bg-orange-950/20 p-6 text-orange-200">
            <p className="font-semibold">
              ⚠️ Vorlage – Vor Veröffentlichung anpassen
            </p>
            <p className="mt-2 text-sm">
              Diese Datenschutzerklärung ist eine Vorlage und enthält
              Platzhalter in eckigen Klammern [wie diese]. Bitte passen Sie alle
              Informationen vor der Veröffentlichung an, insbesondere:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Name und Kontaktdaten des Verantwortlichen</li>
              <li>• Informationen zum Datenschutzbeauftragten</li>
              <li>• Konkrete Speicherdauern und Backup-Fristen</li>
              <li>• Namen und Standorte aller Dienstleister</li>
              <li>• Zuständige Aufsichtsbehörde</li>
              <li>• Mindestalter für Nutzer</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black/50 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-sm text-zinc-500">
            <div>© 2026 Vibaro</div>
            <nav className="flex gap-6">
              <a href="/impressum" className="transition-colors hover:text-zinc-300">
                Impressum
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
