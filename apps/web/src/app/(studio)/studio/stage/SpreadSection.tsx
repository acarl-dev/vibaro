"use client";

import { useState } from "react";

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  utmSource: string;
  utmMedium: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: "📱",
    description: "Link für deine Story – mit Klick-Zählung",
    utmSource: "instagram",
    utmMedium: "story",
  },
  {
    id: "instagram-bio",
    name: "Instagram Bio",
    icon: "🔗",
    description: "Für deinen Link-in-Bio",
    utmSource: "instagram",
    utmMedium: "bio",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    description: "Link für dein TikTok-Profil",
    utmSource: "tiktok",
    utmMedium: "bio",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶️",
    description: "Link für die Video-Beschreibung",
    utmSource: "youtube",
    utmMedium: "description",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    description: "Zum Teilen per Nachricht",
    utmSource: "whatsapp",
    utmMedium: "message",
  },
  {
    id: "custom",
    name: "Eigener Link",
    icon: "🌐",
    description: "Für jede andere Plattform",
    utmSource: "custom",
    utmMedium: "link",
  },
];

interface SpreadSectionProps {
  disabled: boolean;
  generatingPlatform: string | null;
  onGenerateLink: (platformId: string, label: string) => Promise<void>;
}

export default function SpreadSection({
  disabled,
  generatingPlatform,
  onGenerateLink,
}: SpreadSectionProps) {
  const [modalPlatform, setModalPlatform] = useState<PlatformConfig | null>(null);
  const [linkLabel, setLinkLabel] = useState("");

  function handleCardClick(platform: PlatformConfig) {
    if (disabled) return;
    setLinkLabel("");
    setModalPlatform(platform);
  }

  async function handleConfirm() {
    if (!modalPlatform) return;
    const label = linkLabel.trim() || modalPlatform.name;
    setModalPlatform(null);
    await onGenerateLink(modalPlatform.id, label);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">Verbreiten</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Erstelle Links für deine Plattformen. Vibaro zählt automatisch mit.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const isGenerating = generatingPlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => handleCardClick(platform)}
              disabled={disabled || isGenerating}
              className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-left hover:border-zinc-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-3xl mb-3 block">{platform.icon}</span>
              <span className="text-sm font-medium text-zinc-100 block mb-1">
                {platform.name}
              </span>
              <span className="text-xs text-zinc-500 leading-snug block">
                {platform.description}
              </span>
              {isGenerating && (
                <span className="absolute top-3 right-3 text-xs text-zinc-500">…</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Label Modal ── */}
      {modalPlatform && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setModalPlatform(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-zinc-100 mb-1">
              {modalPlatform.name}
            </h3>
            <p className="text-sm text-zinc-400 mb-5">
              Wofür nutzt du diesen Link?
            </p>
            <input
              type="text"
              autoFocus
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder={`z.B. Story Album Release`}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors mb-5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 px-5 py-3 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold transition-colors"
              >
                Link erstellen
              </button>
              <button
                onClick={() => setModalPlatform(null)}
                className="px-5 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
