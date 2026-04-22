import type { ShowItem } from "./types";
import { EmptyShowsState } from "./EmptyStates";

// -----------------------------------------------------------------------------
// ShowList Component
// -----------------------------------------------------------------------------

export function ShowList({ items }: { items: ShowItem[] }) {
  if (items.length === 0) return <EmptyShowsState />;

  const monthShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("de-DE", { month: "short" }).replace(".", "");
  const dayNum = (dateStr: string) =>
    new Date(dateStr).getDate();

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((show, index) => (
        <li
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            padding: "20px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Date block */}
          <div
            style={{
              flexShrink: 0,
              width: "48px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "clamp(22px, 2.2vw, 30px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {dayNum(show.date)}
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {monthShort(show.date)}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              flexShrink: 0,
              width: "1px",
              height: "40px",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {show.venue}
            </p>
            <p
              style={{
                marginTop: "3px",
                fontSize: "clamp(11px, 0.9vw, 13px)",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {show.city}
              {show.time && <span style={{ marginLeft: "12px" }}>{show.time} Uhr</span>}
              {show.is_free && <span style={{ marginLeft: "12px" }}>Kostenlos</span>}
              {!show.is_free && show.price && (
                <span style={{ marginLeft: "12px" }}>{parseFloat(String(show.price)).toFixed(2)}€</span>
              )}
            </p>
            {show.support_acts && show.support_acts.length > 0 && (
              <p
                style={{
                  marginTop: "3px",
                  fontSize: "clamp(11px, 0.9vw, 13px)",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                mit {show.support_acts.join(", ")}
              </p>
            )}
          </div>

          {/* Flyer thumbnail — only when present */}
          {show.flyer_url && (
            <div
              style={{
                flexShrink: 0,
                width: "40px",
                height: "53px",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.06) inset",
              }}
            >
              <img
                src={show.flyer_url}
                alt={`${show.venue} Flyer`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Ticket CTA */}
          {show.url && (
            <a
              href={show.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.80)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Tickets
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
