"use client";

import LivePreviewPanel from "@/app/(studio)/studio/page/LivePreviewPanel";

type PreviewStepProps = {
  displayName: string;
  handle: string;
  onFinish: () => void;
  onBack: () => void;
  finishing: boolean;
  finishError: string | null;
};

export default function PreviewStep({
  displayName,
  handle,
  onFinish,
  onBack,
  finishing,
  finishError,
}: PreviewStepProps) {
  const externalUrl = `https://vibaro.app/p/${handle}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
        <button
          type="button"
          onClick={onBack}
          disabled={finishing}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40"
        >
          ← Zurück
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-100">Eure Seite ist bereit.</p>
          <p className="text-xs text-zinc-600">
            {displayName} · vibaro.app/p/{handle}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={onFinish}
            disabled={finishing}
            className="rounded-full bg-zinc-50 px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {finishing ? "Wird gestartet…" : "Weiter → Studio"}
          </button>
          {finishError && <p className="text-xs text-red-400">{finishError}</p>}
        </div>
      </div>

      {/* Live preview */}
      <div className="flex-1 min-h-0">
        <LivePreviewPanel
          previewPath={`/p/${handle}`}
          externalUrl={externalUrl}
        />
      </div>
    </div>
  );
}

