"use client";

import { DragEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "intro" | "identity" | "profile" | "contact" | "publish";
type HandleStatus = "idle" | "checking" | "available" | "unavailable";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function OnboardingClient() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<Step>("intro");
  const [artistPageId, setArtistPageId] = useState<number | null>(null);
  
  // Step 1: Identity (Handle + Display Name)
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("idle");
  const [handleError, setHandleError] = useState<string | null>(null);
  
  // Step 2: Profile (Bio + Avatar)
  const [bio, setBio] = useState("");
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle");
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Step 2: Hero image upload
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Contact
  const [contactEmail, setContactEmail] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  // Step 4: Publish
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate a URL-safe handle from a display name
  function generateHandleFromName(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip diacritics (ä→a etc.)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 38);
  }

  // Check one handle candidate — returns true if available
  async function checkOneHandle(candidate: string): Promise<boolean | null> {
    try {
      const response = await fetch("/api/studio/handles/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: candidate }),
      });

      if (response.status === 401 || response.status === 403) {
        setHandleStatus("idle");
        setHandleError("Sitzung abgelaufen. Bitte lade die Seite neu.");
        return null; // signal auth error
      }

      const json = await response.json().catch(() => null);
      return (json?.data?.available ?? false) as boolean;
    } catch {
      return null;
    }
  }

  // Find first available handle — tries base, base-2 … base-10
  async function findAvailableHandle(base: string): Promise<void> {
    if (!base || base.length < 2) {
      setHandleStatus("idle");
      setHandle("");
      return;
    }

    setHandleStatus("checking");
    setHandleError(null);

    const candidates = [
      base,
      ...Array.from({ length: 9 }, (_, i) => `${base}-${i + 2}`),
    ];

    for (const candidate of candidates) {
      if (candidate.length < 3) continue;
      const available = await checkOneHandle(candidate);
      if (available === null) return; // auth error — already handled
      if (available) {
        setHandle(candidate);
        setHandleStatus("available");
        return;
      }
    }

    // All candidates taken (extremely rare)
    setHandle(base);
    setHandleStatus("unavailable");
    setHandleError("Kein freier Handle gefunden. Bitte wähle einen etwas anderen Namen.");
  }

  // Debounce auto-generation when display name changes
  function scheduleHandleGenerate(name: string) {
    if (handleCheckTimeoutRef.current) {
      clearTimeout(handleCheckTimeoutRef.current);
    }
    const base = generateHandleFromName(name);
    if (!base || base.length < 2) {
      setHandle("");
      setHandleStatus("idle");
      return;
    }
    setHandle(base); // optimistic preview
    handleCheckTimeoutRef.current = setTimeout(() => {
      void findAvailableHandle(base);
    }, 500);
  }

  // Step 1: Create artist page with auto-generated handle + display_name
  async function handleIdentitySubmit(event: FormEvent) {
    event.preventDefault();
    setHandleError(null);

    if (!displayName.trim()) {
      setHandleError("Künstlername ist erforderlich.");
      return;
    }

    if (!handle || handle.length < 3) {
      setHandleError("Handle konnte nicht generiert werden. Bitte ändere deinen Künstlernamen leicht ab.");
      return;
    }

    setHandleStatus("checking");

    try {
      const response = await fetch("/api/studio/artist-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle,
          display_name: displayName.trim(),
        }),
      });

      const json: unknown = await response.json().catch(() => null);
      const data = (json as { data?: { id?: number; handle?: string; display_name?: string } } | null)?.data;

      if (!response.ok) {
        const apiError = (json as { error?: { message?: string; fields?: Record<string, string[]> } } | null)?.error;
        const fields = apiError?.fields;

        if (fields?.handle?.length) {
          setHandleError(fields.handle[0]);
        } else if (apiError?.message) {
          setHandleError(apiError.message);
        } else {
          setHandleError("Fehler beim Erstellen der Seite. Bitte versuche es erneut.");
        }
        
        setHandleStatus("unavailable");
        return;
      }

      if (typeof data?.id === "number") {
        setArtistPageId(data.id);
      }

      if (typeof data?.handle === "string") {
        setHandle(data.handle);
      }

      setHandleStatus("available");
      setStep("profile");
    } catch {
      setHandleError("Netzwerkfehler. Bitte prüfe deine Verbindung.");
      setHandleStatus("unavailable");
    }
  }

  // Auto-save profile changes
  async function saveProfile(nextBio: string) {
    if (!artistPageId) return;

    setProfileSaveStatus("saving");
    setProfileError(null);

    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: nextBio.trim() || null,
        }),
      });

      if (!response.ok) {
        const json: unknown = await response.json().catch(() => null);
        const apiError = (json as { error?: { message?: string } } | null)?.error;
        setProfileSaveStatus("error");
        setProfileError(apiError?.message ?? "Fehler beim Speichern.");
        return;
      }

      setProfileSaveStatus("saved");
      
      // Clear saved status after 2 seconds
      setTimeout(() => {
        setProfileSaveStatus("idle");
      }, 2000);
    } catch {
      setProfileSaveStatus("error");
      setProfileError("Netzwerkfehler beim Speichern.");
    }
  }

  // Debounced auto-save
  function scheduleProfileSave(nextBio: string) {
    if (!artistPageId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveProfile(nextBio);
    }, 800);
  }

  // Step 2: Hero image upload
  const handleHeroFile = useCallback(async (file: File) => {
    setHeroUploadError(null);

    if (!file.type.startsWith("image/")) {
      setHeroUploadError("Nur Bilddateien erlaubt (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setHeroUploadError("Maximale Dateigröße: 5 MB.");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setHeroPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    setHeroUploading(true);
    const formData = new FormData();
    formData.append("hero_image", file);

    try {
      const res = await fetch("/api/studio/upload-hero", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json: unknown = await res.json().catch(() => null);
        const msg = (json as { error?: string } | null)?.error ?? "Upload fehlgeschlagen.";
        setHeroUploadError(msg);
        setHeroPreviewUrl(null);
      }
    } catch {
      setHeroUploadError("Netzwerkfehler beim Upload.");
      setHeroPreviewUrl(null);
    } finally {
      setHeroUploading(false);
    }
  }, []);

  function handleHeroDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleHeroFile(file);
  }

  // Step 2: Navigate to contact
  function handleProfileContinue() {
    if (!bio.trim()) {
      setProfileError("Bio ist erforderlich.");
      return;
    }
    if (!heroPreviewUrl) {
      setHeroUploadError("Bitte lade ein Headerbild hoch.");
      return;
    }
    setStep("contact");
  }

  // Step 3: Validate contact and save, then navigate to publish
  async function handleContactContinue() {
    setContactError(null);

    if (!contactEmail.trim()) {
      setContactError("Kontakt-E-Mail ist erforderlich.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setContactError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (!artistPageId) {
      setStep("publish");
      return;
    }

    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_email: contactEmail.trim(),
          contact_url: contactUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        const json: unknown = await response.json().catch(() => null);
        const apiError = (json as { error?: { message?: string } } | null)?.error;
        setContactError(apiError?.message ?? "Fehler beim Speichern der Kontaktdaten.");
        return;
      }
    } catch {
      setContactError("Netzwerkfehler beim Speichern.");
      return;
    }

    setStep("publish");
  }

  // Step 3: Publish
  async function handlePublish() {
    if (!artistPageId) return;

    setPublishError(null);
    setPublishing(true);

    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}/publish`, {
        method: "POST",
      });

      const json: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError = (json as { error?: { message?: string } } | null)?.error;
        setPublishError(apiError?.message ?? "Fehler beim Veröffentlichen.");
        setPublishing(false);
        return;
      }

      // Redirect to studio
      router.push("/studio");
    } catch {
      setPublishError("Netzwerkfehler beim Veröffentlichen.");
      setPublishing(false);
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (handleCheckTimeoutRef.current) {
        clearTimeout(handleCheckTimeoutRef.current);
      }
    };
  }, []);

  // -----------------------------
  // Shared: Step progress header
  // -----------------------------
  const STEPS: { key: Step; label: string }[] = [
    { key: "identity", label: "Identität" },
    { key: "profile", label: "Profil" },
    { key: "contact", label: "Kontakt" },
    { key: "publish", label: "Fertig" },
  ];

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  function StepHeader({ title, description }: { title: string; description: string }) {
    return (
      <div className="space-y-6">
        {/* Wordmark + steps */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">Vibaro</span>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={[
                      "flex items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                      active
                        ? "h-6 w-6 bg-zinc-50 text-zinc-900"
                        : done
                        ? "h-5 w-5 bg-zinc-700 text-zinc-300"
                        : "h-5 w-5 border border-zinc-800 text-zinc-600",
                    ].join(" ")}
                  >
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={["h-px w-5 transition-colors", done ? "bg-zinc-600" : "bg-zinc-800"].join(" ")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Title block */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>
    );
  }

  // Shared field label
  function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
      <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500">
        {children}
      </label>
    );
  }

  // Shared action row
  function ActionRow({
    onBack,
    backLabel = "Zurück",
    children,
  }: {
    onBack?: () => void;
    backLabel?: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between pt-8 border-t border-zinc-800/60">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            ← {backLabel}
          </button>
        ) : (
          <span />
        )}
        {children}
      </div>
    );
  }

  // -----------------------------
  // Step 0: Welcome
  // -----------------------------
  if (step === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Wordmark */}
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-14">Vibaro</p>

        {/* Headline */}
        <div className="text-center space-y-3 max-w-lg">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            Willkommen.<br />
            <span className="text-zinc-500">Deine Seite wartet auf dich.</span>
          </h1>
          <p className="text-sm text-zinc-600">
            Wir richten jetzt gemeinsam deinen Auftritt ein.{" "}
            <span className="text-zinc-500">Plane 10–20 Minuten dafür ein.</span>
          </p>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
          {/* Required */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-50" />
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-300">
                Notwendig
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: "Künstlername", desc: "Dein öffentlicher Name" },
                { label: "Genre", desc: "Was du machst, in einem Wort" },
                { label: "Bio", desc: "Ein paar Sätze über dich" },
                { label: "Headerbild", desc: "Das Banner deiner Seite" },
                { label: "Kontakt", desc: "Booking- oder Kontakt-E-Mail" },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 text-zinc-400">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1.5 6.5l3 3L11.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm">
                    <span className="text-zinc-200">{label}</span>
                    <span className="block text-xs text-zinc-600">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optional */}
          <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-700" />
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                Optional
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: "Logo", desc: "Dein Profilbild" },
                { label: "Social Links", desc: "Instagram, Spotify & Co." },
                { label: "Shows", desc: "Kommende Auftritte" },
                { label: "Media", desc: "Player, Video-Links" },
                { label: "Bilder", desc: "Pressefotos & Galerie" },
                { label: "Presse", desc: "Zitate & Pressestimmen" },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-1 w-1 rounded-full bg-zinc-700 flex-shrink-0" />
                  <span className="text-sm">
                    <span className="text-zinc-500">{label}</span>
                    <span className="block text-xs text-zinc-700">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-700 pt-1 border-t border-zinc-800/40">
              Alles davon kann jederzeit im Studio ergänzt oder geändert werden.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setStep("identity")}
            className="rounded-full bg-zinc-50 px-10 py-3.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors shadow-lg shadow-black/40"
          >
            Loslegen
          </button>
          <p className="text-xs text-zinc-700">
            Alles lässt sich später jederzeit anpassen.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 1: Identity (Name only — handle auto-generated)
  // -----------------------------
  if (step === "identity") {
    const canSubmit =
      displayName.trim().length > 0 &&
      handle.length >= 3 &&
      handleStatus === "available";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <StepHeader
            title="Wie heißt du?"
            description="Trag deinen Künstlernamen ein – deine Web-Adresse wird automatisch generiert."
          />

          <form onSubmit={handleIdentitySubmit} className="space-y-6">
            {/* Display Name Field */}
            <div className="space-y-2">
              <FieldLabel>Künstlername</FieldLabel>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setHandleError(null);
                  scheduleHandleGenerate(e.target.value);
                }}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                placeholder="z.B. Emily Jordan"
                autoFocus
              />
              <p className="text-xs text-zinc-700">Erscheint auf deiner öffentlichen Seite. Jederzeit änderbar.</p>
            </div>

            {/* Auto-generated URL preview */}
            {displayName.trim().length > 0 && (
              <div className="space-y-1.5">
                <FieldLabel>Deine Web-Adresse</FieldLabel>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3">
                  <span className="text-sm text-zinc-600 select-none whitespace-nowrap">vibaro.app/p/</span>
                  <span className="text-sm text-zinc-300 min-w-0 truncate">
                    {handle || "…"}
                  </span>
                  <span className="ml-auto shrink-0">
                    {handleStatus === "checking" && (
                      <span className="text-xs text-zinc-600">Prüfe…</span>
                    )}
                    {handleStatus === "available" && (
                      <span className="text-xs text-emerald-500">✓ Frei</span>
                    )}
                    {handleStatus === "unavailable" && (
                      <span className="text-xs text-red-400">✗</span>
                    )}
                  </span>
                </div>
                {handleError ? (
                  <p className="text-xs text-red-400">{handleError}</p>
                ) : (
                  <p className="text-xs text-zinc-700">Wird aus deinem Namen generiert – kann später nicht mehr geändert werden.</p>
                )}
              </div>
            )}

            <ActionRow onBack={() => setStep("intro")}>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Weiter →
              </button>
            </ActionRow>
          </form>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 2: Profile (Bio)
  // -----------------------------
  if (step === "profile") {
    const canContinue = bio.trim().length >= 10 && !!heroPreviewUrl && !heroUploading;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <StepHeader
            title="Erzähl von dir."
            description="Ein paar Sätze, die Besucher deiner Seite lesen werden."
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <FieldLabel>Bio</FieldLabel>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setProfileError(null);
                  scheduleProfileSave(e.target.value);
                }}
                rows={4}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors resize-none placeholder:text-zinc-700"
                placeholder="Singer-Songwriter aus Berlin. Indie-Folk mit elektronischen Elementen – Musik, die Raum lässt."
                autoFocus
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-700">Mindestens 10 Zeichen</p>
                <span className="text-xs text-zinc-700">{bio.length} Z.</span>
              </div>
              {profileError && <p className="text-xs text-red-400">{profileError}</p>}
            </div>

            {/* Genre field */}
            <div className="space-y-2">
              <FieldLabel>Genre</FieldLabel>
              <input
                type="text"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                placeholder="z.B. Indie-Folk, Electronic, Hip-Hop"
              />
              <p className="text-xs text-zinc-700">Erscheint als Tag auf deiner Seite.</p>
            </div>

            {/* Headerbild upload */}
            <div className="space-y-2">
              <FieldLabel>Headerbild</FieldLabel>

              {/* Hidden file input */}
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleHeroFile(file);
                  e.target.value = "";
                }}
              />

              {heroPreviewUrl ? (
                /* Preview state */
                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroPreviewUrl}
                    alt="Headerbild Vorschau"
                    className="w-full h-32 object-cover"
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-zinc-950/60 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => heroInputRef.current?.click()}
                      className="rounded-lg bg-zinc-800/90 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
                    >
                      Ersetzen
                    </button>
                    <button
                      type="button"
                      onClick={() => { setHeroPreviewUrl(null); setHeroUploadError(null); }}
                      className="rounded-lg bg-zinc-800/90 px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700 transition-colors"
                    >
                      Entfernen
                    </button>
                  </div>
                  {heroUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70">
                      <span className="text-xs text-zinc-300">Lädt hoch…</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Drop zone */
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => heroInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && heroInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleHeroDrop}
                  className={[
                    "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors select-none",
                    isDraggingOver
                      ? "border-zinc-500 bg-zinc-800/40"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60",
                  ].join(" ")}
                >
                  {heroUploading ? (
                    <p className="text-xs text-zinc-500">Lädt hoch…</p>
                  ) : (
                    <>
                      <svg className="text-zinc-600" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <div>
                        <p className="text-sm text-zinc-400">
                          {isDraggingOver ? "Loslassen zum Hochladen" : "Hierher ziehen oder klicken"}
                        </p>
                        <p className="text-xs text-zinc-700 mt-0.5">JPG, PNG, WebP · max. 5 MB · Empfohlen: 1500×500 px</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {heroUploadError && (
                <p className="text-xs text-red-400">{heroUploadError}</p>
              )}
            </div>

            {/* Auto-save indicator */}
            {profileSaveStatus !== "idle" && (
              <div className="flex items-center gap-2 text-xs">
                {profileSaveStatus === "saving" && <span className="text-zinc-600">Speichere…</span>}
                {profileSaveStatus === "saved" && <span className="text-emerald-600">✓ Gespeichert</span>}
                {profileSaveStatus === "error" && <span className="text-red-400">Fehler beim Speichern</span>}
              </div>
            )}

            <ActionRow onBack={() => setStep("identity")}>
              <button
                type="button"
                onClick={handleProfileContinue}
                disabled={!canContinue}
                className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Weiter →
              </button>
            </ActionRow>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 3: Contact
  // -----------------------------
  if (step === "contact") {
    const canContinue = contactEmail.trim().length > 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <StepHeader
            title="Wie kann man dich erreichen?"
            description="Diese Infos erscheinen auf deiner öffentlichen Seite und helfen Fans und Buchern, dich zu kontaktieren."
          />

          <div className="space-y-6">
            {/* Contact Email */}
            <div className="space-y-2">
              <FieldLabel>Kontakt-E-Mail</FieldLabel>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  setContactError(null);
                }}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                placeholder="booking@deinemail.com"
                autoFocus
              />
              <p className="text-xs text-zinc-700">Für Booking-Anfragen oder allgemeine Kontaktaufnahme.</p>
            </div>

            {/* Contact / Website URL */}
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

            {contactError && (
              <p className="text-xs text-red-400">{contactError}</p>
            )}

            <ActionRow onBack={() => setStep("profile")} backLabel="Profil">
              <button
                type="button"
                onClick={handleContactContinue}
                disabled={!canContinue}
                className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Weiter →
              </button>
            </ActionRow>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 4: Publish
  // -----------------------------
  if (step === "publish") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <StepHeader
            title="Fast fertig."
            description="So sieht deine Seite aus. Du kannst jetzt veröffentlichen oder das Studio erst erkunden."
          />

          {/* Preview card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {/* Mock header bar */}
            <div className="border-b border-zinc-800/60 bg-zinc-900/80 px-5 py-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-zinc-700" />
              <div className="h-2 w-2 rounded-full bg-zinc-700" />
              <div className="h-2 w-2 rounded-full bg-zinc-700" />
              <span className="ml-3 text-xs text-zinc-600">vibaro.app/p/{handle}</span>
            </div>

            {/* Preview body */}
            <div className="px-6 py-8 space-y-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold tracking-tight text-zinc-100">{displayName}</p>
                <p className="text-xs text-zinc-500">vibaro.app/p/{handle}</p>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">{bio}</p>

              <div className="flex items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 px-3 py-1 text-xs text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                  Entwurf – noch nicht sichtbar
                </div>
              </div>
            </div>
          </div>

          {publishError && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
              <p className="text-sm text-red-400">{publishError}</p>
            </div>
          )}

          <ActionRow onBack={() => setStep("contact")} backLabel="Kontakt">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/studio")}
                disabled={publishing}
                className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-40"
              >
                Später
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="rounded-full bg-zinc-50 px-7 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {publishing ? "Veröffentliche…" : "Veröffentlichen →"}
              </button>
            </div>
          </ActionRow>
        </div>
      </div>
    );
  }

  return null;
}
