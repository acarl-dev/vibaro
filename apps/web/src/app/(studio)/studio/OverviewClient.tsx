"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
};

type LinkType = {
  id: number;
  title: string;
  url: string;
  position: number;
};

type ContentCounts = {
  releases: number;
  shows: number;
  videos: number;
  gallery: number;
  links: number;
};

type OverviewClientProps = {
  initialPage: ArtistPage;
  initialLinks: LinkType[];
  contentCounts: ContentCounts;
};

export default function OverviewClient({ initialPage, initialLinks, contentCounts }: OverviewClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isProfileComplete = !!(
    initialPage.handle &&
    initialPage.display_name?.trim() &&
    initialPage.bio?.trim()
  );

  const hasContent = {
    releases: contentCounts.releases > 0,
    shows: contentCounts.shows > 0,
    videos: contentCounts.videos > 0,
    gallery: contentCounts.gallery > 0,
    links: contentCounts.links > 0,
  };

  const handlePublishToggle = async () => {
    setIsLoading(true);
    try {
      const endpoint = initialPage.is_published 
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

  const completionItems = [
    { label: "Profil ausgefüllt", completed: isProfileComplete, link: "/studio/profile" },
    { label: "Releases hochgeladen", completed: hasContent.releases, link: "/studio/releases" },
    { label: "Shows hinzugefügt", completed: hasContent.shows, link: "/studio/shows" },
    { label: "Links verknüpft", completed: hasContent.links, link: "/studio/links" },
    { label: "Videos hochgeladen", completed: hasContent.videos, link: "/studio/videos" },
    { label: "Galerie befüllt", completed: hasContent.gallery, link: "/studio/gallery" },
  ];

  const publicUrl = initialPage.handle ? `/p/${initialPage.handle}` : null;
  const completedCount = completionItems.filter(item => item.completed).length;
  const totalCount = completionItems.length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Übersicht</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Dein Dashboard für alle wichtigen Informationen und Aktionen.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Publishing Status & Public Link */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-zinc-300 mb-3">Veröffentlichungs-Status</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    initialPage.is_published 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${initialPage.is_published ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {initialPage.is_published ? 'Veröffentlicht' : 'Nicht veröffentlicht'}
                  </span>
                </div>

                {publicUrl && (
                  <div className="space-y-2">
                    <Link 
                      href={publicUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Seitenvorschau
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                    <p className="text-xs text-zinc-500">
                      vibaro.com{publicUrl}
                    </p>
                  </div>
                )}

                {!initialPage.is_published && publicUrl && (
                  <p className="text-xs text-zinc-500">
                    Deine Seite ist noch nicht öffentlich sichtbar. Veröffentliche sie, wenn du bereit bist.
                  </p>
                )}
              </div>

              <button
                onClick={handlePublishToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap ${
                  initialPage.is_published
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
                  initialPage.is_published ? 'Zurückziehen' : 'Jetzt veröffentlichen'
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats - Placeholder for Analytics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard 
              label="Seitenaufrufe" 
              value="—" 
              subtext="Bald verfügbar"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            />
            <StatCard 
              label="Link-Klicks" 
              value="—" 
              subtext="Bald verfügbar"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
            />
            <StatCard 
              label="Gesamt-Inhalte" 
              value={(contentCounts.releases + contentCounts.shows + contentCounts.videos + contentCounts.gallery + contentCounts.links).toString()} 
              subtext="Einträge"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          </div>

          {/* Completion Checklist */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-300">Vervollständige deine Seite</h2>
              <span className="text-xs text-zinc-500">
                {completedCount}/{totalCount} erledigt
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {completionItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    item.completed 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-zinc-800 text-zinc-600'
                  }`}>
                    {item.completed ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <span className={`text-sm flex-1 ${
                    item.completed ? 'text-zinc-400' : 'text-zinc-300'
                  }`}>
                    {item.label}
                  </span>
                  <svg 
                    className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Schnellaktionen</h2>
            <div className="space-y-2">
              <QuickActionButton 
                href="/studio/releases"
                label="Release hinzufügen"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                }
              />
              <QuickActionButton 
                href="/studio/shows"
                label="Show eintragen"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <QuickActionButton 
                href="/studio/links"
                label="Link hinzufügen"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                }
              />
              <QuickActionButton 
                href="/studio/videos"
                label="Video hochladen"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              />
              <QuickActionButton 
                href="/studio/gallery"
                label="Galerie-Bild"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <h2 className="text-sm font-medium text-zinc-300 mb-4">Dein Account</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {initialPage.avatar_url ? (
                  <img
                    src={initialPage.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-zinc-800"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 truncate">
                    {initialPage.display_name || 'Kein Name'}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    @{initialPage.handle || 'kein-handle'}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-zinc-800">
                <Link
                  href="/studio/settings"
                  className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Einstellungen
                </Link>
              </div>
            </div>
          </div>

          {/* Plan Info */}
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-900/10 p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-medium text-emerald-400">Free Plan</h3>
                <p className="text-xs text-zinc-500 mt-1">Alle Basis-Features</p>
              </div>
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <Link
              href="/studio/settings"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
            >
              Mehr erfahren
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ 
  label, 
  value, 
  subtext, 
  icon 
}: { 
  label: string; 
  value: string; 
  subtext: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-zinc-500">
          {icon}
        </div>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-zinc-200">{value}</div>
      <div className="text-xs text-zinc-600 mt-1">{subtext}</div>
    </div>
  );
}

function QuickActionButton({ 
  href, 
  label, 
  icon 
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
    >
      <div className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
        {icon}
      </div>
      <span className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors flex-1">
        {label}
      </span>
      <svg 
        className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
