"use client";

import { StepHeader, FieldLabel, ActionRow } from "./onboarding-shared";

type ContactStepProps = {
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactUrl: string;
  setContactUrl: (v: string) => void;
  contactError: string | null;
  setContactError: (e: string | null) => void;
  onContinue: () => void;
  onBack: () => void;
};

export default function ContactStep({
  contactEmail,
  setContactEmail,
  contactUrl,
  setContactUrl,
  contactError,
  setContactError,
  onContinue,
  onBack,
}: ContactStepProps) {
  const canContinue = contactEmail.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <StepHeader
          currentStep="contact"
          title="Wie kann man dich erreichen?"
          description="Diese Infos erscheinen auf deiner \u00f6ffentlichen Seite und helfen Fans und Buchern, dich zu kontaktieren."
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <FieldLabel>Kontakt-E-Mail</FieldLabel>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => { setContactEmail(e.target.value); setContactError(null); }}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
              placeholder="booking@deinemail.com"
              autoFocus
            />
            <p className="text-xs text-zinc-700">F\u00fcr Booking-Anfragen oder allgemeine Kontaktaufnahme.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel>Website oder Booking-Link</FieldLabel>
              <span className="text-xs text-zinc-700">Optional</span>
            </div>
            <input
              type="url"
              value={contactUrl}
              onChange={(e) => setContactUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
              placeholder="https://"
            />
          </div>

          {contactError && <p className="text-xs text-red-400">{contactError}</p>}

          <ActionRow onBack={onBack} backLabel="Profil">
            <button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Weiter \u2192
            </button>
          </ActionRow>
        </div>
      </div>
    </div>
  );
}
