"use client";

import { useState } from "react";

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
      const res = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Kontakt</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verwalte deine Kontaktdaten für Booking, Management und Press.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-900/50 bg-green-900/10 px-3 py-2 text-xs text-green-400">
            Kontaktdaten erfolgreich gespeichert
          </div>
        )}

        {/* Booking Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Booking E-Mail
          </label>
          <input
            type="email"
            placeholder="booking@example.com"
            value={formData.booking_email || ""}
            onChange={(e) => setFormData({ ...formData, booking_email: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Wird öffentlich für Booking-Anfragen angezeigt
          </p>
        </div>

        {/* Management Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Management E-Mail
          </label>
          <input
            type="email"
            placeholder="management@example.com"
            value={formData.management_email || ""}
            onChange={(e) => setFormData({ ...formData, management_email: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Wird öffentlich für Management-Anfragen angezeigt
          </p>
        </div>

        {/* Press Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Press E-Mail
          </label>
          <input
            type="email"
            placeholder="press@example.com"
            value={formData.press_email || ""}
            onChange={(e) => setFormData({ ...formData, press_email: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Wird öffentlich für Press-Anfragen angezeigt
          </p>
        </div>

        {/* WhatsApp Business */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            WhatsApp Business
          </label>
          <input
            type="text"
            placeholder="+49 123 456789"
            value={formData.whatsapp_number || ""}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Optional: WhatsApp Business Nummer (mit Ländervorwahl, z.B. +49)
          </p>
        </div>

        {/* Contact Message */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Kontakt-Nachricht
          </label>
          <textarea
            placeholder="Ich melde mich so schnell wie möglich bei dir."
            value={formData.contact_message || ""}
            onChange={(e) => setFormData({ ...formData, contact_message: e.target.value })}
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Persönliche Nachricht im Kontakt-Modal (max. 500 Zeichen). Standard: "Ich melde mich so schnell wie möglich bei dir."
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-600">
            Diese Informationen werden öffentlich auf deiner Artist-Seite angezeigt
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
              saving
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-lg border border-blue-900/50 bg-blue-900/10 p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Hinweis</h3>
        <p className="text-xs text-blue-300/80 leading-relaxed">
          Alle Kontaktdaten sind optional. Du kannst entscheiden, welche Informationen du öffentlich teilen möchtest.
          Lasse Felder leer, die nicht angezeigt werden sollen.
        </p>
      </div>
    </div>
  );
}
