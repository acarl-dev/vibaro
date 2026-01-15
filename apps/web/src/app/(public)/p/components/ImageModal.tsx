"use client";

import { useState } from "react";

export type GalleryImageItem = {
  image_url: string;
  title?: string | null;
};

export function ImageModal({
  isOpen,
  images,
  initialIndex,
  onClose,
}: {
  isOpen: boolean;
  images: GalleryImageItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  const goToPrevious = () => {
    if (!isFirst) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (!isLast) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
        aria-label="Modal schließen"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main content with fixed height */}
      <div
        className="flex flex-col items-center justify-between max-w-4xl w-full h-[80vh] max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container with fixed height */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          <img
            src={currentImage.image_url}
            alt={currentImage.title || `Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Title and counter */}
        <div className="text-center py-4 flex-shrink-0">
          {currentImage.title && (
            <p className="text-lg text-white font-medium mb-2">{currentImage.title}</p>
          )}
          <p className="text-sm text-zinc-400">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-6 items-center flex-shrink-0 pb-4">
          <button
            onClick={goToPrevious}
            disabled={isFirst}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isFirst
                ? "bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Vorheriges Bild"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </button>

          <button
            onClick={goToNext}
            disabled={isLast}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isLast
                ? "bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Nächstes Bild"
          >
            Weiter
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
