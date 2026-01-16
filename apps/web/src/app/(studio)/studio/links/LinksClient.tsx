"use client";

import { useState } from "react";
import { getSocialIcon, getPlatformName, type SocialPlatform } from "@/lib/social-icons";

type Link = {
  id: number;
  type?: string;
  title: string | null;
  url: string | null;
  position: number;
};

type LinksClientProps = {
  initialLinks: Link[];
};

// Social media platforms that should be displayed as pre-filled fields
const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "instagram",
  "facebook",
  "tiktok",
  "x",
  "youtube",
  "spotify",
  "applemusic",
  "soundcloud",
  "bandcamp",
  "website",
];

export default function LinksClient({ initialLinks }: LinksClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [error, setError] = useState("");

  const handleUpdateLink = async (linkId: number, url: string) => {
    try {
      const res = await fetch(`/api/studio/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url || null }),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedLink = json.data;
        setLinks(links.map((l) => (l.id === linkId ? updatedLink : l)));
        setError("");
      } else {
        setError("Aktualisieren fehlgeschlagen");
      }
    } catch {
      setError("Aktualisieren fehlgeschlagen");
    }
  };

  // Group links: social media first, then custom links
  const socialLinks = links.filter((l) => SOCIAL_PLATFORMS.includes(l.type as SocialPlatform));
  const customLinks = links.filter((l) => !SOCIAL_PLATFORMS.includes(l.type as SocialPlatform));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Füge URLs zu deinen Social Media Profilen und Musikplattformen hinzu.
        </p>
      </div>

      <div className="space-y-6">
        {/* Social Media Section */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-zinc-300">Social Media & Musik</h2>
            <p className="text-xs text-zinc-600 mt-1">
              Trage einfach deine URLs ein. Leere Felder werden nicht angezeigt.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex items-center gap-3 sm:gap-2">
                  <div className="flex-shrink-0 text-zinc-400">
                    {getSocialIcon(link.type as SocialPlatform, "w-5 h-5")}
                  </div>

                  {/* Platform Name */}
                  <div className="min-w-0 sm:w-32 sm:flex-shrink-0">
                    <p className="text-sm font-medium text-zinc-300">
                      {link.title || getPlatformName(link.type as SocialPlatform)}
                    </p>
                  </div>
                </div>

                {/* URL Input */}
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url || ""}
                  onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                  onBlur={(e) => handleUpdateLink(link.id, e.target.value)}
                  className="w-full flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Links Section (Future) */}
        {customLinks.length > 0 && (
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-zinc-300">Eigene Links</h2>
            </div>
            <div className="space-y-3">
              {customLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                >
                  <p className="text-sm font-medium text-zinc-100">{link.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
