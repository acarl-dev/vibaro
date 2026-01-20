"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SettingsClientProps = {
  handle: string;
  isPublished: boolean;
};

export default function SettingsClient({ handle, isPublished }: SettingsClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublishToggle = async () => {
    setIsLoading(true);
    try {
      const endpoint = isPublished 
        ? '/api/studio/unpublish' 
        : '/api/studio/publish';
      
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the page to get updated data
        router.refresh();
      } else {
        const error = await response.json().catch(() => ({ error: { message: 'Unbekannter Fehler' } }));
        alert(`Fehler: ${error.error?.message || 'Aktion fehlgeschlagen'}`);
      }
    } catch (err) {
      console.error('Toggle publish error:', err);
      alert('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Seite */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">Seite</h2>
          <p className="text-sm text-zinc-500">
            Aussehen, Webadresse und Veröffentlichung deiner Seite
          </p>
        </div>

        <div className="space-y-4">
          {/* Domain / Handle */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Domain / Handle</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">vibaro.com/p/</span>
                  <span className="text-zinc-200 font-medium">{handle}</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Dein Handle kann später geändert werden
                </p>
                <a
                  href={`/p/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
                >
                  Öffentliche Seite ansehen
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Analytics (Placeholder) */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5 opacity-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-zinc-300 mb-1">Analytics</h3>
                <p className="text-xs text-zinc-500">
                  Insights zu Besuchen und Interaktionen (coming soon)
                </p>
              </div>
              <span className="text-xs text-zinc-600 px-2 py-1 rounded bg-zinc-800/50">
                Bald verfügbar
              </span>
            </div>
          </div>

          {/* Publishing Status */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5">
            <h3 className="text-sm font-medium text-zinc-300 mb-4">Veröffentlichung</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isPublished 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {isPublished ? 'Veröffentlicht' : 'Nicht veröffentlicht'}
                </span>
              </div>

              <p className="text-xs text-zinc-500">
                {isPublished 
                  ? `Deine Seite ist aktuell veröffentlicht und unter /p/${handle} erreichbar.`
                  : 'Deine Seite ist noch nicht öffentlich sichtbar. Veröffentliche sie, wenn du bereit bist.'
                }
              </p>

              {isPublished && (
                <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 mt-3">
                  <p className="text-xs text-zinc-400">
                    <strong className="text-zinc-300">Hinweis zum Zurückziehen:</strong><br />
                    Deine Seite ist dann nicht mehr öffentlich erreichbar, bleibt aber bestehen und kann jederzeit wieder veröffentlicht werden.
                  </p>
                </div>
              )}
              
              <button
                onClick={handlePublishToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors mt-2 ${
                  isPublished
                    ? 'bg-red-600 hover:bg-red-500 disabled:bg-red-600/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50'
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird verarbeitet...
                  </span>
                ) : (
                  isPublished ? 'Seite zurückziehen' : 'Jetzt veröffentlichen'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-900" />

      {/* Section 2: Account */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">Account</h2>
          <p className="text-sm text-zinc-500">
            Verwaltung deines Accounts und Abos
          </p>
        </div>

        <div className="space-y-4">
          {/* Login / Email (Read-only) */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5 opacity-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-zinc-300 mb-1">Login</h3>
                <p className="text-xs text-zinc-500">
                  E-Mail-Adresse ändern (coming soon)
                </p>
              </div>
              <span className="text-xs text-zinc-600 px-2 py-1 rounded bg-zinc-800/50">
                Bald verfügbar
              </span>
            </div>
          </div>

          {/* Password Change */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5 opacity-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-zinc-300 mb-1">Passwort ändern</h3>
                <p className="text-xs text-zinc-500">
                  Sicheres Passwort festlegen
                </p>
              </div>
              <span className="text-xs text-zinc-600 px-2 py-1 rounded bg-zinc-800/50">
                Bald verfügbar
              </span>
            </div>
          </div>

          {/* Subscription / Abo */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5 opacity-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-zinc-300 mb-1">Abo</h3>
                <p className="text-xs text-zinc-500">
                  Plan verwalten und Zahlungsmethode ändern
                </p>
              </div>
              <span className="text-xs text-zinc-600 px-2 py-1 rounded bg-zinc-800/50">
                Bald verfügbar
              </span>
            </div>
          </div>

          {/* Logout */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-5">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
