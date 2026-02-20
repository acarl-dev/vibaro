"use client";

import { useState } from "react";
import type { Spotlight } from "@/lib/api/stage";

// Map internal type → user-facing badge
const TYPE_LABELS: Record<string, string> = {
  release: "Release",
  tour: "Tour",
  announcement: "Video",
  other: "Merch",
};

function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + "…" : u.pathname;
    return u.hostname + path;
  } catch {
    return url.length > 40 ? url.slice(0, 40) + "…" : url;
  }
}

interface FocusSectionProps {
  activeSpotlight: Spotlight | null;
  allSpotlights: Spotlight[];
  totalClicks7d: number;
  onCreateFocus: (data: {
    title: string;
    type: "release" | "tour" | "announcement" | "other";
    primary_url: string;
  }) => Promise<void>;
  onChangeFocus: (id: number) => Promise<void>;
  onEndFocus: () => Promise<void>;
}

export default function FocusSection({
  activeSpotlight,
  allSpotlights,
  totalClicks7d,
  onCreateFocus,
  onChangeFocus,
  onEndFocus,
}: FocusSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "release" as "release" | "tour" | "announcement" | "other",
    primary_url: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      await onCreateFocus(form);
      setForm({ title: "", type: "release", primary_url: "" });
      setShowForm(false);
    } catch (err: any) {
      alert(err.message || "Konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── State A: No focus ──
  if (!activeSpotlight) {
    return (
      <section>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <h2 className="text-xl font-bold text-zinc-100 mb-2">
            Was steht gerade im Rampenlicht?
          </h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
            Neue Single? Album? Tour? Lege fest, worauf deine Fans jetzt klicken sollen.
          </p>

          {showForm ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <input
                  type="text"
                  placeholder="Titel (z.B. Neue Single)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-zinc-500 focus:outline-none transition-colors"
                >
                  <option value="release">Release</option>
                  <option value="tour">Tour</option>
                  <option value="announcement">Video</option>
                  <option value="other">Merch</option>
                </select>
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Wohin soll es gehen? (Spotify, YouTube, Tickets…)"
                  value={form.primary_url}
                  onChange={(e) => setForm({ ...form, primary_url: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-5 py-3 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Wird erstellt…" : "Fokus festlegen"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold transition-colors"
            >
              + Fokus festlegen
            </button>
          )}
        </div>
      </section>
    );
  }

  // ── State B: Focus active ──
  return (
    <section>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium mb-3">
              {TYPE_LABELS[activeSpotlight.type] || activeSpotlight.type}
            </span>
            <h3 className="text-xl font-bold text-zinc-100 mb-1 truncate">
              {activeSpotlight.title}
            </h3>
            <p className="text-sm text-zinc-500 mb-3">
              {shortenUrl(activeSpotlight.primary_url)}
            </p>
            <p className="text-xs text-zinc-400">
              Seit 7 Tagen:{" "}
              <span className="font-semibold text-zinc-200">{totalClicks7d} Klicks</span>
            </p>
          </div>
          <button
            onClick={() => setShowSelector(true)}
            className="shrink-0 px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
          >
            Ändern
          </button>
        </div>
      </div>

      {/* ── Change-Focus Modal ── */}
      {showSelector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSelector(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-zinc-100">Fokus ändern</h3>
              <button
                onClick={() => setShowSelector(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Current focus */}
            <div className="mb-5 pb-5 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Aktueller Fokus</p>
              <p className="text-sm font-medium text-zinc-100">{activeSpotlight.title}</p>
              <button
                onClick={async () => {
                  if (!confirm("Fokus beenden? Dies kann nicht rückgängig gemacht werden.")) return;
                  await onEndFocus();
                  setShowSelector(false);
                }}
                className="mt-3 w-full px-4 py-2 rounded-full bg-red-900/20 hover:bg-red-900/30 text-red-400 text-sm font-medium transition-colors"
              >
                Fokus beenden
              </button>
            </div>

            {/* Other spotlights */}
            <div>
              <p className="text-xs text-zinc-500 mb-3">Oder wähle einen anderen:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allSpotlights
                  .filter((s) => s.id !== activeSpotlight.id && s.status !== "ended")
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={async () => {
                        await onChangeFocus(s.id);
                        setShowSelector(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-zinc-100">{s.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {TYPE_LABELS[s.type] || s.type}
                      </p>
                    </button>
                  ))}
                {allSpotlights.filter((s) => s.id !== activeSpotlight.id && s.status !== "ended")
                  .length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    Keine weiteren Optionen vorhanden.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
