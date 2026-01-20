"use client";

import { useState, useEffect } from "react";

type Template = {
  key: string;
  name: string;
  description: string;
  locked: boolean;
  planRequired?: string;
};

const TEMPLATES: Template[] = [
  {
    key: "modern",
    name: "Modern (Default)",
    description: "Cleanes, ruhiges Layout – ideal als Standard",
    locked: false,
  },
  {
    key: "stage",
    name: "Stage",
    description: "Energiegeladenes Layout für Live-Bands (Rock, Metal, Punk)",
    locked: false,
  },
  {
    key: "editorial",
    name: "Editorial",
    description: "Minimalistisch, typografisch, großzügig – Kunst statt Dekoration",
    locked: false,
  },
  {
    key: "minimal",
    name: "Minimal",
    description: "Ultra-reduziert, typografisch, nur Schwarz/Weiß – keine Dekoration",
    locked: false,
  },
];

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
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save on change
  useEffect(() => {
    // Skip initial render
    if (themeKey === initialThemeKey && themeVariant === initialThemeVariant) {
      return;
    }

    const saveSettings = async () => {
      setIsSaving(true);
      try {
        console.log("[Appearance] Saving theme:", { themeKey, themeVariant, artistPageId });

        const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theme_key: themeKey,
            theme_variant: themeVariant,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[Appearance] Failed to save:", response.status, errorData);
          return;
        }

        const data = await response.json();
        console.log("[Appearance] Saved successfully:", data);
      } catch (error) {
        console.error("[Appearance] Error saving settings:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const debounce = setTimeout(saveSettings, 500);
    return () => clearTimeout(debounce);
  }, [themeKey, themeVariant, artistPageId, initialThemeKey, initialThemeVariant]);

  const handleTemplateSelect = (key: string, locked: boolean) => {
    if (locked) return;
    setThemeKey(key);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Wähle ein Template und Style für deine Seite.
        </p>
      </div>

      <div className="space-y-6">
        {/* Template Selection */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-300">Template</h2>
            {isSaving && (
              <span className="text-xs text-zinc-500">Speichert...</span>
            )}
          </div>

          <div className="space-y-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.key}
                onClick={() => handleTemplateSelect(template.key, template.locked)}
                disabled={template.locked}
                className={`
                  w-full rounded-lg border p-4 text-left transition-all
                  ${
                    themeKey === template.key
                      ? "border-zinc-700 bg-zinc-800/50"
                      : "border-zinc-800 bg-zinc-900/30"
                  }
                  ${
                    template.locked
                      ? "cursor-not-allowed opacity-60"
                      : "hover:border-zinc-700 hover:bg-zinc-800/30 cursor-pointer"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-zinc-200">
                        {template.name}
                      </h3>
                      {themeKey === template.key && (
                        <span className="text-xs text-zinc-500">✓</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {template.description}
                    </p>
                    {template.locked && template.planRequired && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                          <span>Im {template.planRequired} Plan verfügbar</span>
                          <a
                            href="/pricing"
                            className="text-zinc-400 hover:text-zinc-300 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Details
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Variant Selection (for future) */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 opacity-60">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">Variant</h2>
          <div className="space-y-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <span className="text-sm text-zinc-400">Auto (Standard)</span>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Weitere Varianten kommen bald.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
