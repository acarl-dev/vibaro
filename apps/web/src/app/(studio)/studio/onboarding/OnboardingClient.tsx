"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "intro" | "identity" | "profile" | "publish";
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
  
  // Step 3: Publish
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normalization for handle input (during typing)
  function normalizeHandleInput(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  // Final normalization for handle (on submit)
  function normalizeHandleFinal(value: string): string {
    return normalizeHandleInput(value).replace(/^-+|-+$/g, "");
  }

  // Check handle availability
  async function checkHandleAvailability(handleToCheck: string) {
    if (!handleToCheck || handleToCheck.length < 3) {
      setHandleStatus("idle");
      return;
    }

    setHandleStatus("checking");

    try {
      const response = await fetch("/api/studio/handles/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleToCheck }),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        setHandleStatus("unavailable");
        return;
      }

      const available = json?.data?.available ?? false;
      setHandleStatus(available ? "available" : "unavailable");
    } catch {
      setHandleStatus("idle");
    }
  }

  // Debounced handle check
  function scheduleHandleCheck(value: string) {
    if (handleCheckTimeoutRef.current) {
      clearTimeout(handleCheckTimeoutRef.current);
    }

    const normalized = normalizeHandleFinal(value);
    
    if (!normalized || normalized.length < 3) {
      setHandleStatus("idle");
      return;
    }

    handleCheckTimeoutRef.current = setTimeout(() => {
      void checkHandleAvailability(normalized);
    }, 500);
  }

  // Step 1: Create artist page with handle + display_name
  async function handleIdentitySubmit(event: FormEvent) {
    event.preventDefault();
    setHandleError(null);

    const normalizedHandle = normalizeHandleFinal(handle);
    
    if (!normalizedHandle || normalizedHandle.length < 3 || normalizedHandle.length > 40) {
      setHandleError("Handle muss zwischen 3 und 40 Zeichen lang sein.");
      return;
    }

    if (!displayName.trim()) {
      setHandleError("Anzeigename ist erforderlich.");
      return;
    }

    setHandleStatus("checking");

    try {
      const response = await fetch("/api/studio/artist-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: normalizedHandle,
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

  // Step 2: Navigate to publish
  function handleProfileContinue() {
    if (!bio.trim()) {
      setProfileError("Bio ist erforderlich.");
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
  // Step 0: Intro
  // -----------------------------
  if (step === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Willkommen bei Vibaro</h1>
          <p className="text-lg text-zinc-400">
            Erstelle in wenigen Schritten deine persönliche Musikseite.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Was dich erwartet
          </h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-zinc-500">1.</span>
              <span>Wähle deine feste Web-Adresse und deinen Namen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500">2.</span>
              <span>Erzähle kurz über dich</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500">3.</span>
              <span>Vorschau ansehen und veröffentlichen</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setStep("identity")}
            className="rounded-full bg-zinc-100 px-8 py-3 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
          >
            Los geht&apos;s
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 1: Identity (Handle + Display Name)
  // -----------------------------
  if (step === "identity") {
    const canSubmit = 
      handle.trim().length >= 3 && 
      displayName.trim().length > 0 && 
      handleStatus !== "unavailable" &&
      handleStatus !== "checking";

    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Schritt 1 / 3</p>
          <h2 className="text-2xl font-semibold tracking-tight">Identität</h2>
          <p className="text-sm text-zinc-400">
            Wähle deine feste Web-Adresse und deinen öffentlichen Namen.
          </p>
        </div>

        <form onSubmit={handleIdentitySubmit} className="space-y-6">
          {/* Handle Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Web-Adresse (Handle)
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
              <span className="text-sm text-zinc-500">vibaro.app/p/</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => {
                  const value = normalizeHandleInput(e.target.value);
                  setHandle(value);
                  setHandleError(null);
                  scheduleHandleCheck(value);
                }}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder="dein-handle"
                autoFocus
              />
            </div>
            <p className="text-xs text-zinc-500">
              Deine feste Webadresse. Kleinbuchstaben, Zahlen und Bindestriche.
            </p>
            {handleStatus === "checking" && (
              <p className="text-xs text-zinc-400">Prüfe Verfügbarkeit...</p>
            )}
            {handleStatus === "available" && !handleError && (
              <p className="text-xs text-emerald-400">✓ Verfügbar</p>
            )}
            {handleStatus === "unavailable" && !handleError && (
              <p className="text-xs text-red-400">Handle bereits vergeben</p>
            )}
            {handleError && <p className="text-xs text-red-400">{handleError}</p>}
          </div>

          {/* Display Name Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Anzeigename
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
              placeholder="z.B. Emily Jordan"
            />
            <p className="text-xs text-zinc-500">
              Name, der auf deiner Seite erscheint. Du kannst ihn jederzeit ändern.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep("intro")}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Zurück
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -----------------------------
  // Step 2: Profile (Bio + Avatar)
  // -----------------------------
  if (step === "profile") {
    const canContinue = bio.trim().length >= 10;

    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Schritt 2 / 3</p>
          <h2 className="text-2xl font-semibold tracking-tight">Profil</h2>
          <p className="text-sm text-zinc-400">
            Erzähle kurz über dich. Diese Info erscheint auf deiner Seite.
          </p>
        </div>

        <div className="space-y-6">
          {/* Bio Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Kurz-Bio (Pflicht)
            </label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setProfileError(null);
                scheduleProfileSave(e.target.value);
              }}
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 resize-none"
              placeholder="z.B. Singer-Songwriter aus Berlin. Indie-Folk mit elektronischen Elementen."
              autoFocus
            />
            <div className="flex items-center justify-between text-xs">
              <p className="text-zinc-500">Mindestens 10 Zeichen</p>
              {profileSaveStatus === "saving" && (
                <p className="text-zinc-400">Speichere...</p>
              )}
              {profileSaveStatus === "saved" && (
                <p className="text-emerald-400">✓ Gespeichert</p>
              )}
              {profileSaveStatus === "error" && (
                <p className="text-red-400">Fehler beim Speichern</p>
              )}
            </div>
            {profileError && <p className="text-xs text-red-400">{profileError}</p>}
          </div>

          {/* Avatar (Optional - simplified for MVP) */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Profilbild (Optional)
            </label>
            <p className="text-xs text-zinc-400">
              Upload kommt später. Du kannst das Bild nach dem Onboarding hinzufügen.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep("identity")}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Zurück
            </button>
            <button
              type="button"
              onClick={handleProfileContinue}
              disabled={!canContinue}
              className="rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter zur Vorschau
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Step 3: Publish
  // -----------------------------
  if (step === "publish") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Schritt 3 / 3</p>
          <h2 className="text-2xl font-semibold tracking-tight">Vorschau & Veröffentlichung</h2>
          <p className="text-sm text-zinc-400">
            So sieht deine Seite aus. Bereit zum Veröffentlichen?
          </p>
        </div>

        {/* Preview Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              vibaro.app/p/{handle}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{displayName}</h1>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{bio}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>Entwurf</span>
            </div>
            <span className="text-zinc-600">Noch nicht öffentlich sichtbar</span>
          </div>
        </div>

        {publishError && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
            <p className="text-sm text-red-400">{publishError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep("profile")}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            disabled={publishing}
          >
            Zurück
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/studio")}
              className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              disabled={publishing}
            >
              Später weiter bearbeiten
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? "Veröffentliche..." : "Veröffentlichen"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
