"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudioHomeData, CompletenessItem } from "@/lib/api/studio.types";

const KEY_DESCRIPTIONS: Record<string, string> = {
  contact: "Mach Booking, Presse oder direkte Anfragen einfacher.",
  media: "Zeige deine wichtigsten Songs, deine aktuelle Single oder Musikvideos.",
  shows: "Zeige kommende Termine oder Tourdaten.",
  header: "Gib deiner Seite ein starkes Headerbild.",
  links: "Verbinde deine Social-Media-Profile.",
};

const SECTION_CARDS = [
  { icon: "🎵", label: "Musik", desc: "Deine wichtigsten Songs oder aktuelle Single", href: "/studio/page/music" },
  { icon: "🎥", label: "Videos", desc: "Clips, Musikvideos oder Studio-Material", href: "/studio/page/videos" },
  { icon: "💿", label: "Diskografie", desc: "Releases, EPs oder Alben", href: "/studio/page/releases" },
  { icon: "📷", label: "Fotos", desc: "Visueller Eindruck deiner Band", href: "/studio/page/gallery" },
  { icon: "🎤", label: "Konzerte", desc: "Kommende Termine oder Tourdaten", href: "/studio/page/shows" },
  { icon: "📩", label: "Kontakt", desc: "Booking, Presse oder direkte Anfragen", href: "/studio/page/contact" },
];

function qualitativeStatus(done: number, total: number): string {
  if (total === 0) return "Noch wenig Inhalt";
  if (done === total) return "Gut vorbereitet";
  const ratio = done / total;
  if (ratio >= 0.7) return "Fast bereit";
  if (ratio >= 0.4) return "Basis steht";
  return "Noch wenig Inhalt";
}

function ItemRow({ item }: { item: CompletenessItem }) {
  const desc = KEY_DESCRIPTIONS[item.key];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <span
        aria-hidden
        style={{
          marginTop: "2px",
          width: "15px", height: "15px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "4px",
          background: item.done ? "rgba(34,197,94,0.12)" : "transparent",
          border: item.done ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--studio-border)",
        }}
      >
        {item.done && (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="var(--studio-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        )}
      </span>
      <div>
        <span style={{ fontSize: "12px", color: item.done ? "var(--studio-text-primary)" : "var(--studio-text-secondary)", fontWeight: item.done ? 500 : 400, opacity: item.done ? 1 : 0.75 }}>
          {item.label}
        </span>
        {!item.done && desc && (
          <p style={{ fontSize: "11px", color: "var(--studio-text-secondary)", opacity: 0.5, marginTop: "1px" }}>{desc}</p>
        )}
      </div>
    </div>
  );
}

export default function WebsiteGrowthCard({ page }: { page: StudioHomeData["page"] }) {
  const [expanded, setExpanded] = useState(false);

  if (!page?.completeness) return null;

  const { basis, praesenz } = page.completeness;
  const all = [...basis, ...praesenz];
  const doneCount = all.filter((x) => x.done).length;
  const totalCount = all.length;
  const status = qualitativeStatus(doneCount, totalCount);
  const doneItems = all.filter((x) => x.done);
  const notDoneItems = all.filter((x) => !x.done);

  return (
    <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "16px", padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-primary)", marginBottom: "2px" }}>
            Deine Band-Seite kann noch mehr zeigen
          </p>
          <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", opacity: 0.6 }}>
            Ergänze Inhalte für Musik, Videos, Shows und mehr.
          </p>
        </div>
        <span
          style={{
            background: "transparent",
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-secondary)",
            padding: "3px 8px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 500,
            opacity: 0.65,
            flexShrink: 0,
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" }}>
        {doneItems.length > 0 && (
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.45, marginBottom: "8px" }}>
              Vorhanden
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {doneItems.map((item) => <ItemRow key={item.key} item={item} />)}
            </div>
          </div>
        )}
        {notDoneItems.length > 0 && (
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--studio-text-secondary)", opacity: 0.45, marginBottom: "8px" }}>
              Noch möglich
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {notDoneItems.map((item) => <ItemRow key={item.key} item={item} />)}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--studio-border)", paddingTop: "14px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <Link
          href="/studio/page"
          style={{ background: "transparent", border: "1px solid var(--studio-border)", color: "var(--studio-text-primary)", padding: "7px 14px", borderRadius: "8px", fontWeight: 500, fontSize: "12px", textDecoration: "none", display: "inline-block" }}
        >
          Seite bearbeiten
        </Link>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: expanded ? "var(--studio-surface-elevated)" : "transparent",
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-secondary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            padding: "7px 14px",
            borderRadius: "8px",
            transition: "background 150ms ease",
          }}
        >
          {expanded ? "Weniger anzeigen" : "Was kann ich noch zeigen?"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: "14px" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: "8px" }}>
            {SECTION_CARDS.map(({ icon, label, desc, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "12px 14px",
                  background: "var(--studio-bg)",
                  border: "1px solid var(--studio-border)",
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>{icon}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--studio-text-primary)", marginTop: "4px" }}>{label}</span>
                <span style={{ fontSize: "11px", color: "var(--studio-text-secondary)", opacity: 0.65, lineHeight: 1.4 }}>{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

