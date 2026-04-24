"use client";

import { StepHeader } from "./onboarding-shared";
import type { PhaseType } from "./onboarding-shared";

type PhaseStepProps = {
  onSelect: (phase: PhaseType) => void;
  generating: boolean;
  generateError: string | null;
  onBack: () => void;
};

const PHASES: { value: PhaseType; label: string; desc: string }[] = [
  { value: "release", label: "Release", desc: "Neue Single, Album oder Video" },
  { value: "live", label: "Live", desc: "Konzert oder Tour" },
  { value: "merch", label: "Merch", desc: "Neues Merch verf\u00fcgbar" },
  { value: "studio", label: "Studio", desc: "Ihr arbeitet an neuer Musik" },
];

export default function PhaseStep({ onSelect, generating, generateError, onBack }: PhaseStepProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <StepHeader
          title="Was passiert gerade bei euch?"
          description="W\u00e4hlt, was gerade bei euch los ist. Es erscheint sofort auf eurer Seite."
        />

        <div className="grid grid-cols-2 gap-3">
          {PHASES.map((phase) => (
            <button
              key={phase.value}
              type="button"
              disabled={generating}
              onClick={() => onSelect(phase.value)}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition-all hover:border-zinc-600 hover:bg-zinc-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="mb-3">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500 group-hover:bg-zinc-300 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-zinc-100 mb-1">{phase.label}</p>
              <p className="text-xs text-zinc-600 leading-snug">{phase.desc}</p>
            </button>
          ))}
        </div>

        {generateError && <p className="text-xs text-red-400">{generateError}</p>}

        <button
          type="button"
          onClick={onBack}
          disabled={generating}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40"
        >
          \u2190 Zur\u00fcck
        </button>
      </div>

      {generating && (
        <div className="fixed inset-0 bg-zinc-950/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <div className="h-7 w-7 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-400">Erstelle eure Seite\u2026</p>
          </div>
        </div>
      )}
    </div>
  );
}
