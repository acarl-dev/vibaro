"use client";

import { useState } from "react";
import {
  SpotlightData,
  SpotlightType,
  CreateSpotlightRequest,
  createSpotlight,
} from "@/lib/api/spotlights";
import { useToast } from "@/context/ToastContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhaseCategory = "release" | "live" | "merch" | "studio" | "focus";
type ReleaseKind = "single" | "album" | "video";
type LiveKind = "concert" | "tour";

type WizardStep = "pick-category" | "fill-details";

type WizardProps = {
  onSuccess: (spotlight: SpotlightData) => void;
  onCancel: () => void;
};

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

const CATEGORIES: {
  id: PhaseCategory;
  title: string;
  description: string;
  emoji: string;
}[] = [
  { id: "release",  title: "Release",              description: "Neue Single, Album oder Video",        emoji: "🎵" },
  { id: "live",     title: "Live",                  description: "Konzert, Tour oder Auftritt",          emoji: "🎤" },
  { id: "merch",    title: "Merch",                 description: "Drop, Shirt, Bundle oder Shop",        emoji: "👕" },
  { id: "studio",   title: "Studio / Songwriting",  description: "Ihr arbeitet an neuer Musik",          emoji: "🎛️" },
  { id: "focus",    title: "Allgemeiner Fokus",      description: "Etwas Wichtiges hervorheben",          emoji: "⭐" },
];

// ---------------------------------------------------------------------------
// Helpers: derive spotlight params from wizard state
// ---------------------------------------------------------------------------

function buildRequest(
  category: PhaseCategory,
  releaseKind: ReleaseKind,
  liveKind: LiveKind,
  title: string,
  city: string,
  tourName: string,
  merchName: string,
  link: string,
  description: string,
  isLimited: boolean,
  activate: boolean,
): CreateSpotlightRequest {
  const url = link.trim() || "https://vibaro.app";

  if (category === "release") {
    const kindMap: Record<ReleaseKind, SpotlightType> = { single: "single", album: "album", video: "video" };
    const ctaMap: Record<ReleaseKind, string> = {
      single: "Jetzt anhören",
      album:  "Jetzt anhören",
      video:  "Jetzt ansehen",
    };
    const defaultMap: Record<ReleaseKind, string> = {
      single: "Neue Single",
      album:  "Neues Album",
      video:  "Neues Video",
    };
    return {
      type:        kindMap[releaseKind],
      title:       title.trim() || defaultMap[releaseKind],
      primary_url: url,
      cta_label:   ctaMap[releaseKind],
      activate,
      show_on_page: true,
    };
  }

  if (category === "live") {
    if (liveKind === "concert") {
      return {
        type:        "event",
        title:       city.trim() ? `Live in ${city.trim()}` : "Live-Konzert",
        primary_url: url,
        cta_label:   "Tickets sichern",
        activate,
        show_on_page: true,
      };
    }
    return {
      type:        "tour",
      title:       tourName.trim() || "Auf Tour",
      primary_url: url,
      cta_label:   "Shows ansehen",
      activate,
      show_on_page: true,
    };
  }

  if (category === "merch") {
    return {
      type:        "merch",
      title:       merchName.trim() || "Neues Merch",
      primary_url: url,
      cta_label:   "Jetzt sichern",
      meta:        isLimited ? { is_limited: true } : null,
      activate,
      show_on_page: true,
    };
  }

  if (category === "studio") {
    return {
      type:        "studio",
      title:       title.trim() || "Neue Musik entsteht",
      primary_url: url,
      description: description.trim() || null,
      cta_label:   "Mehr erfahren",
      activate,
      show_on_page: true,
    };
  }

  // focus
  return {
    type:        "focus",
    title:       title.trim(),
    primary_url: url,
    description: description.trim() || null,
    cta_label:   "Mehr erfahren",
    activate,
    show_on_page: true,
  };
}

// ---------------------------------------------------------------------------
// Step 1: Category picker
// ---------------------------------------------------------------------------

function CategoryPicker({
  selected,
  onSelect,
}: {
  selected: PhaseCategory | null;
  onSelect: (c: PhaseCategory) => void;
}) {
  return (
    <div className="space-y-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              border: isSelected
                ? "1px solid var(--studio-accent)"
                : "1px solid var(--studio-border)",
              background: isSelected
                ? "rgba(var(--accent), 0.08)"
                : "rgba(255,255,255,0.02)",
            }}
          >
            <span className="text-xl w-8 text-center flex-shrink-0">{cat.emoji}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
                {cat.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)" }}>
                {cat.description}
              </p>
            </div>
            {isSelected && (
              <span className="ml-auto text-xs font-medium" style={{ color: "var(--studio-accent)" }}>
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Detail forms per category
// ---------------------------------------------------------------------------

function KindToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
          style={{
            border: value === opt.value ? "1px solid var(--studio-accent)" : "1px solid var(--studio-border)",
            background: value === opt.value ? "rgba(var(--accent), 0.1)" : "rgba(255,255,255,0.02)",
            color: value === opt.value ? "var(--studio-text-primary)" : "var(--studio-text-secondary)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--studio-text-primary)" }}>
      {children}
      {optional && (
        <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--studio-text-secondary)" }}>
          (optional)
        </span>
      )}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "url";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="studio-input w-full px-3 py-2 text-sm"
    />
  );
}

