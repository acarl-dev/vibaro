"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BandNameStep from "./steps/IntroStep";
import PhaseStep from "./steps/IdentityStep";
import PhaseContextStep from "./steps/ProfileStep";
import PreviewStep from "./steps/ContactStep";
import { studioFetch } from "@/lib/api/client-fetch";
import type { PhaseType, ReleaseKind, LiveKind } from "./steps/onboarding-shared";
import type { SpotlightItem } from "@/app/(public)/p/components/types";

type Step = "band-name" | "phase" | "phase-context" | "preview";
type HandleStatus = "idle" | "checking" | "available" | "unavailable";

function deriveSpotlightParams(
  phaseType: PhaseType,
  releaseKind: ReleaseKind,
  liveKind: LiveKind,
  phaseTitle: string,
  phaseLabel: string,
): { type: string; title: string; ctaLabel: string } {
  if (phaseType === "release") {
    const kindLabel = { single: "Single", album: "Album", video: "Video" }[releaseKind];
    return {
      type: releaseKind,
      title: phaseTitle.trim() || `Neue ${kindLabel}`,
      ctaLabel: "Jetzt anh\u00f6ren",
    };
  }
  if (phaseType === "live") {
    if (liveKind === "concert") {
      const place = phaseLabel.trim();
      return {
        type: "event",
        title: place ? `Live in ${place}` : "Live-Konzert",
        ctaLabel: "Shows ansehen",
      };
    }
    return { type: "tour", title: phaseLabel.trim() || "Auf Tour", ctaLabel: "Shows ansehen" };
  }
  if (phaseType === "merch") {
    return { type: "merch", title: "Neues Merch", ctaLabel: "Jetzt shoppen" };
  }
  return { type: "album", title: "Neues Album in Arbeit", ctaLabel: "Mehr erfahren" };
}

