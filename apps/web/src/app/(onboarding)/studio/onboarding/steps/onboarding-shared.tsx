"use client";

import type React from "react";

export type Step = "intro" | "identity" | "profile" | "contact" | "publish";

export const STEPS: { key: Step; label: string }[] = [
  { key: "identity", label: "Identit\u00e4t" },
  { key: "profile", label: "Profil" },
  { key: "contact", label: "Kontakt" },
  { key: "publish", label: "Fertig" },
];

export function StepHeader({
  title,
  description,
  currentStep,
}: {
  title: string;
  description: string;
  currentStep: Step;
}) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">Vibaro</span>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={[
                    "flex items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                    active
                      ? "h-6 w-6 bg-zinc-50 text-zinc-900"
                      : done
                      ? "h-5 w-5 bg-zinc-700 text-zinc-300"
                      : "h-5 w-5 border border-zinc-800 text-zinc-600",
                  ].join(" ")}
                >
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={["h-px w-5 transition-colors", done ? "bg-zinc-600" : "bg-zinc-800"].join(" ")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-zinc-500">{description}</p>
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
