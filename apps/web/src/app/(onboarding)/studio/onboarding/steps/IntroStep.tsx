"use client";

import type { Step } from "./onboarding-shared";

type IntroStepProps = {
  onNext: () => void;
};

export default function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-14">Vibaro</p>

      <div className="text-center space-y-3 max-w-lg">
        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
          Willkommen.<br />
          <span className="text-zinc-500">Deine Seite wartet auf dich.</span>
        </h1>
        <p className="text-sm text-zinc-600">
          Wir richten jetzt gemeinsam deinen Auftritt ein.{" "}
          <span className="text-zinc-500">Plane 10\u201320 Minuten daf\u00fcr ein.</span>
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-50" />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-300">Notwendig</p>
          </div>
          <ul className="space-y-2.5">
            {([
              { label: "K\u00fcnstlername", desc: "Dein \u00f6ffentlicher Name" },
              { label: "Genre", desc: "Was du machst, in einem Wort" },
              { label: "Bio", desc: "Ein paar S\u00e4tze \u00fcber dich" },
              { label: "Headerbild", desc: "Das Banner deiner Seite" },
              { label: "Kontakt", desc: "Booking- oder Kontakt-E-Mail" },
            ]).map(({ label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 text-zinc-400">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5l3 3L11.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm">
                  <span className="text-zinc-200">{label}</span>
                  <span className="block text-xs text-zinc-600">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/20 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Optional</p>
          </div>
          <ul className="space-y-2.5">
            {([
              { label: "Logo", desc: "Dein Profilbild" },
              { label: "Social Links", desc: "Instagram, Spotify & Co." },
              { label: "Shows", desc: "Kommende Auftritte" },
              { label: "Media", desc: "Player, Video-Links" },
              { label: "Bilder", desc: "Pressefotos & Galerie" },
              { label: "Presse", desc: "Zitate & Pressestimmen" },
            ]).map(({ label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-1 w-1 rounded-full bg-zinc-700 flex-shrink-0" />
                <span className="text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="block text-xs text-zinc-700">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-700 pt-1 border-t border-zinc-800/40">
            Alles davon kann jederzeit im Studio erg\u00e4nzt oder ge\u00e4ndert werden.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-zinc-50 px-10 py-3.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors shadow-lg shadow-black/40"
        >
          Loslegen
        </button>
        <p className="text-xs text-zinc-700">Alles l\u00e4sst sich sp\u00e4ter jederzeit anpassen.</p>
      </div>
    </div>
  );
}