function ReleaseDetails({
  releaseKind, setReleaseKind,
  title, setTitle,
  link, setLink,
}: {
  releaseKind: ReleaseKind; setReleaseKind: (v: ReleaseKind) => void;
  title: string; setTitle: (v: string) => void;
  link: string; setLink: (v: string) => void;
}) {
  const placeholder = releaseKind === "single" ? "z.B. Fade Out" : releaseKind === "album" ? "z.B. Dark Horizon" : "z.B. Behind the Scenes";
  const linkHint = releaseKind === "video" ? "YouTube, Vimeo oder ähnlich" : "Spotify, Apple Music, Bandcamp …";

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Format</FieldLabel>
        <KindToggle
          options={[
            { value: "single" as ReleaseKind, label: "Single" },
            { value: "album"  as ReleaseKind, label: "Album"  },
            { value: "video"  as ReleaseKind, label: "Video"  },
          ]}
          value={releaseKind}
          onChange={setReleaseKind}
        />
      </div>
      <div>
        <FieldLabel optional>Titel</FieldLabel>
        <TextInput value={title} onChange={setTitle} placeholder={placeholder} />
      </div>
      <div>
        <FieldLabel optional>Link</FieldLabel>
        <TextInput value={link} onChange={setLink} placeholder={`https://… ${linkHint}`} type="url" />
        <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)" }}>
          Empfohlen – wird als Ziel des CTA-Buttons verwendet
        </p>
      </div>
    </div>
  );
}

function LiveDetails({
  liveKind, setLiveKind,
  city, setCity,
  tourName, setTourName,
  link, setLink,
}: {
  liveKind: LiveKind; setLiveKind: (v: LiveKind) => void;
  city: string; setCity: (v: string) => void;
  tourName: string; setTourName: (v: string) => void;
  link: string; setLink: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Art</FieldLabel>
        <KindToggle
          options={[
            { value: "concert" as LiveKind, label: "Konzert" },
            { value: "tour"    as LiveKind, label: "Tour"    },
          ]}
          value={liveKind}
          onChange={setLiveKind}
        />
      </div>
      {liveKind === "concert" ? (
        <div>
          <FieldLabel optional>Stadt</FieldLabel>
          <TextInput value={city} onChange={setCity} placeholder="z.B. Berlin" />
        </div>
      ) : (
        <div>
          <FieldLabel optional>Tourname</FieldLabel>
          <TextInput value={tourName} onChange={setTourName} placeholder="z.B. Summer Tour 2026" />
        </div>
      )}
      <div>
        <FieldLabel optional>Link zu Tickets oder Tour-Info</FieldLabel>
        <TextInput value={link} onChange={setLink} placeholder="https://…" type="url" />
      </div>
    </div>
  );
}

