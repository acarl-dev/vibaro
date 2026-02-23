"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Device = "desktop" | "tablet" | "mobile";

const DEVICES: { key: Device; label: string; width: number; icon: string }[] = [
  { key: "desktop", label: "Desktop", width: 1280, icon: "🖥" },
  { key: "tablet",  label: "Tablet",  width: 768,  icon: "📱" },
  { key: "mobile",  label: "Handy",   width: 390,  icon: "📱" },
];

type Props = {
  /** Relative path used as iframe src — works in any environment */
  previewPath: string;
  /** Full URL for the external "Öffnen" link */
  externalUrl: string;
};

export default function LivePreviewPanel({ previewPath, externalUrl }: Props) {
  const [device, setDevice] = useState<Device>("desktop");
  const [scale, setScale] = useState(1);
  const [key, setKey] = useState(0); // forces iframe reload
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDevice = DEVICES.find((d) => d.key === device)!;

  // Recalculate scale whenever device or container size changes
  const recalculate = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    if (device === "desktop") {
      setScale(1); // no scaling for desktop, just fill width
    } else {
      setScale(Math.min(1, containerWidth / activeDevice.width));
    }
  }, [device, activeDevice.width]);

  useEffect(() => {
    recalculate();
    const ro = new ResizeObserver(recalculate);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recalculate]);

  // Iframe height: fixed tall preview area, scaled to look natural
  const PREVIEW_HEIGHT = 900; // px in iframe coordinates

  const scaledHeight = Math.round(PREVIEW_HEIGHT * scale);
  const iframeWidth = device === "desktop" ? "100%" : `${activeDevice.width}px`;

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      {/* Device toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--studio-border)" }}
      >
        <div className="flex items-center gap-1">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className="px-3 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors"
              style={
                device === d.key
                  ? {
                      background: "var(--studio-surface-elevated)",
                      color: "var(--studio-text-primary)",
                      border: "1px solid var(--studio-accent)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--studio-text-secondary)",
                      border: "1px solid transparent",
                    }
              }
              title={d.label}
            >
              {d.key === "desktop" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ) : d.key === "tablet" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              )}
            </button>
          ))}
          <span
            className="ml-2 text-[10px] font-mono"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            {device === "desktop" ? "Full width" : `${activeDevice.width}px`}
            {scale < 1 && ` · ${Math.round(scale * 100)}%`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] transition-colors"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Öffnen
          </a>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--studio-text-secondary)" }}
            title="Neu laden"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ background: "#0a0a0f" }}
      >
        <div
          style={{
            width: iframeWidth,
            height: `${PREVIEW_HEIGHT}px`,
            transformOrigin: "top left",
            transform: scale < 1 ? `scale(${scale})` : "none",
            // Center non-desktop previews
            ...(device !== "desktop" && scale < 1
              ? {
                  marginLeft: `${(containerRef.current?.clientWidth ?? 0) / 2 - (activeDevice.width * scale) / 2}px`,
                }
              : {}),
          }}
        >
          <iframe
            key={key}
            src={previewPath}
            style={{
              width: "100%",
              height: `${PREVIEW_HEIGHT}px`,
              border: "none",
              display: "block",
            }}
            title="Seiten-Vorschau"
          />
        </div>

        {/* Visual height clip hint */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--studio-bg))",
          }}
        />
      </div>
    </div>
  );
}
