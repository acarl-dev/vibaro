"use client";

import Link from "next/link";
import { useState } from "react";

type ActionItem = { label: string; sub: string; href: string; external?: boolean };

function ActionCard({ label, sub, href, external = false }: ActionItem) {
  const [hovered, setHovered] = useState(false);
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: "100px",
    background: hovered ? "var(--studio-surface-elevated)" : "var(--studio-surface)",
    border: `1px solid ${hovered ? "var(--studio-accent-muted)" : "var(--studio-border)"}`,
    borderRadius: "16px",
    padding: "18px 20px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 150ms ease, border-color 150ms ease",
  };
  const labelStyle: React.CSSProperties = { fontSize: "14px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "4px" };
  const subStyle: React.CSSProperties = { fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.7 };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>
        <p style={labelStyle}>{label}</p>
        <p style={subStyle}>{sub}</p>
      </a>
    );
  }
  return (
    <Link href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>
      <p style={labelStyle}>{label}</p>
      <p style={subStyle}>{sub}</p>
    </Link>
  );
}

type QuickActionsProps = {
  hasActivePhase: boolean;
  pageHandle: string | null;
};

export default function QuickActions({ hasActivePhase, pageHandle }: QuickActionsProps) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const previewUrl = pageHandle ? `${origin}/p/${pageHandle}` : null;

  const actions: ActionItem[] = hasActivePhase
    ? [
        { label: "Links teilen", sub: "Erzeuge passende Links für Story, Bio, Ads oder Posts.", href: "/studio/share/distribution" },
        { label: "QR-Code nutzen", sub: "Erstelle einen QR-Code für Flyer, Poster oder Bühne.", href: "/studio/share/qr" },
        { label: "Performance ansehen", sub: "Sieh, welche Kanäle und Links funktionieren.", href: "/studio/results" },
      ]
    : [
        { label: "Phase starten", sub: "Setze einen klaren Fokus für Release, Live, Merch oder Studio.", href: "/studio/share/new" },
        { label: "Seite ausbauen", sub: "Füge Musik, Videos, Fotos, Shows oder Kontaktmöglichkeiten hinzu.", href: "/studio/page" },
        previewUrl
          ? { label: "Vorschau prüfen", sub: "Sieh deine öffentliche Band-Seite so, wie Besucher sie sehen.", href: previewUrl, external: true }
          : { label: "Seite bearbeiten", sub: "Passe Inhalte, Layout und Links deiner Band-Seite an.", href: "/studio/page" },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "12px" }}>
      {actions.map((a) => (
        <ActionCard key={a.label} {...a} />
      ))}
    </div>
  );
}
