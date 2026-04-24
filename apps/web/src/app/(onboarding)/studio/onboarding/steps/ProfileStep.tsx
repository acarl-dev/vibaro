"use client";

import { StepHeader, FieldLabel, ActionRow } from "./onboarding-shared";
import type { PhaseType, ReleaseKind, LiveKind } from "./onboarding-shared";

type PhaseContextStepProps = {
  phaseType: PhaseType;
  releaseKind: ReleaseKind;
  setReleaseKind: (v: ReleaseKind) => void;
  liveKind: LiveKind;
  setLiveKind: (v: LiveKind) => void;
  phaseTitle: string;
  setPhaseTitle: (v: string) => void;
  phaseLabel: string;
  setPhaseLabel: (v: string) => void;
  onContinue: () => void;
  onBack: () => void;
  generating: boolean;
  generateError: string | null;
};

export default function PhaseContextStep({
  phaseType,
  releaseKind,
  setReleaseKind,
  liveKind,
  setLiveKind,
  phaseTitle,
  setPhaseTitle,
  phaseLabel,
  setPhaseLabel,
  onContinue,
  onBack,
  generating,
  generateError,
}: PhaseContextStepProps) {
  const title = phaseType === "release" ? "Was ver\u00f6ffentlicht ihr gerade?" : "Was steht an?";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <StepHeader title={title} />

        <div className="space-y-6">
          {phaseType === "release" && (
            <>
              <div className="space-y-2">
                <FieldLabel>Format</FieldLabel>
                <div className="flex gap-2">
                  {(["single", "album", "video"] as ReleaseKind[]).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setReleaseKind(kind)}
                      className={[
                        "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                        releaseKind === kind
                          ? "border-zinc-300 bg-zinc-800 text-zinc-50"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700",
                      ].join(" ")}
                    >
                      {kind === "single" ? "Single" : kind === "album" ? "Album" : "Video"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-zinc-600">Wie hei\u00dft der Track / das Album? <span className="text-zinc-700">(optional)</span></p>
                <input
                  type="text"
                  value={phaseTitle}
                  onChange={(e) => setPhaseTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  placeholder={
                    releaseKind === "single"
                      ? "z.B. Fade Out"
                      : releaseKind === "album"
                      ? "z.B. Dark Horizon"
                      : "z.B. Behind the Scenes"
                  }
                  autoFocus
                />
              </div>
            </>
          )}

          {phaseType === "live" && (
            <>
              <div className="space-y-2">
                <FieldLabel>Art</FieldLabel>
                <div className="flex gap-2">
                  {(["concert", "tour"] as LiveKind[]).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setLiveKind(kind)}
                      className={[
                        "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                        liveKind === kind
                          ? "border-zinc-300 bg-zinc-800 text-zinc-50"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700",
                      ].join(" ")}
                    >
                      {kind === "concert" ? "Konzert" : "Tour"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-zinc-600">{liveKind === "concert" ? "In welcher Stadt?" : "Wie hei\u00dft die Tour?"} <span className="text-zinc-700">(optional)</span></p>
                <input
                  type="text"
                  value={phaseLabel}
                  onChange={(e) => setPhaseLabel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  placeholder={liveKind === "concert" ? "z.B. Berlin" : "z.B. Spring Tour 2026"}
                  autoFocus
                />
              </div>
            </>
          )}

          {generateError && <p className="text-xs text-red-400">{generateError}</p>}

          <ActionRow onBack={onBack}>
            <button
              type="button"
              onClick={onContinue}
              disabled={generating}
              className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {generating ? "Erstelle Seite\u2026" : "Seite erstellen \u2192"}
            </button>
          </ActionRow>
        </div>
      </div>
    </div>
  );
}

