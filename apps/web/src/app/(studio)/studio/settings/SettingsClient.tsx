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
    <>
      {/* Appearance - Link to appearance page */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Appearance</h2>
        
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">
            Wähle ein Template und Style für deine Seite.
          </p>
          <a
            href="/studio/settings/appearance"
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            Template & Style anpassen
            <span className="text-zinc-600">→</span>
          </a>
        </div>
      </div>

      {/* Handle */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Deine Webadresse</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Handle <span className="text-zinc-600">(stabil)</span>
            </label>
            <input
              type="text"
              value={handle}
              disabled
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-zinc-600">
              Dein Handle bleibt stabil und kann später geändert werden.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={`/p/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Öffentliche Seite ansehen →
            </a>
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Veröffentlichung</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
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
          
          <button
            onClick={handlePublishToggle}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
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

      {/* Account Actions */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Konto</h2>
        
        <div className="space-y-3">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Abmelden
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
