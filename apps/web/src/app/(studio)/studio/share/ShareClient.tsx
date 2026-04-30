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

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const links = await fetchTrackingLinks();
    setAllLinks(links);
  };

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
        target_url: activeSpotlight.primary_url || "https://vibaro.com",
      });

      if (result.success && result.data) {
        await navigator.clipboard.writeText(result.data.tracking_url);

        const hint = getCopyHint(selectedPlatform.id, selectedPlacement.id);
        setCopyHint(hint);
        showToast("Link erstellt & kopiert!", "success", hint || undefined);

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

  const phaseLinks = allLinks.filter(
    (link) => link.spotlight_id === activeSpotlight.id
  );

  const groupedLinks = Object.entries(
    phaseLinks.reduce((acc, link) => {
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
        title="LINKS VERTEILEN"
        subtitle={`Phase: ${activeSpotlight.title} · Erstelle je Kanal einen eigenen Link, damit du spaeter siehst, woher Klicks kamen.`}
        action={
          <WhyButton
            label="Wie funktioniert das?"
            content={{
              title: "Links verteilen verstehen",
              what: "Hier erstellst du pro Kanal und Platzierung einen eigenen Link fuer deinen aktuellen Push.",
              why: "Nur mit getrennten Links siehst du spaeter messbar, was funktioniert: zum Beispiel Instagram Story, Bio, Newsletter oder YouTube separat.",
              example: "Instagram Story: 12 Klicks\nInstagram Bio: 4 Klicks\nYouTube: 2 Klicks\n\nDu siehst sofort, welcher Kanal fuer diese Phase am meisten bringt.",
              tip: "Lege fuer jeden aktiven Kanal mindestens einen eigenen Link an. So bleibt deine Phase sauber messbar.",
            }}
          />
        }
      />

      <ExplainPanel
        heading="Was ist Links verteilen?"
        body={[
          "Hier erstellst du je Kanal einen eigenen Link fuer deine aktuelle Phase.",
          "Wenn du ueberall denselben Link benutzt, siehst du nur Klicks gesamt. Mit getrennten Links erkennst du spaeter, woher die Klicks kamen.",
        ]}
        nextSteps={[
          "Waehle unten eine Plattform (z. B. Instagram)",
          "Waehle eine Platzierung (z. B. Story oder Bio)",
          "Kopiere den Link und verteile ihn genau dort",
        ]}
        examples={[
          { icon: "📱", label: "Du postest heute Abend eine Story", description: "Nutze den Instagram-Story-Link. Dann bleibt messbar, ob genau diese Story Klicks gebracht hat." },
          { icon: "🔗", label: "Danach landet der Push in eurer Bio", description: "Nutze dafuer den Bio-Link. So bleiben Story und Bio in dieser Phase getrennt auswertbar." },
          { icon: "📊", label: "Ihr bewerbt den Release gezielt", description: "Nutze fuer Ads oder Newsletter jeweils den passenden Link. Dann siehst du spaeter, welcher Kanal wirklich funktioniert." },
        ]}
        tip={{ text: "Produktloop: 1. Fokus festlegen · 2. Links und QR teilen · 3. Performance dieser Phase pruefen." }}
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

        {phaseLinks.length > 0 && (
          <ShareDistributionLinksList
            totalLinks={phaseLinks.length}
            groupedLinks={groupedLinks}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
}
