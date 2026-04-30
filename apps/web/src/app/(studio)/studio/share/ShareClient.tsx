"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import ShareDistributionLinkAction from "./ShareDistributionLinkAction";
import ShareDistributionSelection from "./ShareDistributionSelection";

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

        <ShareDistributionSelection
          selectedPlatform={selectedPlatform}
          selectedPlacement={selectedPlacement}
          onPlatformSelect={handlePlatformSelect}
          onPlacementSelect={handlePlacementSelect}
        />

        {selectedPlatform && selectedPlacement && (
          <ShareDistributionLinkAction
            selectedPlatform={selectedPlatform}
            selectedPlacement={selectedPlacement}
            existingLink={existingLink}
            isCreating={isCreating}
            copyHint={copyHint}
            onCopy={handleCopy}
            onCreate={handleCreate}
          />
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
