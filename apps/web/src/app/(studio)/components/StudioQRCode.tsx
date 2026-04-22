"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface StudioQRCodeProps {
  url: string;
  handle?: string;
  size?: number;
}

export default function StudioQRCode({ url, handle, size = 200 }: StudioQRCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `vibaro-qr-${handle || "page"}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* White background wrapper for maximum scan compatibility */}
      <div
        ref={containerRef}
        className="rounded-lg p-4"
        style={{ background: "#ffffff", display: "inline-block" }}
      >
        <QRCodeCanvas
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </div>

      <div className="text-center">
        <p className="text-xs mb-3" style={{ color: "var(--studio-text-secondary)" }}>
          Perfekt für Flyer, Merch &amp; Backstage-Pässe
        </p>
        <button
          onClick={handleDownload}
          className="studio-btn studio-btn-secondary text-sm"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
