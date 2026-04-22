"use client";

import { useState } from "react";
import type { GalleryImageItem } from "./types";
import { EmptyGalleryState } from "./EmptyStates";
import { ImageModal } from "./ImageModal";

// -----------------------------------------------------------------------------
// GalleryGrid Component
// -----------------------------------------------------------------------------

export function GalleryGrid({ items }: { items: GalleryImageItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (items.length === 0) return <EmptyGalleryState />;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            type="button"
            className="group block w-full text-left"
            aria-label={image.title ? `Bild öffnen: ${image.title}` : `Bild öffnen ${index + 1}`}
          >
            <div className="overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 transition-colors group-hover:border-zinc-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40">
              <div className="relative aspect-square">
                <img
                  src={image.image_url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 21l-4.35-4.35" />
                      <circle cx="11" cy="11" r="7" />
                      <path d="M11 8v6" />
                      <path d="M8 11h6" />
                    </svg>
                    Öffnen
                  </span>
                </div>
              </div>

              {image.title && (
                <div className="border-t border-zinc-800/50 px-3 py-2">
                  <p className="text-xs text-zinc-300 line-clamp-2">{image.title}</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          images={items}
          initialIndex={selectedIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
