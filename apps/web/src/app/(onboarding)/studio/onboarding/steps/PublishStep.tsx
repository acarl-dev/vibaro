"use client";

import { StepHeader, ActionRow } from "./onboarding-shared";

type PublishStepProps = {
  handle: string;
  displayName: string;
  bio: string;
  publishing: boolean;
  publishError: string | null;
  onPublish: () => void;
  onSkip: () => void;
  onBack: () => void;
};

export default function PublishStep({
  handle,
  displayName,
  bio,
  publishing,
  publishError,
  onPublish,
  onSkip,
  onBack,
}: PublishStepProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <StepHeader
          title="Fast fertig."
          description="So sieht deine Seite aus. Du kannst jetzt ver\u00f6ffentlichen oder das Studio erst erkunden."
        />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="border-b border-zinc-800/60 bg-zinc-900/80 px-5 py-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600">vibaro.app/p/{handle}</span>
          </div>
          <div className="px-6 py-8 space-y-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold tracking-tight text-zinc-100">{displayName}</p>
              <p className="text-xs text-zinc-500">vibaro.app/p/{handle}</p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">{bio}</p>
            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 px-3 py-1 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                Entwurf \u2013 noch nicht sichtbar
              </div>
            </div>
          </div>
        </div>

        {publishError && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
            <p className="text-sm text-red-400">{publishError}</p>
          </div>
        )}

        <ActionRow onBack={onBack} backLabel="Kontakt">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onSkip}
              disabled={publishing}
              className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-40"
            >
              Sp\u00e4ter
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={publishing}
              className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {publishing ? "Ver\u00f6ffentliche\u2026" : "Ver\u00f6ffentlichen \u2192"}
            </button>
          </div>
        </ActionRow>
      </div>
    </div>
  );
}
