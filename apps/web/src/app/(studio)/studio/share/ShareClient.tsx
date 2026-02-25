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
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import { Megaphone } from "../../components/StudioIcons";

type ShareClientProps = {
  activeSpotlight: {
    id: number;
    title: string;
    slug: string;
    primary_url?: string;
  } | null;
  pageUrl: string | null;
};

export default function ShareClient({ activeSpotlight, pageUrl }: ShareClientProps) {
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
      <div>
        <StudioPageHeader title="DISTRIBUTION" subtitle="Erstelle Tracking-Links für deine Kanäle." />
        <StudioEmptyState
          icon={Megaphone}
          title="Keine aktive Phase"
          description="Starte zuerst eine Phase, um Tracking-Links zu generieren."
          action={
            <button
              onClick={() => router.push("/studio/share")}
              className="studio-btn studio-btn-primary"
            >
              Zur Phase-Übersicht
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <StudioPageHeader
        title="DISTRIBUTION"
        subtitle={`Phase: ${activeSpotlight.title}`}
      />

      <div className="space-y-8">
        {/* QR link — full QR page is at /studio/share/qr */}
        <div
          className="rounded-lg p-4 flex items-center justify-between"
          style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}
        >
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-primary)" }}>QR & Offline</p>
            <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", marginTop: "2px" }}>QR-Code für diese Phase</p>
          </div>
          <a
            href="/studio/share/qr"
            style={{ fontSize: "12px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}
          >
            Zum QR-Code →
          </a>
        </div>

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
          <div className="rounded-lg p-6" style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>3. Link verwenden</h2>
            
            {existingLink ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded px-4 py-3" style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface-elevated)" }}>
                  <span className="flex-1 truncate text-sm" style={{ color: "var(--studio-text-primary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>
                    {existingLink.tracking_url}
                  </span>
                  <button
                    onClick={() => handleCopy(existingLink.tracking_url)}
                    className="studio-btn studio-btn-primary shrink-0 text-xs"
                  >
                    Kopieren
                  </button>
                </div>

                {copyHint && (
                  <div className="rounded px-4 py-3" style={{ background: "var(--studio-accent-muted)", border: "1px solid var(--studio-accent)" }}>
                    <p className="text-sm" style={{ color: "var(--studio-accent)" }}>
                      <span className="font-semibold">Tipp:</span> {copyHint}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm" style={{ color: "var(--studio-text-secondary)" }}>
                  <span>{existingLink.click_count} Klicks</span>
                  <span>·</span>
                  <span>Erstellt: {new Date(existingLink.created_at).toLocaleDateString("de-DE")}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
                  Dieser Link existiert noch nicht. Erstelle ihn jetzt.
                </p>
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="studio-btn studio-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="pt-8" style={{ borderTop: "1px solid var(--studio-border)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Alle Links ({allLinks.length})</h2>
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
                      <h3 className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
                        {platformInfo?.label || platform}
                      </h3>
                      <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                        {links.length} {links.length === 1 ? 'Link' : 'Links'} · {totalClicks} Klicks
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between rounded p-3 transition-colors"
                          style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface-elevated)" }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: "var(--studio-text-primary)" }}>{link.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>{link.short_code}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>{link.click_count} Klicks</span>
                            <button
                              onClick={() => handleCopy(link.tracking_url)}
                              className="rounded p-1.5 transition-colors"
                              style={{ color: "var(--studio-text-secondary)" }}
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
