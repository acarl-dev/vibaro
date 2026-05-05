import StudioEmptyState from "../../components/StudioEmptyState";
import { Megaphone } from "../../components/StudioIcons";

type Props = {
  scheduledCount: number;
  onCreatePhase: () => void;
  onOpenPhases: () => void;
};

export default function PhaseEmptyStateCard({
  scheduledCount,
  onCreatePhase,
  onOpenPhases,
}: Props) {
  return (
    <StudioEmptyState
      icon={Megaphone}
      title="Keine aktive Phase"
      description="Eine Phase hält Release, Tour oder Merch-Push getrennt messbar. Starte eine Phase, bevor du Links verteilst."
      action={
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onCreatePhase}
            className="studio-btn studio-btn-primary"
          >
            Neue Phase starten
          </button>
          {scheduledCount > 0 && (
            <button
              onClick={onOpenPhases}
              className="text-xs underline"
              style={{ color: "var(--studio-accent)", background: "none", border: "none", cursor: "pointer" }}
            >
              {scheduledCount} geplante {scheduledCount === 1 ? "Phase" : "Phasen"} anzeigen
            </button>
          )}
        </div>
      }
    />
  );
}
