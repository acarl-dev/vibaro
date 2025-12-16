"use client";

import { ArtistPageData } from "../layout";

type Link = {
  id: number;
  title: string;
  url: string;
  position: number;
};

type LivePreviewProps = {
  page: ArtistPageData;
  links?: Link[];
};

export default function LivePreview({ page, links }: LivePreviewProps) {
  // Get theme key with fallback
  const themeKey = page.theme_key || "dark-editorial";

  // Determine max-width based on template
  const maxWidthClass =
    themeKey === "dark-minimal"
      ? "max-w-xl"
      : themeKey === "dark-stage"
        ? "max-w-3xl"
        : "max-w-2xl";

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 h-full">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
        <span className="text-xs text-zinc-500">Live Preview</span>
        <span className="text-xs text-zinc-600">{getTemplateName(themeKey)}</span>
      </div>

      <div className="space-y-6">
        {/* Hero Image (Header) */}
        {page.hero_image_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800">
            <img
              src={page.hero_image_url}
              alt="Header"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Profile Section */}
        <div className="text-center space-y-3">
          {page.avatar_url && (
            <div className="flex justify-center mb-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-800">
                <img
                  src={page.avatar_url}
                  alt={page.display_name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          
          <h1 className="text-lg font-semibold text-zinc-50">
            {page.display_name || "Dein Name"}
          </h1>
          
          {page.bio && (
            <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3">
              {page.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        {links && links.length > 0 && (
          <div className="space-y-2">
            {links.slice(0, 3).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-center text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {(!links || links.length === 0) && (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
            <p className="text-xs text-zinc-600">Noch keine Links hinzugefügt</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getTemplateName(themeKey: string): string {
  switch (themeKey) {
    case "dark-minimal":
      return "Minimal";
    case "dark-stage":
      return "Stage";
    case "dark-editorial":
    default:
      return "Editorial";
  }
}
