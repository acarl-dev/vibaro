import { type Platform, type Placement } from "@/lib/platforms";
import PlatformSelector from "./PlatformSelector";
import PlacementSelector from "./PlacementSelector";
import WhyButton from "../../components/WhyButton";

type ShareDistributionSelectionProps = {
  selectedPlatform: Platform | null;
  selectedPlacement: Placement | null;
  onPlatformSelect: (platform: Platform) => void;
  onPlacementSelect: (placement: Placement) => void;
};

export default function ShareDistributionSelection({
  selectedPlatform,
  selectedPlacement,
  onPlatformSelect,
  onPlacementSelect,
}: ShareDistributionSelectionProps) {
  return (
    <>
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
              tip: "Erstelle mindestens 2 Links (z. B. Story + Bio) für jede Plattform, die du aktiv nutzt.",
            }}
          />
        </div>
        <PlatformSelector
          onSelect={onPlatformSelect}
          selectedPlatformId={selectedPlatform?.id}
        />
      </div>

      {/* Placement Selector */}
      {selectedPlatform && (
        <PlacementSelector
          platform={selectedPlatform}
          onSelect={onPlacementSelect}
          selectedPlacementId={selectedPlacement?.id}
        />
      )}
    </>
  );
}
