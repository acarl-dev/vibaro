"use client";

import Link from "next/link";
import { useState } from "react";

type ActionItem = { label: string; sub: string; href: string; muted?: boolean; warn?: boolean };

function QuickActionCard({ label, sub, href, muted = false, warn = false }: ActionItem) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "110px",
        background: hovered ? "var(--studio-surface-elevated)" : "var(--studio-surface)",
        border: `1px solid ${hovered ? "var(--studio-accent-muted)" : "var(--studio-border)"}`,
        borderRadius: "16px", padding: "20px", textDecoration: "none", cursor: "pointer",
        transition: "background 150ms ease, border-color 150ms ease",
        opacity: muted ? 0.55 : 1,
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "12px", color: warn ? "var(--studio-warning)" : "var(--studio-text-secondary)", opacity: warn ? 1 : 0.7 }}>{sub}</p>
    </Link>
  );
}

export default function QuickActions({ hasActivePhase }: { hasActivePhase: boolean }) {
  const actions: ActionItem[] = [
    { label: "Seite bearbeiten", sub: "Inhalte & Layout", href: "/studio/page" },
    { label: "Neue Phase starten", sub: "Push starten & Links erzeugen", href: "/studio/share/new", muted: hasActivePhase },
    { label: "Distribution", sub: "Story \u00b7 Bio \u00b7 Ads Links", href: "/studio/share/distribution" },
    {
      label: "QR-Code",
      sub: hasActivePhase ? "F\u00fcr Flyer & Poster" : "Erfordert aktive Phase",
      href: hasActivePhase ? "/studio/share/qr" : "/studio/share/new",
      warn: !hasActivePhase,
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px" }}>
      {actions.map((a) => <QuickActionCard key={a.label} {...a} />)}
    </div>
  );
}
