"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useHelpMode } from "@/context/HelpModeContext";

// ─── Section headings ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--studio-accent)",
        margin: "0 0 10px 0",
      }}
    >
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--studio-text-secondary)",
        opacity: 0.55,
        margin: "0 0 6px 0",
      }}
    >
      {children}
    </p>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "13px",
        lineHeight: "1.65",
        color: "var(--studio-text-primary)",
        margin: "0 0 8px 0",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--studio-border)",
        margin: "24px 0",
      }}
    />
  );
}

// ─── Flow step ───────────────────────────────────────────────────────────────

function FlowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "var(--studio-accent-muted)",
          border: "1px solid var(--studio-accent)",
          color: "var(--studio-accent)",
          fontSize: "11px",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
        {number}
      </span>
      <div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--studio-text-primary)",
            margin: "0 0 3px 0",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--studio-text-secondary)",
            lineHeight: "1.55",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Glossary entry ──────────────────────────────────────────────────────────

function GlossaryEntry({ term, definition }: { term: string; definition: string }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--studio-border)",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "var(--studio-text-primary)",
          margin: "0 0 3px 0",
        }}
      >
        {term}
      </p>
      <p
        style={{
          fontSize: "12px",
          color: "var(--studio-text-secondary)",
          lineHeight: "1.55",
          margin: 0,
        }}
      >
        {definition}
      </p>
    </div>
  );
}

// ─── Practice tip ────────────────────────────────────────────────────────────

function PracticeTip({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "10px",
        background: "rgba(245,158,11,0.05)",
        border: "1px solid rgba(245,158,11,0.15)",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: "15px", lineHeight: 1, marginTop: "1px", flexShrink: 0 }}>
        {icon}
      </span>
      <div>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--studio-text-primary)",
            margin: "0 0 3px 0",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--studio-text-secondary)",
            lineHeight: "1.55",
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

// ─── Toggle switch ───────────────────────────────────────────────────────────

