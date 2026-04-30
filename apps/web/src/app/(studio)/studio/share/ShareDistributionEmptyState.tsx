import StudioPageHeader from "../../components/StudioPageHeader";
import StudioEmptyState from "../../components/StudioEmptyState";
import { Megaphone } from "../../components/StudioIcons";

type ShareDistributionEmptyStateProps = {
  onBackToPhaseOverview: () => void;
};

export default function ShareDistributionEmptyState({
  onBackToPhaseOverview,
}: ShareDistributionEmptyStateProps) {
  return (
    <div>
      <StudioPageHeader title="LINKS VERTEILEN" subtitle="Erstelle je Kanal einen eigenen Link, damit du später siehst, woher Klicks kamen." />
      <StudioEmptyState
        icon={Megaphone}
        title="Keine aktive Phase"
        description="Eine Phase hält Release, Tour oder Merch-Push getrennt messbar. Starte zuerst eine Phase, bevor du Links verteilst."
        action={
          <button
            onClick={onBackToPhaseOverview}
            className="studio-btn studio-btn-primary"
          >
            Zur Phase-Übersicht
          </button>
        }
      />
    </div>
  );
}