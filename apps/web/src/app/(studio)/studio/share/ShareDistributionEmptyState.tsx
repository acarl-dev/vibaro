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
      <StudioPageHeader title="DISTRIBUTION" subtitle="Erstelle Tracking-Links für deine Kanäle." />
      <StudioEmptyState
        icon={Megaphone}
        title="Keine aktive Phase"
        description="Starte zuerst eine Phase, um Tracking-Links zu generieren."
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