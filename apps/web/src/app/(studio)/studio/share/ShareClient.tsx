"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlatformSelector from "./PlatformSelector";
import PlacementSelector from "./PlacementSelector";
import { type Platform, type Placement, getPlatformById, getCopyHint } from "@/lib/platforms";
import {
  fetchTrackingLinks,
  checkTrackingLinkExists,
  createTrackingLink,
  type TrackingLinkData,
} from "@/lib/api/tracking-links";
import { useToast } from "@/context/ToastContext";

type ShareClientProps = {
  activeSpotlight: {
    id: number;
    title: string;
    slug: string;
    primary_url?: string;
  } | null;
};

export default function ShareClient({ activeSpotlight }: ShareClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [existingLink, setExistingLink] = useState<TrackingLinkData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copyHint, setCopyHint] = useState<string>("");
  const [allLinks, setAllLinks] = useState<TrackingLinkData[]>([]);

  // Load all links on mount
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const links = await fetchTrackingLinks();
    setAllLinks(links);
  };

  // Check for existing link when platform/placement selected
  useEffect(() => {
    if (!activeSpotlight || !selectedPlatform || !selectedPlacement) {
      setExistingLink(null);
      setCopyHint("");
      return;
    }

    const checkExisting = async () => {
      const existing = await checkTrackingLinkExists(
        activeSpotlight.id,
        selectedPlatform.id,
        selectedPlacement.id
      );
      setExistingLink(existing);

      if (existing) {
        const hint = getCopyHint(selectedPlatform.id, selectedPlacement.id);
        setCopyHint(hint);
      }
    };

    checkExisting();
  }, [activeSpotlight, selectedPlatform, selectedPlacement]);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedPlacement(null);
    setExistingLink(null);
  };

  const handlePlacementSelect = (placement: Placement) => {
    setSelectedPlacement(placement);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link kopiert!", "success");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCreate = async () => {
    if (!activeSpotlight || !selectedPlatform || !selectedPlacement) return;

    setIsCreating(true);
    try {
      const result = await createTrackingLink({
        spotlight_id: activeSpotlight.id,
        platform: selectedPlatform.id,
        placement: selectedPlacement.id,
        target_url: activeSpotlight.primary_url || "https://vibaro.com", // TODO: Get from spotlight
      });

      if (result.success && result.data) {
        // Auto-copy the new link
        await navigator.clipboard.writeText(result.data.tracking_url);

        const hint = getCopyHint(selectedPlatform.id, selectedPlacement.id);
        setCopyHint(hint);
        showToast("Link erstellt & kopiert!", "success", hint || undefined);

        // Reload links
        await loadLinks();
        setExistingLink(result.data);
      } else {
        showToast(result.error || "Fehler beim Erstellen", "error");
      }
    } catch (error) {
      console.error("Error creating link:", error);
      showToast("Netzwerkfehler. Bitte erneut versuchen.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (!activeSpotlight) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Teilen</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Erstelle Tracking-Links für deine Kanäle.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">
            <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-300">Kein aktives Spotlight</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Erstelle zuerst ein Spotlight, um Tracking-Links zu generieren.
          </p>
          <button
            onClick={() => router.push("/studio/project")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Spotlight erstellen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Teilen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Erstelle Tracking-Links für <span className="text-zinc-300 font-medium">{activeSpotlight.title}</span>
        </p>
      </div>

      <div className="space-y-8">
        {/* Platform Selector */}
        <PlatformSelector 
          onSelect={handlePlatformSelect} 
          selectedPlatformId={selectedPlatform?.id}
        />

        {/* Placement Selector */}
        {selectedPlatform && (
          <PlacementSelector
            platform={selectedPlatform}
            onSelect={handlePlacementSelect}
            selectedPlacementId={selectedPlacement?.id}
          />
        )}

        {/* Link Action: Copy or Create */}
        {selectedPlatform && selectedPlacement && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-sm font-medium text-zinc-400 mb-4">3. Link verwenden</h2>
            
            {existingLink ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-zinc-300 truncate">
                    {existingLink.tracking_url}
                  </span>
                  <button
                    onClick={() => handleCopy(existingLink.tracking_url)}
                    className="shrink-0 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    Kopieren
                  </button>
                </div>

                {copyHint && (
                  <div className="rounded-md bg-blue-500/10 border border-blue-500/20 px-4 py-3">
                    <p className="text-sm text-blue-300">
                      💡 <span className="font-medium">Tipp:</span> {copyHint}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span>{existingLink.click_count} Klicks</span>
                  <span>·</span>
                  <span>Erstellt: {new Date(existingLink.created_at).toLocaleDateString("de-DE")}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Dieser Link existiert noch nicht. Erstelle ihn jetzt.
                </p>
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Erstelle...
                    </>
                  ) : (
                    <>Link erstellen & kopieren</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* All Links Overview - Grouped by Platform */}
        {allLinks.length > 0 && (
          <div className="pt-8 border-t border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-400 mb-4">Alle Links ({allLinks.length})</h2>
            <div className="space-y-6">
              {Object.entries(
                allLinks.reduce((acc, link) => {
                  if (!acc[link.platform]) {
                    acc[link.platform] = [];
                  }
                  acc[link.platform].push(link);
                  return acc;
                }, {} as Record<string, TrackingLinkData[]>)
              ).map(([platform, links]) => {
                const platformInfo = getPlatformById(platform);
                const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
                
                return (
                  <div key={platform}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{platformInfo?.icon || '🔗'}</span>
                      <h3 className="text-sm font-medium text-zinc-300">
                        {platformInfo?.label || platform}
                      </h3>
                      <span className="text-xs text-zinc-500">
                        {links.length} {links.length === 1 ? 'Link' : 'Links'} · {totalClicks} Klicks
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:bg-zinc-900 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-100">{link.label}</p>
                            <p className="text-xs text-zinc-500 font-mono mt-0.5">{link.short_code}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-sm text-zinc-400">{link.click_count} Klicks</span>
                            <button
                              onClick={() => handleCopy(link.tracking_url)}
                              className="rounded-md p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                              title="Link kopieren"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
