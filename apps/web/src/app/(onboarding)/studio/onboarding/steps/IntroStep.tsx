"use client";

import type { FormEvent } from "react";
import { StepHeader, FieldLabel } from "./onboarding-shared";

type HandleStatus = "idle" | "checking" | "available" | "unavailable";

type BandNameStepProps = {
  displayName: string;
  setDisplayName: (v: string) => void;
  handle: string;
  handleStatus: HandleStatus;
  handleError: string | null;
  onDisplayNameChange: (name: string) => void;
  onSubmit: (e: FormEvent) => void;
  saving: boolean;
};

export default function BandNameStep({
  displayName,
  setDisplayName,
  handle,
  handleStatus,
  handleError,
  onDisplayNameChange,
  onSubmit,
  saving,
}: BandNameStepProps) {
  const canSubmit =
    displayName.trim().length > 0 &&
    handle.length >= 3 &&
    handleStatus === "available" &&
    !saving;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-10">
        <StepHeader
          currentStep="band-name"
          title="Wie heißt eure Band?"
          description="Gebt euren Bandnamen ein – eure Webadresse wird automatisch erstellt."
        />

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <FieldLabel>Bandname</FieldLabel>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                onDisplayNameChange(e.target.value);
              }}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5 text-base text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
              placeholder="z.B. Dark Signal"
              autoFocus
            />
          </div>

          {displayName.trim().length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3">
              <span className="text-sm text-zinc-600 select-none whitespace-nowrap">vibaro.app/p/</span>
              <span className="text-sm text-zinc-300 min-w-0 truncate">{handle || "\u2026"}</span>
              <span className="ml-auto shrink-0">
                {handleStatus === "checking" && <span className="text-xs text-zinc-600">Pr\u00fcfe\u2026</span>}
                {handleStatus === "available" && <span className="text-xs text-emerald-500">\u2713 Frei</span>}
                {handleStatus === "unavailable" && <span className="text-xs text-red-400">\u2717</span>}
              </span>
            </div>
          )}

          {handleError && <p className="text-xs text-red-400">{handleError}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-zinc-50 px-7 py-3.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Erstelle Seite\u2026" : "Weiter \u2192"}
          </button>
        </form>
      </div>
    </div>
  );
}

