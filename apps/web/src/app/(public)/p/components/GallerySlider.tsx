"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageModal } from "./ImageModal";

type GalleryImageItem = {
  title?: string | null;
  image_url: string;
};

export default function GallerySlider({ items }: { items: GalleryImageItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false);

  // We render: [...items, ...items, ...items]
  // The "real" set is the middle copy. We start scrolled to it,
  // and silently jump back when we scroll into the clone zones.
  const tripled = [...items, ...items, ...items];

  // Get the scroll offset for the start of the middle (real) set
  const getOneSetWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return 0;
    // Each set has items.length children. Total children = items.length * 3.
    // Width of one set = scrollWidth / 3
    return el.scrollWidth / 3;
  }, [items.length]);

  // On mount, scroll to the middle set (no animation)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const oneSet = el.scrollWidth / 3;
    el.scrollLeft = oneSet;
  }, [items]);

  // On scroll, check if we need to silently reset
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (isResettingRef.current || animatingRef.current) return;
      const oneSet = getOneSetWidth();
      if (oneSet === 0) return;

      // If scrolled into the 3rd copy (past middle set end), jump back to middle
      if (el.scrollLeft >= oneSet * 2) {
        isResettingRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = el.scrollLeft - oneSet;
        el.style.scrollBehavior = "";
        isResettingRef.current = false;
      }
      // If scrolled into the 1st copy (before middle set start), jump forward to middle
      else if (el.scrollLeft < oneSet - 2 && el.scrollLeft <= 2) {
        isResettingRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = el.scrollLeft + oneSet;
        el.style.scrollBehavior = "";
        isResettingRef.current = false;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [getOneSetWidth]);

  const animatingRef = useRef(false);

  const smoothScrollBy = (el: HTMLElement, distance: number, duration = 450) => {
    if (animatingRef.current) return; // ignore clicks mid-animation
    // eslint-disable-next-line react-hooks/immutability
    animatingRef.current = true;

    // Disable snap during animation so it doesn't fight our rAF
    el.style.scrollSnapType = "none";

    const start = el.scrollLeft;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.scrollLeft = start + distance * progress;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Re-enable snap after animation
        el.style.scrollSnapType = "";
        animatingRef.current = false;

        // Silent wrap if we've drifted into a clone zone
        const oneSet = el.scrollWidth / 3;
        if (el.scrollLeft >= oneSet * 2) {
          el.scrollLeft = el.scrollLeft - oneSet;
        } else if (el.scrollLeft < oneSet && el.scrollLeft < 2) {
          el.scrollLeft = el.scrollLeft + oneSet;
        }
      }
    };

    requestAnimationFrame(step);
  };

  const scroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll exactly one slide width (slide + gap)
    const slideWidth = el.scrollWidth / (items.length * 3);
    const gap = 16;
    const scrollAmount = slideWidth + gap;
    smoothScrollBy(el, direction === "left" ? -scrollAmount : scrollAmount);
  };

  if (items.length === 0) return null;

  const renderSlide = (image: GalleryImageItem, realIndex: number, key: string) => (
    <button
      key={key}
      type="button"
      onClick={() => {
        setSelectedIndex(realIndex);
        setIsModalOpen(true);
      }}
      className="group"
      style={{
        flex: "0 0 auto",
        width: "clamp(220px, 28vw, 360px)",
        scrollSnapAlign: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
      aria-label={image.title ? `Bild öffnen: ${image.title}` : `Bild öffnen ${realIndex + 1}`}
    >
      <div
        className="overflow-hidden"
        style={{
          borderRadius: "8px",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <div style={{ position: "relative", paddingBottom: "100%" }}>
          <img
            src={image.image_url}
            alt={image.title || `Gallery image ${realIndex + 1}`}
            loading="lazy"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {image.title && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "clamp(11px, 0.9vw, 13px)",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {image.title}
        </p>
      )}
    </button>
  );

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Scroll track */}
        <div
          ref={trackRef}
          className="gallery-slider-track"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            padding: "0 4px 8px",
          }}
        >
          {tripled.map((image, i) => {
            const realIndex = i % items.length;
            return renderSlide(image, realIndex, `slide-${i}`);
          })}
        </div>

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Zurück scrollen"
          style={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.70)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "rgba(255,255,255,0.80)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s, background 0.2s",
            zIndex: 5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Weiter scrollen"
          style={{
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.70)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "rgba(255,255,255,0.80)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s, background 0.2s",
            zIndex: 5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Edge fade indicators */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "48px",
            background: "linear-gradient(to right, #050507, transparent)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "48px",
            background: "linear-gradient(to left, #050507, transparent)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
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
