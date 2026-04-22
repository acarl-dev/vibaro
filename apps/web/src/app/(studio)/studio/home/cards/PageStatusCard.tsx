"use client";

import { useState } from "react";
import type { StudioHomeData } from "@/lib/api/studio.types";

export default function PageStatusCard({ page }: { page: StudioHomeData["page"] }) {
  const [copied, setCopied] = useState(false);
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const pageUrl = page?.handle ? `${origin}/p/${page.handle}` : null;

  function handleCopy() {
    if (!pageUrl) return;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!page || !pageUrl) return null;

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)" }}>Seite</p>
        <span style={{ background: page.is_published ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: page.is_published ? "var(--studio-success)" : "var(--studio-warning)", border: `1px solid ${page.is_published ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`, padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
          {page.is_published ? "Live" : "Entwurf"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ fontSize: "12px", color: "var(--studio-text-secondary)", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pageUrl}</span>
        <button
          onClick={handleCopy}
          style={{ background: "transparent", border: "1px solid var(--studio-border)", color: copied ? "var(--studio-success)" : "var(--studio-text-secondary)", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer", flexShrink: 0, transition: "color 150ms ease" }}
        >
          {copied ? "Kopiert \u2713" : "Kopieren"}
        </button>
      </div>
      <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}>
        Vorschau \u00f6ffnen \u2192
      </a>
    </div>
  );
}
