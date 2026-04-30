"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlatformSelector from "./PlatformSelector";
import PlacementSelector from "./PlacementSelector";
import { type Platform, type Placement, getCopyHint } from "@/lib/platforms";
import {
  fetchTrackingLinks,
  checkTrackingLinkExists,
  createTrackingLink,
  type TrackingLinkData,
} from "@/lib/api/tracking-links";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";
import ExplainPanel from "../../components/ExplainPanel";
import WhyButton from "../../components/WhyButton";
import ShareDistributionQRHint from "./ShareDistributionQRHint";
import ShareDistributionEmptyState from "./ShareDistributionEmptyState";
import ShareDistributionLinksList from "./ShareDistributionLinksList";

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
    return <ShareDistributionEmptyState onBackToPhaseOverview={() => router.push("/studio/share")} />;
  }

  const groupedLinks = Object.entries(
    allLinks.reduce((acc, link) => {
      if (!acc[link.platform]) {
        acc[link.platform] = [];
      }
      acc[link.platform].push(link);
      return acc;
    }, {} as Record<string, TrackingLinkData[]>)
  );

  return (
    <div>
      <StudioPageHeader
        title="DISTRIBUTION"
        subtitle={`Phase: ${activeSpotlight.title}`}
        action={
          <WhyButton
            label="Wie funktioniert das?"
            content={{
              title: "Distribution verstehen",
              what: "Du erzeugst hier spezielle Links für jede Plattform und Platzierung, die du nutzt.",
              why: "Jeder Link wird separat gemessen. Wenn du überall denselben Link benutzt, siehst du nur eine Gesamtzahl. Mit getrennten Links siehst du genau: 3 Klicks aus Instagram Story, 1 aus YouTube, 1 aus dem Newsletter.",
              example: "Song-Link für Instagram Story: 12 Klicks\nSong-Link für Instagram Bio: 4 Klicks\nSong-Link für YouTube-Kommentar: 2 Klicks\n\n→ Du weißt jetzt: Story performt am besten.",
              tip: "Erstelle für jede Plattform mindestens einen Story- und einen Bio-Link. Das reicht für die meisten Releases.",
            }}
          />
        }
      />

      <ExplainPanel
        heading="Was ist Distribution?"
        body={[
          "Hier erzeugst du spezielle Tracking-Links – einen pro Plattform und Platzierung.",
          "Wenn du überall denselben Link benutzt, siehst du nur \"5 Klicks gesamt\". Mit getrennten Links siehst du: 3 aus Instagram Story, 1 aus YouTube, 1 aus dem Newsletter.",
        ]}
        nextSteps={[
          "Wähle unten eine Plattform (z. B. Instagram)",
          "Wähle eine Platzierung (z. B. Story oder Bio)",
          "Kopiere den generierten Link und poste ihn dort",
        ]}
        examples={[
          { icon: "📱", label: "Du postest heute Abend eine Story: \"Neuer Song draußen!\"", description: "\u2192 Nimm den Instagram Story-Link. Nicht den Bio-Link. Sonst weißt du nicht, woher der Klick kam." },
          { icon: "🔗", label: "Die Story läuft ab – du packst den Song für 2 Wochen in deine Bio", description: "\u2192 Nimm jetzt den Instagram Bio-Link. So bleiben Story und Bio getrennt messbar." },
          { icon: "📊", label: "Du schaltest Werbung für deinen Song", description: "\u2192 Nimm den Instagram Ad-Link. Dann siehst du genau, wie viele Klicks deine Ads gebracht haben." },
        ]}
        tip={{ text: "Erstelle mindestens Story + Bio für jede Plattform, die du aktiv nutzt. Das reicht für einen guten Überblick." }}
      />

      <div className="space-y-8">
        <ShareDistributionQRHint />

        {/* Platform Selector */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <WhyButton
              label="Warum mehrere Links?"
              content={{
                title: "Warum mehrere Links?",
                what: "Du kannst für dieselbe Seite mehrere verschiedene Tracking-Links erstellen – einen pro Plattform und Platzierung.",
                why: "Weil du nie weeißt, wo deine Fans wirklich klicken. Wenn du überall denselben Link verwendest, siehst du nur \u201e5 Klicks\u201c. Mit getrennten Links siehst du: 3 Klicks aus Instagram Story, 1 aus YouTube, 1 aus dem Newsletter.",
                example: "Gleicher Song, 3 verschiedene Links:\n\n📱 Story-Link: 12 Klicks\n🔗 Bio-Link: 4 Klicks\n📊 Ad-Link: 31 Klicks\n\n→ Deine Ads bringen am meisten. Das weißt du jetzt.",
                tip: "Erstelle mindestens 2 Links (z. B. Story + Bio) für jede Plattform, die du aktiv nutzt.",
              }}
            />
          </div>
          <PlatformSelector 
            onSelect={handlePlatformSelect} 
            selectedPlatformId={selectedPlatform?.id}
          />
        </div>

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
                {/* Ready badge */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "var(--studio-success)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--studio-success)]" />
                    Link bereit
                  </span>
                  <span className="text-xs" style={{ color: "var(--studio-text-secondary)", opacity: 0.6 }}>
                    {existingLink.click_count} Klicks
                  </span>
                </div>

                {/* URL + actions */}
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
                  <a
                    href={existingLink.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs"
                    style={{
                      color: "var(--studio-text-secondary)",
                      border: "1px solid var(--studio-border)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      textDecoration: "none",
                      lineHeight: 1.4,
                    }}
                  >
                    &#8599;
                  </a>
                </div>

                {/* Tracking active hint */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--studio-success)" }} />
                  <span className="text-xs" style={{ color: "var(--studio-text-secondary)", opacity: 0.7 }}>
                    Tracking ist aktiv
                    {copyHint && <span> &middot; {copyHint}</span>}
                  </span>
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

        {allLinks.length > 0 && (
          <ShareDistributionLinksList
            totalLinks={allLinks.length}
            groupedLinks={groupedLinks}
            onCopy={handleCopy}
          />
        )}
      </div>

    </div>
  );
}
