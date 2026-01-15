"use client";

import { useEffect, useRef, useState } from "react";

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

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const hasImages = images.length > 0;
  const maxIndex = Math.max(images.length - 1, 0);

  const goToPrevious = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const goToNext = () => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  };

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !hasImages) return;

    // Focus overlay so screen readers have a stable context.
    overlayRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(maxIndex, i + 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, hasImages, onClose, maxIndex]);

  if (!isOpen || !hasImages) return null;

  const currentImage = images[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 outline-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:text-white"
        aria-label="Modal schließen"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main content with fixed height */}
      <div
        className="relative flex max-w-5xl w-full h-[82vh] max-h-[82vh] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop side navigation */}
        <button
          onClick={goToPrevious}
          disabled={isFirst}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
            isFirst
              ? "border-white/5 bg-white/5 text-white/25 cursor-not-allowed"
              : "border-white/10 bg-black/40 text-white/80 hover:text-white"
          }`}
          aria-label="Vorheriges Bild"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          disabled={isLast}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
            isLast
              ? "border-white/5 bg-white/5 text-white/25 cursor-not-allowed"
              : "border-white/10 bg-black/40 text-white/80 hover:text-white"
          }`}
          aria-label="Nächstes Bild"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image */}
        <div className="flex h-full w-full items-center justify-center px-14 md:px-20">
          <img
            src={currentImage.image_url}
            alt={currentImage.title || `Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>

        {/* Caption */}
        <div className="absolute bottom-3 left-3 right-3 md:left-6 md:right-6 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {currentImage.title && (
              <p className="text-sm md:text-base text-white font-medium truncate">
                {currentImage.title}
              </p>
            )}
            <p className="text-xs text-white/60">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-white/40">← →</span>
            <span className="text-xs text-white/40">Esc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
