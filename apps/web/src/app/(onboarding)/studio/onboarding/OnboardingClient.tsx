"use client";

import { DragEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import IntroStep from "./steps/IntroStep";
import IdentityStep from "./steps/IdentityStep";
import ProfileStep from "./steps/ProfileStep";
import ContactStep from "./steps/ContactStep";
import PublishStep from "./steps/PublishStep";

type Step = "intro" | "identity" | "profile" | "contact" | "publish";
type HandleStatus = "idle" | "checking" | "available" | "unavailable";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function OnboardingClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("intro");
  const [artistPageId, setArtistPageId] = useState<number | null>(null);

  // Identity
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("idle");
  const [handleError, setHandleError] = useState<string | null>(null);

  // Profile
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState("");
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);

  // Contact
  const [contactEmail, setContactEmail] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  // Publish
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (handleCheckTimeoutRef.current) clearTimeout(handleCheckTimeoutRef.current);
    };
  }, []);

  function generateHandleFromName(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 38);
  }

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
        return null;
      }
      const json = await response.json().catch(() => null);
      return (json?.data?.available ?? false) as boolean;
    } catch {
      return null;
    }
  }

  async function findAvailableHandle(base: string): Promise<void> {
    if (!base || base.length < 2) { setHandleStatus("idle"); setHandle(""); return; }
    setHandleStatus("checking");
    setHandleError(null);
    const candidates = [base, ...Array.from({ length: 9 }, (_, i) => `${base}-${i + 2}`)];
    for (const candidate of candidates) {
      if (candidate.length < 3) continue;
      const available = await checkOneHandle(candidate);
      if (available === null) return;
      if (available) { setHandle(candidate); setHandleStatus("available"); return; }
    }
    setHandle(base);
    setHandleStatus("unavailable");
    setHandleError("Kein freier Handle gefunden. Bitte w\u00e4hle einen etwas anderen Namen.");
  }

  function scheduleHandleGenerate(name: string) {
    if (handleCheckTimeoutRef.current) clearTimeout(handleCheckTimeoutRef.current);
    const base = generateHandleFromName(name);
    if (!base || base.length < 2) { setHandle(""); setHandleStatus("idle"); return; }
    setHandle(base);
    handleCheckTimeoutRef.current = setTimeout(() => { void findAvailableHandle(base); }, 500);
  }

  async function handleIdentitySubmit(event: FormEvent) {
    event.preventDefault();
    setHandleError(null);
    if (!displayName.trim()) { setHandleError("K\u00fcnstlername ist erforderlich."); return; }
    if (!handle || handle.length < 3) { setHandleError("Handle konnte nicht generiert werden. Bitte \u00e4ndere deinen K\u00fcnstlernamen leicht ab."); return; }
    setHandleStatus("checking");
    try {
      const response = await fetch("/api/studio/artist-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, display_name: displayName.trim() }),
      });
      const json: unknown = await response.json().catch(() => null);
      const data = (json as { data?: { id?: number; handle?: string } } | null)?.data;
      if (!response.ok) {
        const apiError = (json as { error?: { message?: string; fields?: Record<string, string[]> } } | null)?.error;
        setHandleError(apiError?.fields?.handle?.[0] ?? apiError?.message ?? "Fehler beim Erstellen der Seite.");
        setHandleStatus("unavailable");
        return;
      }
      if (typeof data?.id === "number") setArtistPageId(data.id);
      if (typeof data?.handle === "string") setHandle(data.handle);
      setHandleStatus("available");
      setStep("profile");
    } catch {
      setHandleError("Netzwerkfehler. Bitte pr\u00fcfe deine Verbindung.");
      setHandleStatus("unavailable");
    }
  }

  async function saveProfile(nextBio: string) {
    if (!artistPageId) return;
    setProfileSaveStatus("saving");
    setProfileError(null);
    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: nextBio.trim() || null }),
      });
      if (!response.ok) {
        const json: unknown = await response.json().catch(() => null);
        setProfileSaveStatus("error");
        setProfileError((json as { error?: { message?: string } } | null)?.error?.message ?? "Fehler beim Speichern.");
        return;
      }
      setProfileSaveStatus("saved");
      setTimeout(() => setProfileSaveStatus("idle"), 2000);
    } catch {
      setProfileSaveStatus("error");
      setProfileError("Netzwerkfehler beim Speichern.");
    }
  }

  function scheduleProfileSave(nextBio: string) {
    if (!artistPageId) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => { void saveProfile(nextBio); }, 800);
  }

  const handleHeroFile = useCallback(async (file: File) => {
    setHeroUploadError(null);
    if (!file.type.startsWith("image/")) { setHeroUploadError("Nur Bilddateien erlaubt (JPG, PNG, WebP)."); return; }
    if (file.size > 5 * 1024 * 1024) { setHeroUploadError("Maximale Dateigr\u00f6\u00dfe: 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => setHeroPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    setHeroUploading(true);
    const formData = new FormData();
    formData.append("hero_image", file);
    try {
      const res = await fetch("/api/studio/upload-hero", { method: "POST", body: formData });
      if (!res.ok) {
        const json: unknown = await res.json().catch(() => null);
        setHeroUploadError((json as { error?: string } | null)?.error ?? "Upload fehlgeschlagen.");
        setHeroPreviewUrl(null);
      }
    } catch {
      setHeroUploadError("Netzwerkfehler beim Upload.");
      setHeroPreviewUrl(null);
    } finally {
      setHeroUploading(false);
    }
  }, []);

  function handleProfileContinue() {
    if (!bio.trim()) { setProfileError("Bio ist erforderlich."); return; }
    if (!heroPreviewUrl) { setHeroUploadError("Bitte lade ein Headerbild hoch."); return; }
    setStep("contact");
  }

  async function handleContactContinue() {
    setContactError(null);
    if (!contactEmail.trim()) { setContactError("Kontakt-E-Mail ist erforderlich."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) { setContactError("Bitte gib eine g\u00fcltige E-Mail-Adresse ein."); return; }
    if (!artistPageId) { setStep("publish"); return; }
    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_email: contactEmail.trim(), contact_url: contactUrl.trim() || null }),
      });
      if (!response.ok) {
        const json: unknown = await response.json().catch(() => null);
        setContactError((json as { error?: { message?: string } } | null)?.error?.message ?? "Fehler beim Speichern der Kontaktdaten.");
        return;
      }
    } catch {
      setContactError("Netzwerkfehler beim Speichern.");
      return;
    }
    setStep("publish");
  }

  async function handlePublish() {
    if (!artistPageId) return;
    setPublishError(null);
    setPublishing(true);
    try {
      const response = await fetch(`/api/studio/artist-pages/${artistPageId}/publish`, { method: "POST" });
      const json: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setPublishError((json as { error?: { message?: string } } | null)?.error?.message ?? "Fehler beim Ver\u00f6ffentlichen.");
        setPublishing(false);
        return;
      }
      router.push("/studio");
    } catch {
      setPublishError("Netzwerkfehler beim Ver\u00f6ffentlichen.");
      setPublishing(false);
    }
  }

  if (step === "intro") return <IntroStep onNext={() => setStep("identity")} />;

  if (step === "identity") {
    return (
      <IdentityStep
        displayName={displayName}
        setDisplayName={setDisplayName}
        handle={handle}
        handleStatus={handleStatus}
        handleError={handleError}
        onDisplayNameChange={scheduleHandleGenerate}
        onSubmit={handleIdentitySubmit}
        onBack={() => setStep("intro")}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileStep
        bio={bio}
        setBio={setBio}
        genre={genre}
        setGenre={setGenre}
        profileSaveStatus={profileSaveStatus}
        profileError={profileError}
        heroPreviewUrl={heroPreviewUrl}
        setHeroPreviewUrl={setHeroPreviewUrl}
        heroUploading={heroUploading}
        heroUploadError={heroUploadError}
        setHeroUploadError={setHeroUploadError}
        onBioChange={scheduleProfileSave}
        onHeroFile={handleHeroFile}
        onContinue={handleProfileContinue}
        onBack={() => setStep("identity")}
      />
    );
  }

  if (step === "contact") {
    return (
      <ContactStep
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactUrl={contactUrl}
        setContactUrl={setContactUrl}
        contactError={contactError}
        setContactError={setContactError}
        onContinue={() => { void handleContactContinue(); }}
        onBack={() => setStep("profile")}
      />
    );
  }

  return (
    <PublishStep
      handle={handle}
      displayName={displayName}
      bio={bio}
      publishing={publishing}
      publishError={publishError}
      onPublish={() => { void handlePublish(); }}
      onSkip={() => router.push("/studio")}
      onBack={() => setStep("contact")}
    />
  );
}
