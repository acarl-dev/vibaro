"use client";

import type React from "react";

export type Step = "band-name" | "phase" | "phase-context" | "preview";
export type PhaseType = "release" | "live" | "merch" | "studio";
export type ReleaseKind = "single" | "album" | "video";
export type LiveKind = "concert" | "tour";

export function StepHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-5">
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">Vibaro</span>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500">
      {children}
    </label>
  );
}

export function ActionRow({
  onBack,
  backLabel = "Zur\u00fcck",
  children,
}: {
  onBack?: () => void;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-zinc-800/60">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          \u2190 {backLabel}
        </button>
      ) : (
        <span />
      )}
      {children}
    </div>
  );
}
