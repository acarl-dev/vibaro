"use client";

import { useState } from "react";
import type { SpotlightType } from "@/lib/api/spotlights";

type PhaseDisplayFieldsProps = {
  type: SpotlightType;
  subtitle: string;
  ctaLabel: string;
  secondaryCtaUrl: string;
  secondaryCtaLabel: string;
  backgroundImageUrl: string;
  meta: Record<string, unknown>;
  onChange: (fields: {
    subtitle?: string | null;
    cta_label?: string | null;
    secondary_cta_url?: string | null;
    secondary_cta_label?: string | null;
    background_image_url?: string | null;
    meta?: Record<string, unknown> | null;
  }) => void;
};

/**
 * Type-specific meta field configurations.
 * Each type gets contextual fields in the "Phase-Darstellung" section.
 */
const META_FIELDS: Record<
  string,
  { key: string; label: string; type: "text" | "number" | "date" | "boolean" }[]
> = {
  single: [{ key: "release_date_display", label: "Release-Datum (Anzeige)", type: "text" }],
  album: [
    { key: "track_count", label: "Anzahl Tracks", type: "number" },
    { key: "release_date_display", label: "Release-Datum (Anzeige)", type: "text" },
  ],
  video: [{ key: "duration", label: "Laufzeit (z.B. 4:32)", type: "text" }],
  tour: [
    { key: "city_count", label: "Anzahl Städte", type: "number" },
    { key: "country_count", label: "Anzahl Länder", type: "number" },
  ],
  event: [
    { key: "event_date", label: "Datum (z.B. 02.10.2026)", type: "text" },
    { key: "venue", label: "Venue", type: "text" },
    { key: "city", label: "Stadt", type: "text" },
  ],
  merch: [{ key: "is_limited", label: "Limitiert", type: "boolean" }],
  livestream: [{ key: "countdown_until", label: "Countdown bis (ISO Datum)", type: "text" }],
  collab: [{ key: "partner_name", label: "Partner-Name", type: "text" }],
};

export function PhaseDisplayFields({
  type,
  subtitle,
  ctaLabel,
  secondaryCtaUrl,
  secondaryCtaLabel,
  backgroundImageUrl,
  meta,
  onChange,
}: PhaseDisplayFieldsProps) {
  const [expanded, setExpanded] = useState(false);
  const metaFields = META_FIELDS[type] || [];

  const updateMeta = (key: string, value: unknown) => {
    const updated = { ...meta, [key]: value || undefined };
    // Remove empty values
    Object.keys(updated).forEach((k) => {
      if (updated[k] === undefined || updated[k] === "" || updated[k] === null) {
        delete updated[k];
      }
    });
    onChange({ meta: Object.keys(updated).length > 0 ? updated : null });
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--studio-border)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.02]"
        style={{ color: "var(--studio-text-primary)" }}
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: "var(--studio-accent)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
            />
          </svg>
          Phase-Darstellung
        </span>
        <svg
          className="w-4 h-4 transition-transform"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--studio-text-secondary)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: "var(--studio-border)" }}>
          <p
            className="text-xs pt-3"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            Diese Felder steuern, wie die Phase auf der öffentlichen Seite angezeigt wird.
          </p>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-1">Untertitel</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value || null })}
              placeholder="z.B. 12 Städte · 3 Länder"
              className="studio-input w-full px-3 py-2 text-sm"
            />
          </div>

          {/* CTA Label Override */}
          <div>
            <label className="block text-sm font-medium mb-1">CTA-Text (optional)</label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => onChange({ cta_label: e.target.value || null })}
              placeholder="Automatisch basierend auf Typ"
              className="studio-input w-full px-3 py-2 text-sm"
            />
            <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)" }}>
              Leer lassen für Standard (z.B. &quot;Jetzt hören&quot; für Singles)
            </p>
          </div>

          {/* Secondary CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Zweiter CTA-Text</label>
              <input
                type="text"
                value={secondaryCtaLabel}
                onChange={(e) =>
                  onChange({ secondary_cta_label: e.target.value || null })
                }
                placeholder="z.B. Vorbestellen"
                className="studio-input w-full px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zweiter CTA-Link</label>
              <input
                type="url"
                value={secondaryCtaUrl}
                onChange={(e) =>
                  onChange({ secondary_cta_url: e.target.value || null })
                }
                placeholder="https://..."
                className="studio-input w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Hintergrundbild (URL)</label>
            <input
              type="url"
              value={backgroundImageUrl}
              onChange={(e) =>
                onChange({ background_image_url: e.target.value || null })
              }
              placeholder="https://... (optional, sonst Cover als Blur)"
              className="studio-input w-full px-3 py-2 text-sm"
            />
          </div>

          {/* Type-specific meta fields */}
          {metaFields.length > 0 && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--studio-text-secondary)" }}
              >
                Typ-spezifische Felder
              </p>
              <div className="space-y-3">
                {metaFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    {field.type === "boolean" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!meta[field.key]}
                          onChange={(e) => updateMeta(field.key, e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
                          {field.label}
                        </span>
                      </div>
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        value={(meta[field.key] as number) ?? ""}
                        onChange={(e) =>
                          updateMeta(
                            field.key,
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        className="studio-input w-full px-3 py-2 text-sm"
                        min={0}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(meta[field.key] as string) ?? ""}
                        onChange={(e) => updateMeta(field.key, e.target.value)}
                        className="studio-input w-full px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
