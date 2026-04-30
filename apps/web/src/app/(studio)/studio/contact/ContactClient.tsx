"use client";

import { useState } from "react";
import StudioTabPage from "../../components/StudioTabPage";
import StudioButton from "../../components/StudioButton";
import StudioCard from "../../components/StudioCard";
import StudioNotice from "../../components/StudioNotice";
import { studioFetch } from "@/lib/api/client-fetch";

type ContactData = {
  booking_email: string | null;
  management_email: string | null;
  press_email: string | null;
  whatsapp_number: string | null;
  contact_message: string | null;
};

type ContactClientProps = {
  initialData: ContactData;
  artistPageId: number;
};

export default function ContactClient({ initialData, artistPageId }: ContactClientProps) {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await studioFetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_email: formData.booking_email || null,
          management_email: formData.management_email || null,
          press_email: formData.press_email || null,
          whatsapp_number: formData.whatsapp_number || null,
          contact_message: formData.contact_message || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.error?.message || "Speichern fehlgeschlagen");
      }
    } catch {
      setError("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudioTabPage
      title="Kontakt"
      description="Verwalte deine Kontaktdaten für Booking, Management und Press."
      action={
        <StudioButton variant="primary" size="md" onClick={handleSave} disabled={saving}>
          {saving ? "Speichern..." : "Speichern"}
        </StudioButton>
      }
    >
      <StudioCard className="space-y-6">
        {error && (
          <StudioNotice type="error">{error}</StudioNotice>
        )}

        {success && (
          <StudioNotice type="info">Kontaktdaten erfolgreich gespeichert</StudioNotice>
        )}

        {/* Booking Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--studio-text-primary)" }}>
            Booking E-Mail
          </label>
          <input
            type="email"
            placeholder="booking@example.com"
            value={formData.booking_email || ""}
            onChange={(e) => setFormData({ ...formData, booking_email: e.target.value })}
            className="studio-input w-full px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            Wird öffentlich für Booking-Anfragen angezeigt
          </p>
        </div>

        {/* Management Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--studio-text-primary)" }}>
            Management E-Mail
          </label>
          <input
            type="email"
            placeholder="management@example.com"
            value={formData.management_email || ""}
            onChange={(e) => setFormData({ ...formData, management_email: e.target.value })}
            className="studio-input w-full px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            Wird öffentlich für Management-Anfragen angezeigt
          </p>
        </div>

        {/* Press Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--studio-text-primary)" }}>
            Press E-Mail
          </label>
          <input
            type="email"
            placeholder="press@example.com"
            value={formData.press_email || ""}
            onChange={(e) => setFormData({ ...formData, press_email: e.target.value })}
            className="studio-input w-full px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            Wird öffentlich für Press-Anfragen angezeigt
          </p>
        </div>

        {/* WhatsApp Business */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--studio-text-primary)" }}>
            WhatsApp Business
          </label>
          <input
            type="text"
            placeholder="+49 123 456789"
            value={formData.whatsapp_number || ""}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            className="studio-input w-full px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            Optional: WhatsApp Business Nummer (mit Ländervorwahl, z.B. +49)
          </p>
        </div>

        {/* Contact Message */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--studio-text-primary)" }}>
            Kontakt-Nachricht
          </label>
          <textarea
            placeholder="Ich melde mich so schnell wie möglich bei dir."
            value={formData.contact_message || ""}
            onChange={(e) => setFormData({ ...formData, contact_message: e.target.value })}
            rows={3}
            maxLength={500}
            className="studio-input w-full px-3 py-2 text-sm resize-none"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            Persönliche Nachricht im Kontakt-Modal (max. 500 Zeichen). Standard: &quot;Ich melde mich so schnell wie möglich bei dir.&quot;
          </p>
        </div>

        {/* Info */}
        <p className="text-xs pt-4" style={{ color: "var(--studio-text-secondary)", borderTop: "1px solid var(--studio-border)" }}>
          Diese Informationen werden öffentlich auf deiner Artist-Seite angezeigt
        </p>
      </StudioCard>

      <StudioNotice type="info" className="mt-6">
        <strong>Hinweis:</strong> Alle Kontaktdaten sind optional. Du kannst entscheiden, welche Informationen du öffentlich teilen möchtest. Lasse Felder leer, die nicht angezeigt werden sollen.
      </StudioNotice>
    </StudioTabPage>
  );
}