function HelpModeToggle() {
  const { helpMode, toggleHelpMode } = useHelpMode();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: "12px",
        background: helpMode
          ? "rgba(230,57,70,0.12)"
          : "var(--studio-surface-elevated)",
        border: `1.5px solid ${helpMode ? "var(--studio-accent)" : "var(--studio-border)"}`,
        transition: "background 0.2s ease, border-color 0.2s ease",
        cursor: "pointer",
      }}
      onClick={toggleHelpMode}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && toggleHelpMode()}
      aria-pressed={helpMode}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--studio-text-primary)",
              margin: 0,
            }}
          >
            Erklärungen einblenden
          </p>
          {/* Status badge */}
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "1px 6px",
              borderRadius: "4px",
              flexShrink: 0,
              background: helpMode ? "var(--studio-accent)" : "var(--studio-border)",
              color: helpMode ? "#fff" : "var(--studio-text-secondary)",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            {helpMode ? "EIN" : "AUS"}
          </span>
        </div>
        <p
          style={{
            fontSize: "11px",
            color: helpMode ? "var(--studio-accent)" : "var(--studio-text-secondary)",
            margin: 0,
            transition: "color 0.2s ease",
          }}
        >
          {helpMode
            ? "Aktiv – alle Seiten zeigen Erklärungen & Tipps"
            : "Inaktiv – cleane Ansicht ohne Hinweise"}
        </p>
      </div>
      {/* Toggle pill */}
      <div
        style={{
          width: "40px",
          height: "22px",
          borderRadius: "11px",
          background: helpMode ? "var(--studio-accent)" : "rgba(255,255,255,0.12)",
          border: `1px solid ${helpMode ? "transparent" : "rgba(255,255,255,0.18)"}`,
          position: "relative",
          flexShrink: 0,
          marginLeft: "12px",
          transition: "background 0.2s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: helpMode ? "21px" : "3px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            transition: "left 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── HelpHub drawer content ──────────────────────────────────────────────────

function HelpHubDrawer({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 260);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Vibaro Hilfe"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          zIndex: 9999,
          background: "var(--studio-surface)",
          borderLeft: "1px solid var(--studio-border)",
          display: "flex",
          flexDirection: "column",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--studio-border)",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            background: "var(--studio-surface)",
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--studio-text-primary)",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              Vibaro Hilfe
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--studio-text-secondary)",
                margin: "2px 0 0 0",
              }}
            >
              Wie das System funktioniert
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Schließen"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--studio-text-secondary)",
              fontSize: "22px",
              lineHeight: 1,
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "0" }}>

          {/* ── Help Mode Toggle ── */}
          <HelpModeToggle />

          <Divider />

          {/* ── Worum geht's? ── */}
          <section style={{ marginBottom: "0" }}>
            <SectionLabel>Worum geht&apos;s in Vibaro?</SectionLabel>
            <BodyText>
              Vibaro ist Bandseite plus Messsystem für aktuelle Aktionen.
            </BodyText>
            <BodyText>
              Du legst zuerst deinen Fokus fest, verteilst dann Links und QR-Codes und siehst danach, was funktioniert.
            </BodyText>
          </section>

          <Divider />

          {/* ── So funktioniert das System ── */}
          <section>
            <SectionLabel>So funktioniert das System</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "0" }}>
              <FlowStep
                number="1"
                title="Phase starten"
                description="Eine Phase ist dein aktueller Fokus, zum Beispiel ein Release, eine Tour oder Merch. Jedes Ziel bekommt seine eigene Phase."
              />
              <FlowStep
                number="2"
                title="Links verteilen vorbereiten"
                description="Für jede Plattform und Platzierung erzeugst du einen eigenen Link. Story, Bio oder Ad bleiben so getrennt messbar."
              />
              <FlowStep
                number="3"
                title="Links verteilen"
                description="Du teilst deine Links auf Instagram, YouTube, im Newsletter oder per QR-Code dort, wo deine Fans gerade sind."
              />
              <FlowStep
                number="4"
                title="Performance dieser Phase prüfen"
                description="Nach ein paar Tagen schaust du in Performance. So siehst du, welcher Kanal für diesen Push am meisten gebracht hat."
              />
            </div>
          </section>

          <Divider />

          {/* ── Quick Start ── */}
          <section>
            <SectionLabel>Quick Start – 3 Schritte</SectionLabel>
            <div
              style={{
                background: "var(--studio-surface-elevated)",
                borderRadius: "12px",
                border: "1px solid var(--studio-border)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>🎯</span>
                <p style={{ fontSize: "13px", color: "var(--studio-text-primary)", margin: 0, lineHeight: "1.55" }}>
                  <strong>Schritt 1:</strong> Geh zu{" "}
                  <a href="/studio/share" style={{ color: "var(--studio-accent)", textDecoration: "none" }}>
                    Phase
                  </a>{" "}
                  und starte eine neue Phase für deinen aktuellen Release.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>🔗</span>
                <p style={{ fontSize: "13px", color: "var(--studio-text-primary)", margin: 0, lineHeight: "1.55" }}>
                  <strong>Schritt 2:</strong> Erstelle unter{" "}
                  <a href="/studio/share/distribution" style={{ color: "var(--studio-accent)", textDecoration: "none" }}>
                    Links verteilen
                  </a>{" "}
                  mindestens einen Instagram Story-Link und einen Bio-Link.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>📊</span>
                <p style={{ fontSize: "13px", color: "var(--studio-text-primary)", margin: 0, lineHeight: "1.55" }}>
                  <strong>Schritt 3:</strong> Nach 3–7 Tagen schau in{" "}
                  <a href="/studio/share/performance" style={{ color: "var(--studio-accent)", textDecoration: "none" }}>
                    Performance
                  </a>
                  , welche Kanäle in dieser Phase funktionieren.
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── Glossar ── */}
          <section>
            <SectionLabel>Begriffe einfach erklärt</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <GlossaryEntry
                term="Phase"
                definition="Dein aktueller Fokus, zum Beispiel ein neuer Song oder eine Tour. Klicks bleiben pro Phase getrennt, damit Phasen vergleichbar bleiben."
              />
              <GlossaryEntry
                term="Besucher"
                definition="Wie viele Menschen deine Vibaro-Seite geöffnet haben (einmalig pro Gerät gezählt)."
              />
              <GlossaryEntry
                term="Klicks"
                definition="Wie viele Besucher auf einen deiner Links geklickt haben – z.B. Spotify, Apple Music oder Instagram."
              />
              <GlossaryEntry
                term="Conversion"
                definition="Von 100 Besuchern klicken zum Beispiel 30 auf einen deiner Links. Das sind 30 % Klicks pro Besucher. Je höher, desto überzeugender ist deine Seite."
              />
              <GlossaryEntry
                term="QR-Scan"
                definition="Jemand hat deinen QR-Code gescannt (z.B. auf einem Flyer oder Poster). Ein Scan zählt wie ein normaler Seitenbesuch."
              />
              <GlossaryEntry
                term="Links verteilen"
                definition="Hier erzeugst du eigene Links je Plattform und Platzierung, damit du später siehst, woher deine Klicks kamen."
              />
            </div>
          </section>

          <Divider />

          {/* ── Best Practices ── */}
          <section>
            <SectionLabel>Best Practices</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <PracticeTip
                icon="📱"
                title="Story vs. Bio"
                body="Für einen frischen Release: Story-Link posten (kurzfristiger Push). Für dauerhafte Präsenz: Bio-Link verwenden. Nie denselben Link für beides – du verlierst die Messung."
              />
              <PracticeTip
                icon="🎵"
                title="Release Push"
                body="Starte die Phase 1–2 Tage vor Veröffentlichung. Erstelle Links für Instagram Story, Bio und YouTube. Bewirb den Story-Link am Release-Tag gezielt."
              />
              <PracticeTip
                icon="🎭"
                title="Tour / Konzert"
                body="Erstelle einen separaten QR-Code für dein Konzert-Poster. So siehst du, wie viele Fans über Offline-Werbung kamen vs. Social Media."
              />
              <PracticeTip
                icon="📊"
                title="Wenn Klicks pro Besucher unter 10 % liegen"
                body="Deine Seite wird besucht, aber kaum geklickt. Prüfe: Sind deine wichtigsten Links gut sichtbar? Hast du einen klaren Call-to-Action? Ist dein Featured Track aktuell?"
              />
            </div>
          </section>

          {/* Bottom spacer */}
          <div style={{ height: "32px" }} />
        </div>
      </div>
    </>
  );
}

// ─── Public export – renders via portal ──────────────────────────────────────

export default function HelpHub() {
  const { helpHubOpen, closeHelpHub } = useHelpMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted || !helpHubOpen) return null;

  return createPortal(<HelpHubDrawer onClose={closeHelpHub} />, document.body);
}
