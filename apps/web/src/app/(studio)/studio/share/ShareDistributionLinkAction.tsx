import { type Platform, type Placement } from "@/lib/platforms";
import { type TrackingLinkData } from "@/lib/api/tracking-links";

type ShareDistributionLinkActionProps = {
  selectedPlatform: Platform | null;
  selectedPlacement: Placement | null;
  existingLink: TrackingLinkData | null;
  isCreating: boolean;
  copyHint: string;
  onCopy: (url: string) => void;
  onCreate: () => void;
};

export default function ShareDistributionLinkAction({
  selectedPlatform,
  selectedPlacement,
  existingLink,
  isCreating,
  copyHint,
  onCopy,
  onCreate,
}: ShareDistributionLinkActionProps) {
  if (!selectedPlatform || !selectedPlacement) {
    return null;
  }

  return (
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
              onClick={() => onCopy(existingLink.tracking_url)}
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
            onClick={onCreate}
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
  );
}