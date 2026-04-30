"use client";

import Link from "next/link";

type ActionItem = { label: string; sub: string; href: string; external?: boolean };

function ActionCard({ label, sub, href, external = false }: ActionItem) {
  const cardClassName = "group flex min-h-[88px] flex-col justify-end rounded-lg px-4 py-3.5 transition-colors";
  const cardStyle: React.CSSProperties = {
    background: "var(--studio-surface)",
    border: "1px solid var(--studio-border)",
    textDecoration: "none",
  };
  const labelClassName = "mb-1 text-sm font-medium";
  const subClassName = "text-xs";
  const textStyle: React.CSSProperties = { color: "var(--studio-text-primary)" };
  const subStyle: React.CSSProperties = { color: "var(--studio-text-secondary)", opacity: 0.65 };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cardClassName} style={cardStyle}>
        <p className={labelClassName} style={textStyle}>{label}</p>
        <p className={subClassName} style={subStyle}>{sub}</p>
      </a>
    );
  }
  return (
    <Link href={href} className={cardClassName} style={cardStyle}>
      <p className={labelClassName} style={textStyle}>{label}</p>
      <p className={subClassName} style={subStyle}>{sub}</p>
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
        { label: "Links verteilen", sub: "Erzeuge pro Kanal einen eigenen Link für Story, Bio, Ads oder Posts.", href: "/studio/share/distribution" },
        { label: "QR-Code nutzen", sub: "Nutze einen QR-Code für Flyer, Poster oder Merchstand.", href: "/studio/share/qr" },
        { label: "Analyse ansehen", sub: "Sobald Daten vorliegen, siehst du hier, welche Kanäle funktionieren.", href: "/studio/results" },
      ]
    : [
        { label: "Phase starten", sub: "Setze einen klaren Fokus für Release, Live, Merch oder Studio.", href: "/studio/share/new" },
        { label: "Seite ausbauen", sub: "Füge Musik, Videos, Fotos, Shows oder Kontaktmöglichkeiten hinzu.", href: "/studio/page" },
        previewUrl
          ? { label: "Vorschau prüfen", sub: "Sieh deine öffentliche Band-Seite so, wie Besucher sie sehen.", href: previewUrl, external: true }
          : { label: "Seite bearbeiten", sub: "Passe Inhalte, Layout und Links deiner Band-Seite an.", href: "/studio/page" },
      ];

  return (
    <section className="space-y-3" aria-label="Weitere Aktionen">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--studio-text-secondary)", opacity: 0.7 }}>
        Weitere Aktionen
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {actions.map((a) => (
        <ActionCard key={a.label} {...a} />
      ))}
      </div>
    </section>
  );
}
