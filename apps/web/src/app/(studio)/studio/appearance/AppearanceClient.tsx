"use client";

import { useState } from "react";

// -----------------------------------------------------------------------------
// Template Data (Canonical Copy from Instructions)
// -----------------------------------------------------------------------------

type Template = {
  key: string;
  name: string;
  shortDescription: string;
  longDescription: string[];
  suitableFor: string;
  hint?: string;
  isDefault?: boolean;
  planRequired?: string;
};

const TEMPLATES: Template[] = [
  {
    key: "modern",
    name: "Modern",
    shortDescription: "Cleanes, ruhiges Layout – ideal als Standard.",
    longDescription: [
      "Modern ist das vielseitigste Vibaro-Template.",
      "Es kombiniert klare Struktur mit einer zeitgemäßen Ästhetik und funktioniert für Solo-Artists genauso wie für Bands.",
      "Wenn du eine professionelle, zugängliche Seite möchtest, die überall funktioniert, ist Modern die richtige Wahl.",
    ],
    suitableFor: "Pop · Indie · Singer-Songwriter · Hip-Hop · Elektronisch · Bands",
    isDefault: true,
  },
  {
    key: "stage",
    name: "Stage",
    shortDescription: "Energiegeladenes Layout für Live-Bands.",
    longDescription: [
      "Stage stellt Auftritte, Videos und Performance in den Mittelpunkt.",
      "Große Bilder, klare Kontraste und ein direkter Aufbau machen dieses Template ideal für Artists, deren Musik live erlebt werden will.",
      "Wenn Bühne, Energie und Präsenz entscheidend sind, ist Stage die passende Wahl.",
    ],
    suitableFor: "Rock · Metal · Punk · Hardcore · Alternative · Live-Bands",
  },
  {
    key: "editorial",
    name: "Editorial",
    shortDescription: "Typografisch, großzügig – Kunst statt Dekoration.",
    longDescription: [
      "Editorial fühlt sich weniger wie ein Tool an und mehr wie eine gestaltete Künstlerseite.",
      "Große Typografie, viel Weißraum und starke Bilder schaffen eine ruhige, hochwertige Atmosphäre.",
      "Ideal für Artists, die ihre Musik bewusst inszenieren, ohne laut zu sein.",
    ],
    suitableFor: "Indie · Alternative · Jazz · Singer-Songwriter · Elektronische Artists",
  },
  {
    key: "minimal",
    name: "Minimal",
    shortDescription: "Ultra-reduziert, typografisch, Schwarz/Weiß.",
    longDescription: [
      "Minimal verzichtet bewusst auf Effekte, Dekoration und visuelle Ablenkung.",
      "Typografie, Rhythmus und Inhalt stehen im Vordergrund. Bilder sind optional – und nur sinnvoll, wenn sie wirklich etwas beitragen.",
      "Dieses Template ist eine Haltung, keine Gestaltungsspielerei.",
    ],
    suitableFor: "Ambient · Experimental · Klassik · Neo-Klassik · Jazz · Komponisten · Produzenten",
    hint: "Minimal funktioniert besonders gut ohne Bilder oder mit genau einem sehr starken Bild.",
  },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

type AppearanceClientProps = {
  artistPageId: number;
  initialThemeKey: string;
  initialThemeVariant: string;
};

export default function AppearanceClient({
  artistPageId,
  initialThemeKey,
  initialThemeVariant,
}: AppearanceClientProps) {
  const [themeKey, setThemeKey] = useState(initialThemeKey);
  const [themeVariant] = useState(initialThemeVariant);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSwitchHint, setShowSwitchHint] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState<string | null>(null);

  const handleCardClick = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  const handleApplyTemplate = async (key: string) => {
    // If switching to a different template, show confirmation hint
    if (themeKey !== key) {
      setPendingSwitch(key);
      setShowSwitchHint(true);
      return;
    }
    
    await applyTemplate(key);
  };

  const applyTemplate = async (key: string) => {
    setIsSaving(true);
    setShowSwitchHint(false);
    setPendingSwitch(null);

    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme_key: key,
          theme_variant: themeVariant,
        }),
      });

      if (response.ok) {
        setThemeKey(key);
        setExpandedKey(null);
      }
    } catch (error) {
      console.error("[Templates] Error applying template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmSwitch = () => {
    if (pendingSwitch) {
      applyTemplate(pendingSwitch);
    }
  };

  const cancelSwitch = () => {
    setShowSwitchHint(false);
    setPendingSwitch(null);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Templates
        </h1>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          Wähle den Stil deiner Seite. Inhalte fügst du im nächsten Schritt hinzu.
        </p>
      </div>

      {/* Switch Confirmation Hint */}
      {showSwitchHint && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex gap-3 items-start">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-200/90 mb-3">
                Beim Wechsel des Templates können Inhalte anders dargestellt werden.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmSwitch}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-sm text-amber-100 bg-amber-600/80 hover:bg-amber-600 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Wird angewendet..." : "Trotzdem wechseln"}
                </button>
                <button
                  onClick={cancelSwitch}
                  className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Cards */}
      <div className="space-y-3">
        {TEMPLATES.map((template) => {
          const isActive = themeKey === template.key;
          const isExpanded = expandedKey === template.key;
          const isLocked = !!template.planRequired;

          return (
            <div
              key={template.key}
              className={`
                rounded-xl border transition-all duration-200
                ${isActive 
                  ? "border-zinc-700 bg-zinc-900/60" 
                  : "border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-800"
                }
                ${isLocked && !isActive ? "opacity-60" : ""}
              `}
            >
              {/* Card Header (Collapsed State) */}
              <button
                onClick={() => !isLocked && handleCardClick(template.key)}
                disabled={isLocked}
                className={`
                  w-full p-5 text-left
                  ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Name + Labels */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-medium text-zinc-200">
                        {template.name}
                      </h3>
                      {template.isDefault && (
                        <span className="text-[11px] text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-800/80">
                          Default
                        </span>
                      )}
                      {template.planRequired && (
                        <span className="text-[11px] text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-800/80">
                          {template.planRequired}
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[11px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          Aktiv
                        </span>
                      )}
                    </div>
                    {/* Short Description */}
                    <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                      {template.shortDescription}
                    </p>
                  </div>
                  {/* Expand Indicator */}
                  {!isLocked && (
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && !isLocked && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-zinc-800/60 pt-4">
                    {/* Long Description */}
                    <div className="space-y-3 mb-5">
                      {template.longDescription.map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-zinc-400 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Suitable For */}
                    <div className="mb-5">
                      <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1.5">
                        Geeignet für
                      </p>
                      <p className="text-sm text-zinc-500">
                        {template.suitableFor}
                      </p>
                    </div>

                    {/* Hint (if present) */}
                    {template.hint && (
                      <div className="mb-5 rounded-lg bg-zinc-800/30 px-3 py-2.5">
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {template.hint}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <span className="inline-flex items-center text-sm text-zinc-600">
                          Aktiv
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApplyTemplate(template.key)}
                          disabled={isSaving}
                          className="px-4 py-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isSaving && pendingSwitch === template.key 
                            ? "Wird angewendet..." 
                            : "Template anwenden"
                          }
                        </button>
                      )}
                      
                      {/* Preview Button */}
                      <a
                        href={`/p/preview/${template.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
                      >
                        Vorschau ansehen
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