function MerchDetails({
  merchName, setMerchName,
  link, setLink,
  isLimited, setIsLimited,
}: {
  merchName: string; setMerchName: (v: string) => void;
  link: string; setLink: (v: string) => void;
  isLimited: boolean; setIsLimited: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel optional>Name des Drops</FieldLabel>
        <TextInput value={merchName} onChange={setMerchName} placeholder="z.B. Summer Collection" />
      </div>
      <div>
        <FieldLabel optional>Shop-Link</FieldLabel>
        <TextInput value={link} onChange={setLink} placeholder="https://…" type="url" />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="merch_limited"
          checked={isLimited}
          onChange={(e) => setIsLimited(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="merch_limited" className="text-sm" style={{ color: "var(--studio-text-primary)" }}>
          Limitiert
        </label>
      </div>
    </div>
  );
}

function StudioDetails({
  title, setTitle,
  description, setDescription,
  link, setLink,
}: {
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  link: string; setLink: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel optional>Titel</FieldLabel>
        <TextInput value={title} onChange={setTitle} placeholder="Neue Musik entsteht" />
      </div>
      <div>
        <FieldLabel optional>Beschreibung</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Woran arbeitet ihr gerade? Was dürfen Fans erwarten?"
          rows={3}
          className="studio-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>
      <div>
        <FieldLabel optional>Link</FieldLabel>
        <TextInput value={link} onChange={setLink} placeholder="https://…" type="url" />
      </div>
    </div>
  );
}

function FocusDetails({
  title, setTitle,
  description, setDescription,
  link, setLink,
}: {
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  link: string; setLink: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Titel</FieldLabel>
        <TextInput value={title} onChange={setTitle} placeholder="z.B. Unser neues Projekt" />
      </div>
      <div>
        <FieldLabel optional>Beschreibung</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mehr Kontext für eure Fans"
          rows={3}
          className="studio-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>
      <div>
        <FieldLabel optional>Link</FieldLabel>
        <TextInput value={link} onChange={setLink} placeholder="https://…" type="url" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Wizard
// ---------------------------------------------------------------------------

export default function CreatePhaseWizard({ onSuccess, onCancel }: WizardProps) {
  const { showToast } = useToast();

  const [step, setStep] = useState<WizardStep>("pick-category");
  const [category, setCategory] = useState<PhaseCategory | null>(null);
  const [loading, setLoading] = useState(false);

  // Release
  const [releaseKind, setReleaseKind] = useState<ReleaseKind>("single");
  // Live
  const [liveKind, setLiveKind] = useState<LiveKind>("concert");
  const [city, setCity] = useState("");
  const [tourName, setTourName] = useState("");
  // Merch
  const [merchName, setMerchName] = useState("");
  const [isLimited, setIsLimited] = useState(false);
  // Shared
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  // Activation
  const [activate, setActivate] = useState(false);

  const canProceedFromCategory = category !== null;
  const canSubmit =
    category !== null &&
    (category !== "focus" || title.trim().length > 0);

  const handleCategorySelect = (c: PhaseCategory) => {
    setCategory(c);
    // reset detail fields when switching category
    setTitle("");
    setDescription("");
    setLink("");
    setCity("");
    setTourName("");
    setMerchName("");
    setIsLimited(false);
  };

  const handleNext = () => {
    if (canProceedFromCategory) setStep("fill-details");
  };

  const handleBack = () => setStep("pick-category");

  const handleSubmit = async () => {
    if (!category || !canSubmit) return;

    const payload = buildRequest(
      category,
      releaseKind,
      liveKind,
      title,
      city,
      tourName,
      merchName,
      link,
      description,
      isLimited,
      activate,
    );

    setLoading(true);
    const result = await createSpotlight(payload);
    setLoading(false);

    if (result.success && result.data) {
      showToast(
        result.data.status === "active"
          ? "Phase aktiviert – du kannst jetzt Links und QR-Code verteilen."
          : "Phase geplant – aktiviere sie, wenn du sie teilen möchtest.",
        "success"
      );
      onSuccess(result.data);
    } else {
      showToast(result.error || "Fehler beim Erstellen", "error");
    }
  };

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.title ?? "";

  return (
    <div className="studio-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {step === "fill-details" && (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs rounded-lg px-2 py-1 transition-colors"
              style={{ color: "var(--studio-text-secondary)", border: "1px solid var(--studio-border)" }}
            >
              ← Zurück
            </button>
          )}
          <h2 className="studio-h2 text-base">
            {step === "pick-category" ? "Welche Art von Phase?" : `${categoryLabel} – Details`}
          </h2>
        </div>
        {/* Step indicator */}
        <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
          Schritt {step === "pick-category" ? "1" : "2"} / 2
        </span>
      </div>

      {/* Step 1: Category */}
      {step === "pick-category" && (
        <>
          <CategoryPicker selected={category} onSelect={setCategory} />
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              disabled={!canProceedFromCategory}
              onClick={handleNext}
              className="studio-btn studio-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="studio-btn studio-btn-secondary"
            >
              Abbrechen
            </button>
          </div>
        </>
      )}

      {/* Step 2: Details */}
      {step === "fill-details" && category && (
        <>
          <div className="space-y-5">
            {category === "release" && (
              <ReleaseDetails
                releaseKind={releaseKind} setReleaseKind={setReleaseKind}
                title={title} setTitle={setTitle}
                link={link} setLink={setLink}
              />
            )}
            {category === "live" && (
              <LiveDetails
                liveKind={liveKind} setLiveKind={setLiveKind}
                city={city} setCity={setCity}
                tourName={tourName} setTourName={setTourName}
                link={link} setLink={setLink}
              />
            )}
            {category === "merch" && (
              <MerchDetails
                merchName={merchName} setMerchName={setMerchName}
                link={link} setLink={setLink}
                isLimited={isLimited} setIsLimited={setIsLimited}
              />
            )}
            {category === "studio" && (
              <StudioDetails
                title={title} setTitle={setTitle}
                description={description} setDescription={setDescription}
                link={link} setLink={setLink}
              />
            )}
            {category === "focus" && (
              <FocusDetails
                title={title} setTitle={setTitle}
                description={description} setDescription={setDescription}
                link={link} setLink={setLink}
              />
            )}

            {/* Activate */}
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2"
              style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <input
                type="checkbox"
                id="wizard_activate"
                checked={activate}
                onChange={(e) => setActivate(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded"
              />
              <label htmlFor="wizard_activate" className="text-sm">
                <span className="font-medium" style={{ color: "var(--studio-success)" }}>
                  Sofort aktivieren
                </span>
                <span className="block text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)" }}>
                  Diese Phase wird direkt aktiv. Eine bestehende aktive Phase wird dabei beendet.
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              disabled={loading || !canSubmit}
              onClick={handleSubmit}
              className="studio-btn studio-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Erstelle…" : "Phase erstellen"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="studio-btn studio-btn-secondary disabled:opacity-50"
            >
              Abbrechen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
