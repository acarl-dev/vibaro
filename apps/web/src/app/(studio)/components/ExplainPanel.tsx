"use client";

import { useHelpMode } from "@/context/HelpModeContext";

export type ExplainExample = {
  icon?: string;
  label: string;
  description: string;
};

export type ExplainTip = {
  text: string;
};

export type ExplainPanelProps = {
  heading?: string;
  body: string[];
  nextSteps?: string[];
  examples?: ExplainExample[];
  tip?: ExplainTip;
  className?: string;
};

/**
 * Level-1 context intro panel.
 * Rendered only when helpMode is active.
 * Place at the top of any studio section to explain what that section is.
 */
export default function ExplainPanel({
  heading,
  body,
  nextSteps,
  examples,
  tip,
  className,
}: ExplainPanelProps) {
  const { helpMode } = useHelpMode();

  if (!helpMode) return null;

  return (
    <div
      className={className}
      style={{
        background: "var(--studio-surface-elevated)",
        border: "1px solid var(--studio-accent-muted)",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "24px",
      }}
    >
      {heading && (
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--studio-accent)",
            marginBottom: "10px",
          }}
        >
          {heading}
        </p>
      )}

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: nextSteps || examples || tip ? "16px" : 0,
        }}
      >
        {body.map((line, i) => (
          <p
            key={i}
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "var(--studio-text-primary)",
              margin: 0,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div
          style={{
            marginBottom: examples || tip ? "16px" : 0,
            background: "var(--studio-surface-elevated)",
            border: "1px solid var(--studio-border)",
            borderRadius: "12px",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--studio-accent)",
              margin: "0 0 10px 0",
            }}
          >
            ➔ Was jetzt tun?
          </p>
          <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {nextSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  fontSize: "13px",
                  lineHeight: "1.55",
                  color: "var(--studio-text-primary)",
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Examples */}
      {examples && examples.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: tip ? "16px" : 0,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--studio-text-secondary)",
              opacity: 0.6,
              margin: "0 0 4px 0",
            }}
          >
            Beispiel
          </p>
          {examples.map((ex, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
                padding: "10px 14px",
                border: "1px solid var(--studio-border)",
              }}
            >
              {ex.icon && (
                <span style={{ fontSize: "16px", lineHeight: 1, marginTop: "1px" }}>
                  {ex.icon}
                </span>
              )}
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--studio-text-primary)",
                    margin: "0 0 2px 0",
                  }}
                >
                  {ex.label}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--studio-text-secondary)",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {ex.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      {tip && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.18)",
          }}
        >
          <span
            style={{ fontSize: "14px", lineHeight: 1, marginTop: "1px", flexShrink: 0 }}
          >
            💡
          </span>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.55",
              color: "var(--studio-text-primary)",
              margin: 0,
            }}
          >
            <strong style={{ color: "rgba(245,158,11,0.9)", fontWeight: 700 }}>Tipp: </strong>
            {tip.text}
          </p>
        </div>
      )}
    </div>
  );
}
