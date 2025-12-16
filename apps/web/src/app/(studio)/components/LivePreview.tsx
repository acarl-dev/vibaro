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
  const heroUrl = page.hero_image_url || page.avatar_url;

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 h-full">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
        <span className="text-xs text-zinc-500">Live Preview</span>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center">
          {heroUrl && (
            <div className="mb-4 flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-800">
                <img
                  src={heroUrl}
                  alt={page.display_name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          
          <h1 className="text-xl font-semibold text-zinc-50">
            {page.display_name || "Dein Name"}
          </h1>
          
          {page.bio && (
            <p className="mt-2 text-sm text-zinc-400 whitespace-pre-wrap">
              {page.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        {links && links.length > 0 && (
          <div className="space-y-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-center text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {(!links || links.length === 0) && (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-xs text-zinc-600">Noch keine Links hinzugefügt</p>
          </div>
        )}
      </div>
    </div>
  );
}
