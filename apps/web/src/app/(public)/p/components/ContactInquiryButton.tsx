"use client";

import type { ContactItem } from "./types";

// -----------------------------------------------------------------------------
// ContactInquiryButton Component
// -----------------------------------------------------------------------------

const CONTACT_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function ContactInquiryButton({
  contacts,
  contact_message,
  handle,
}: {
  contacts?: ContactItem[];
  contact_message?: string | null;
  handle: string;
}) {
  const validContacts = contacts?.filter((c) => c.label) ?? [];
  if (!validContacts.length) return null;

  const handleContactClick = async (contact: ContactItem) => {
    try {
      const res = await fetch(
        `${CONTACT_API_BASE}/api/v1/p/${encodeURIComponent(handle)}/contact/${encodeURIComponent(contact.label)}`,
      );
      if (!res.ok) return;
      const json = await res.json();
      const url: string | undefined = json?.data?.url;
      if (!url) return;
      if (contact.type === "whatsapp") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    } catch {
      // silently ignore – button simply does nothing on network failure
    }
  };

  // Email icon
  const EmailIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  // WhatsApp icon
  const WhatsAppIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.188-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.66-.498-5.193-1.37l-.372-.219-3.676.857.898-3.564-.24-.382A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );

  return (
    <div>
      {contact_message && (
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", textAlign: "center", marginBottom: "28px", lineHeight: 1.6 }}>
          {contact_message}
        </p>
      )}
      <div>
        {validContacts.map((contact, i) => (
          <div
            key={contact.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 0",
              borderBottom: i < validContacts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
              {contact.label}
            </span>
            <button
              type="button"
              onClick={() => handleContactClick(contact)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 20px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              {contact.type === "whatsapp" ? <WhatsAppIcon /> : <EmailIcon />}
              {contact.type === "whatsapp" ? "Message" : "Email"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Legacy ContactSection (DEPRECATED - do not use on public pages)
// Contact data is now hidden from public view for security
// Use ContactInquiryModal instead
export function ContactSection({
  booking_email,
  management_email,
  press_email,
  whatsapp_number,
}: {
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
}) {
  // DEPRECATED: This component is no longer used on public pages
  // Contact information is private and only shown in studio settings
  return null;
}