export function OnboardingClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("band-name");
  const [artistPageId, setArtistPageId] = useState<number | null>(null);
  const artistPageIdRef = useRef<number | null>(null);

  // BandName step
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("idle");
  const [handleError, setHandleError] = useState<string | null>(null);
  const [bandNameSaving, setBandNameSaving] = useState(false);

  // Phase step
  const [phaseType, setPhaseType] = useState<PhaseType | null>(null);

  // PhaseContext step
  const [releaseKind, setReleaseKind] = useState<ReleaseKind>("single");
  const [liveKind, setLiveKind] = useState<LiveKind>("concert");
  const [phaseTitle, setPhaseTitle] = useState("");
  const [phaseLabel, setPhaseLabel] = useState("");
  const [phaseUrl, setPhaseUrl] = useState("");

  // Generation / preview
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [previewSpotlight, setPreviewSpotlight] = useState<SpotlightItem | null>(null);
  const [previewBio, setPreviewBio] = useState("");

  const handleCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (handleCheckTimeoutRef.current) clearTimeout(handleCheckTimeoutRef.current);
    };
  }, []);

  // ── Handle helpers ──────────────────────────────────────────────────

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

  // ── Step 1: Band name ────────────────────────────────────────────────

  async function handleBandNameSubmit(event: FormEvent) {
    event.preventDefault();
    setHandleError(null);
    if (!displayName.trim()) { setHandleError("Bandname ist erforderlich."); return; }
    if (!handle || handle.length < 3) {
      setHandleError("Handle konnte nicht generiert werden. Bitte \u00e4ndere den Bandnamen leicht ab.");
      return;
    }
    setBandNameSaving(true);
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
      if (typeof data?.id === "number") {
        setArtistPageId(data.id);
        artistPageIdRef.current = data.id;
      }
      if (typeof data?.handle === "string") setHandle(data.handle);
      setHandleStatus("available");
      setStep("phase");
    } catch {
      setHandleError("Netzwerkfehler. Bitte pr\u00fcfe deine Verbindung.");
    } finally {
      setBandNameSaving(false);
    }
  }

  // ── Step 3/4: Generate page ──────────────────────────────────────────

  async function generatePage(
    phase: PhaseType,
    rk: ReleaseKind,
    lk: LiveKind,
    pt: string,
    pl: string,
    url: string,
  ) {
    const pageId = artistPageIdRef.current ?? artistPageId;
    if (!pageId) {
      setGenerateError("Seite konnte nicht gefunden werden. Bitte lade die Seite neu.");
      return;
    }
    setGenerating(true);
    setGenerateError(null);

    const bio = `${displayName.trim()} verbindet rohe Energie mit klaren Hooks.
Entstanden aus der Szene, geprägt von Live-Momenten und neuen Ideen, entwickelt sich ihr Sound stetig weiter.`;
    const params = deriveSpotlightParams(phase, rk, lk, pt, pl);
    const trimmedUrl = url.trim();
    const primaryUrl = trimmedUrl.length > 0 ? trimmedUrl : null;

    // Pre-populate preview state so it's available immediately when step changes
    setPreviewBio(bio);
    setPreviewSpotlight({
      title: params.title,
      type: params.type,
      primary_url: primaryUrl,
      cta_label: params.ctaLabel,
    });

    try {
      await studioFetch(`/api/studio/artist-pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      await fetch("/api/studio/spotlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: params.title,
          type: params.type,
          primary_url: primaryUrl,
          cta_label: params.ctaLabel,
          show_on_page: true,
          activate: true,
        }),
      });

      await studioFetch(`/api/studio/artist-pages/${pageId}/publish`, { method: "POST" });
    } catch {
      setGenerateError("Fehler beim Erstellen der Seite. Bitte versuche es erneut.");
      setGenerating(false);
      return;
    }

    setGenerating(false);
    setStep("preview");
  }

  // ── Step 2: Phase selection ──────────────────────────────────────────

  function handlePhaseSelect(phase: PhaseType) {
    setPhaseType(phase);
    setStep("phase-context");
  }

  // ── Step 3: Phase context ────────────────────────────────────────────

  function handlePhaseContextContinue() {
    if (!phaseType) return;
    void generatePage(phaseType, releaseKind, liveKind, phaseTitle, phaseLabel, phaseUrl);
  }

  // ── Step 4: Finish ───────────────────────────────────────────────────

  function handleFinish() {
    setFinishing(true);
    router.push("/studio");
  }

  // ── Render ───────────────────────────────────────────────────────────

  if (step === "band-name") {
    return (
      <BandNameStep
        displayName={displayName}
        setDisplayName={setDisplayName}
        handle={handle}
        handleStatus={handleStatus}
        handleError={handleError}
        onDisplayNameChange={scheduleHandleGenerate}
        onSubmit={handleBandNameSubmit}
        saving={bandNameSaving}
      />
    );
  }

  if (step === "phase") {
    return (
      <PhaseStep
        onSelect={handlePhaseSelect}
        generating={generating}
        generateError={generateError}
        onBack={() => setStep("band-name")}
      />
    );
  }

  if (step === "phase-context") {
    return (
      <PhaseContextStep
        phaseType={phaseType!}
        releaseKind={releaseKind}
        setReleaseKind={setReleaseKind}
        liveKind={liveKind}
        setLiveKind={setLiveKind}
        phaseTitle={phaseTitle}
        setPhaseTitle={setPhaseTitle}
        phaseLabel={phaseLabel}
        setPhaseLabel={setPhaseLabel}
        phaseUrl={phaseUrl}
        setPhaseUrl={setPhaseUrl}
        onContinue={handlePhaseContextContinue}
        onBack={() => setStep("phase")}
        generating={generating}
        generateError={generateError}
      />
    );
  }

  return (
    <PreviewStep
      artistPageId={artistPageId}
      displayName={displayName}
      handle={handle}
      initialBio={previewBio}
      activeSpotlight={previewSpotlight}
      onFinish={handleFinish}
      onBack={() => setStep(phaseType === "release" || phaseType === "live" ? "phase-context" : "phase")}
      finishing={finishing}
      finishError={finishError}
    />
  );
}

