"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useHelpMode } from "@/context/HelpModeContext";

export type WhyContent = {
  title: string;
  what: string;
  why: string;
  example?: string;
  tip?: string;
};

type WhyPanelDrawerProps = {
  content: WhyContent;
  onClose: () => void;
};

function WhyPanelDrawer({ content, onClose }: WhyPanelDrawerProps) {
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 260);
  }, [onClose]);

  // Close on Escape
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
        aria-label={content.title}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--studio-accent-muted)",
                border: "1px solid var(--studio-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--studio-accent)",
                flexShrink: 0,
              }}
            >
              ?
            </span>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--studio-text-primary)",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              {content.title}
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
              fontSize: "20px",
              lineHeight: 1,
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Was ist das? */}
          <section>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--studio-accent)",
                margin: "0 0 8px 0",
              }}
            >
              Was ist das?
            </p>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.65",
                color: "var(--studio-text-primary)",
                margin: 0,
              }}
            >
              {content.what}
            </p>
          </section>

          {/* Warum? */}
          <section>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--studio-accent)",
                margin: "0 0 8px 0",
              }}
            >
              Warum brauche ich das?
            </p>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.65",
                color: "var(--studio-text-primary)",
                margin: 0,
              }}
            >
              {content.why}
            </p>
          </section>

          {/* Beispiel */}
          {content.example && (
            <section>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--studio-text-secondary)",
                  opacity: 0.6,
                  margin: "0 0 8px 0",
                }}
              >
                Beispiel
              </p>
              <div
                style={{
                  background: "var(--studio-surface-elevated)",
                  border: "1px solid var(--studio-border)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.65",
                    color: "var(--studio-text-primary)",
                    margin: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {content.example}
                </p>
              </div>
            </section>
          )}

          {/* Tipp */}
          {content.tip && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1, marginTop: "1px", flexShrink: 0 }}>
                💡
              </span>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: "1.55",
                  color: "var(--studio-text-primary)",
                  margin: 0,
                }}
              >
                <strong style={{ color: "rgba(245,158,11,0.9)", fontWeight: 700 }}>Tipp: </strong>
                {content.tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type WhyButtonProps = {
  content: WhyContent;
  /** Optional label override; default: "Warum?" */
  label?: string;
  className?: string;
};

/**
 * Level-2/3 inline "(i)" button that opens a slide-over panel.
 * Only visible when helpMode is active.
 */
export default function WhyButton({ content, label = "Warum?", className }: WhyButtonProps) {
  const { helpMode } = useHelpMode();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Hidden in clean mode — only appears when user has activated help mode
  if (!helpMode) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        title={`Mehr erfahren: ${content.title}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "999px",
          border: "1px solid var(--studio-accent-muted)",
          background: "transparent",
          color: "var(--studio-text-secondary)",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.01em",
          lineHeight: 1,
          transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "var(--studio-accent-muted)";
          btn.style.color = "var(--studio-accent)";
          btn.style.borderColor = "var(--studio-accent)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "transparent";
          btn.style.color = "var(--studio-text-secondary)";
          btn.style.borderColor = "var(--studio-accent-muted)";
        }}
      >
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "1.5px solid currentColor",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          i
        </span>
        {label}
      </button>

      {mounted &&
        open &&
        createPortal(
          <WhyPanelDrawer content={content} onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}
