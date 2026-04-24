"use client";

import { useState, useEffect } from "react";
import { SpotlightItem } from "@/app/(public)/p/components/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhaseType =
  | "single"
  | "album"
  | "video"
  | "tour"
  | "event"
  | "merch"
  | "livestream"
  | "collab"
  | "studio"
  | "focus";

type PhaseConfig = {
  badge: string;
  cta: string;
  /** Radial glow color injected behind content (RGB triplet for rgba()) */
  glowRgb: string;
  /** The mode controls layout & sizing decisions */
  mode: "single" | "album" | "video" | "tour" | "event" | "merch" | "livestream" | "collab" | "studio" | "focus";
};

// ---------------------------------------------------------------------------
// Per-type config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<PhaseType, PhaseConfig> = {
  single:     { badge: "NEW SINGLE",    cta: "Jetzt hören",     glowRgb: "120, 100, 220", mode: "single"     },
  album:      { badge: "NEW ALBUM",     cta: "Album streamen",  glowRgb: "180, 80, 220",  mode: "album"      },
  video:      { badge: "NEW VIDEO",     cta: "Jetzt ansehen",   glowRgb: "30, 30, 30",    mode: "video"      },
  tour:       { badge: "TOUR",          cta: "Alle Termine",    glowRgb: "220, 120, 40",  mode: "tour"       },
  event:      { badge: "LIVE",          cta: "Tickets sichern", glowRgb: "220, 60, 60",   mode: "event"      },
  merch:      { badge: "LIMITED DROP",  cta: "Jetzt sichern",   glowRgb: "180, 160, 60",  mode: "merch"      },
  livestream: { badge: "LIVE STREAM",   cta: "Jetzt beitreten", glowRgb: "220, 38, 38",   mode: "livestream" },
  collab:     { badge: "COLLABORATION", cta: "Jetzt entdecken", glowRgb: "60, 160, 200",  mode: "collab"     },
  studio:     { badge: "IM STUDIO",     cta: "Mehr erfahren",   glowRgb: "80, 80, 100",   mode: "studio"     },
  focus:      { badge: "AKTUELL",       cta: "Mehr erfahren",   glowRgb: "100, 100, 120",  mode: "focus"      },
};

const DEFAULT_CONFIG: PhaseConfig = {
  badge: "AKTUELL",
  cta: "Mehr erfahren",
  glowRgb: "120, 120, 120",
  mode: "single",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVerticalPadding(mode: PhaseConfig["mode"]): string {
  switch (mode) {
    case "album":      return "py-24 sm:py-32 md:py-40";
    case "video":      return "py-20 sm:py-28 md:py-36";
    case "tour":
    case "event":
    case "livestream": return "py-20 sm:py-28 md:py-32";
    default:           return "py-16 sm:py-24 md:py-28";
  }
}

function getTitleSize(mode: PhaseConfig["mode"]): string {
  switch (mode) {
    case "album": return "clamp(2rem, 6vw, 3.5rem)";
    case "event":
    case "tour":  return "clamp(1.75rem, 5vw, 3rem)";
    default:      return "clamp(1.5rem, 4.5vw, 2.5rem)";
  }
}

// ---------------------------------------------------------------------------
// LiveCountdown
// ---------------------------------------------------------------------------

function LiveCountdown({ until }: { until: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(until).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("LIVE JETZT"); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [until]);

  return (
    <div className="font-mono font-bold tracking-[0.08em] mt-4" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "rgb(220, 38, 38)" }}>
      {timeLeft}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TourDates — mini upcoming dates list
// ---------------------------------------------------------------------------

function TourDates({ cities }: { cities: { name: string; date: string }[] }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      {cities.map((c, i) => (
        <div key={i} className="flex items-center gap-4 text-sm" style={{ color: "rgba(var(--text-primary), 0.45)" }}>
          <span style={{ fontSize: "11px", letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums", color: "rgba(var(--text-primary), 0.25)" }}>
            {c.date}
          </span>
          <span style={{ width: "1px", height: "10px", background: "rgba(var(--text-primary), 0.15)" }} />
          <span style={{ letterSpacing: "0.02em" }}>{c.name}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type PhaseHeroProps = {
  spotlight: SpotlightItem;
};

export default function PhaseHero({ spotlight }: PhaseHeroProps) {
  const phaseType = (spotlight.type as PhaseType) ?? "single";
  const config = TYPE_CONFIG[phaseType] ?? DEFAULT_CONFIG;
  const meta = spotlight.meta ?? {};

  const { mode, badge, glowRgb } = config;
  const ctaLabel = spotlight.cta_label || config.cta;
  const isLive = mode === "livestream";
  const isVideo = mode === "video";
  const isAlbum = mode === "album";

  // Background: explicit bg overrides > blurred cover > solid dark
  const bgImage = spotlight.background_image_url || spotlight.cover_image_url;
  const useCoverBlur = !spotlight.background_image_url && !!spotlight.cover_image_url;

  return (
    <section className="relative w-full overflow-hidden" aria-label={`Phase: ${spotlight.title}`}>

      {/* ══════════════════════
          LAYER 1 · Background
      ══════════════════════ */}
      <div className="absolute inset-0">
        {bgImage ? (
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: useCoverBlur
                ? "blur(60px) saturate(0.25) brightness(0.35)"
                : isVideo
                ? "saturate(0.15) brightness(0.2)"
                : "saturate(0.35) brightness(0.25)",
              transform: useCoverBlur ? "scale(1.2)" : undefined,
            }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "rgb(8, 8, 10)" }} />
        )}
        {/* Hard dark wash so background never competes */}
        <div className="absolute inset-0" style={{ background: isVideo ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.72)" }} />
      </div>

      {/* ══════════════════════════════════
          LAYER 2 · Atmosphere (depth)
          Radial "light source" from behind content
      ══════════════════════════════════ */}

      {/* Central radial bloom — type-colored, gives warmth/depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 65% 55% at 50% 65%, rgba(${glowRgb}, 0.09) 0%, transparent 70%)` }}
      />

      {/* Top-to-bottom vignette — directs eye to content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 72%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Accent hairline top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: isLive ? "rgba(220,38,38,0.7)" : "rgba(var(--accent), 0.5)" }}
      />
      {/* Accent bloom from hairline */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-48 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, rgba(${isLive ? "220,38,38" : glowRgb}, 0.08) 0%, transparent 65%)` }}
      />

      {/* Video-only: edge vignette for cinematic crop */}
      {isVideo && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)" }}
        />
      )}

      {/* ══════════════════════
          LAYER 3 · Content
          No box. Just content breathing on the stage.
      ══════════════════════ */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 ${getVerticalPadding(mode)}`}
        style={{ maxWidth: isVideo ? "960px" : "680px", margin: "0 auto" }}
      >

        {/* ── Badge ── */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="relative flex items-center justify-center">
            <span
              className="absolute w-5 h-5 rounded-full animate-ping"
              style={{
                background: isLive ? "rgba(220,38,38,0.3)" : `rgba(${glowRgb}, 0.25)`,
                animationDuration: isLive ? "1.2s" : "2.5s",
              }}
            />
            <span className="relative w-2 h-2 rounded-full" style={{ background: isLive ? "rgb(220,38,38)" : "rgb(var(--accent))" }} />
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.28em] uppercase"
            style={{ color: isLive ? "rgb(220,38,38)" : "rgb(var(--accent))" }}
          >
            {badge}
          </span>
        </div>

        {/* ── VIDEO: massive play icon (the primary CTA, no button) ── */}
        {isVideo && (
          <a
            href={spotlight.primary_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center mb-8 transition-transform duration-300 hover:scale-105"
            aria-label={`Video ansehen: ${spotlight.title}`}
          >
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full transition-all duration-300 group-hover:border-white/40"
              style={{ border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.03)" }}
            >
              <svg className="ml-2" style={{ width: "38px", height: "38px", opacity: 0.8 }} viewBox="0 0 24 24" fill="white">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
          </a>
        )}

        {/* ── ALBUM / SINGLE / MERCH: cover art — no box, just shadow ── */}
        {(isAlbum || mode === "single" || mode === "merch") && spotlight.cover_image_url && (
          <div className="mb-10">
            <div
              className="relative overflow-hidden mx-auto"
              style={{
                width: isAlbum ? "clamp(220px, 35vw, 300px)" : "clamp(160px, 28vw, 220px)",
                aspectRatio: mode === "merch" ? "auto" : "1 / 1",
                borderRadius: "6px",
                boxShadow: isAlbum
                  ? "0 40px 80px rgba(0,0,0,0.85), 0 20px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)"
                  : "0 20px 50px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <img src={spotlight.cover_image_url} alt={spotlight.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)" }} />
            </div>
          </div>
        )}

        {/* ── Title ── */}
        <h2
          className="font-bold max-w-2xl"
          style={{
            fontSize: getTitleSize(mode),
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "rgb(var(--text-primary))",
          }}
        >
          {spotlight.title}
        </h2>

        {/* ── Subtitle ── */}
        {spotlight.subtitle && (
          <p
            className="mt-4 max-w-xl"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "rgba(var(--text-primary), 0.45)", lineHeight: 1.6 }}
          >
            {spotlight.subtitle}
          </p>
        )}

        {/* ── Type-specific meta ── */}
        <PhaseMetaInfo type={phaseType} meta={meta} />

        {/* ── Primary CTA — Video skips this (hero = CTA) ── */}
        {!isVideo && (
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={spotlight.primary_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0"
              style={{
                padding: mode === "event" ? "14px 40px" : "12px 32px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: isLive ? "rgb(220,38,38)" : "rgb(var(--accent))",
                color: isLive ? "#fff" : "rgb(var(--accent-contrast))",
                boxShadow: isLive
                  ? "0 8px 30px rgba(220,38,38,0.3)"
                  : `0 8px 30px rgba(${glowRgb}, 0.25)`,
              }}
            >
              {ctaLabel}
            </a>
            {spotlight.secondary_cta_url && spotlight.secondary_cta_label && (
              <a
                href={spotlight.secondary_cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-all duration-200 hover:opacity-70"
                style={{
                  padding: "10px 24px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  border: "1px solid rgba(var(--text-primary), 0.1)",
                  color: "rgba(var(--text-primary), 0.5)",
                }}
              >
                {spotlight.secondary_cta_label}
              </a>
            )}
          </div>
        )}

        {/* Video: subtle text-link CTA below icon */}
        {isVideo && (
          <a
            href={spotlight.primary_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-xs font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
            style={{ color: "rgba(var(--text-primary), 0.35)" }}
          >
            {ctaLabel} ↗
          </a>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PhaseMetaInfo
// ---------------------------------------------------------------------------

function PhaseMetaInfo({ type, meta }: { type: PhaseType; meta: Record<string, unknown> }): React.ReactNode {
  const dim: React.CSSProperties = {
    fontSize: "11px",
    letterSpacing: "0.1em",
    color: "rgba(var(--text-primary), 0.32)",
    fontVariantNumeric: "tabular-nums",
    textTransform: "uppercase",
  };

  switch (type) {
    case "album": {
      const trackCount = meta.track_count as number | undefined;
      const releaseDate = meta.release_date_display as string | undefined;
      if (!trackCount && !releaseDate) return null;
      return (
        <div className="mt-4 flex items-center gap-3" style={dim}>
          {trackCount && <span>{trackCount} Tracks</span>}
          {trackCount && releaseDate && <span style={{ opacity: 0.4 }}>·</span>}
          {releaseDate && <span>{releaseDate}</span>}
        </div>
      );
    }

    case "single": {
      const releaseDate = meta.release_date_display as string | undefined;
      if (!releaseDate) return null;
      return <div className="mt-4" style={dim}>{releaseDate}</div>;
    }

    case "video": {
      const duration = meta.duration;
      if (typeof duration !== "string") return null;
      return <div className="mt-4" style={dim}>{duration}</div>;
    }

    case "tour": {
      const cityCount = meta.city_count as number | undefined;
      const countryCount = meta.country_count as number | undefined;
      const citiesRaw = meta.upcoming_cities as { name: string; date: string }[] | undefined;
      return (
        <>
          {(cityCount || countryCount) && (
            <div className="mt-4 flex items-center gap-2" style={dim}>
              {cityCount && <span>{cityCount} Städte</span>}
              {cityCount && countryCount && <span style={{ opacity: 0.4 }}>·</span>}
              {countryCount && <span>{countryCount} Länder</span>}
            </div>
          )}
          {citiesRaw && citiesRaw.length > 0 && (
            <TourDates cities={citiesRaw.slice(0, 3)} />
          )}
        </>
      );
    }

    case "event": {
      const venue = meta.venue as string | undefined;
      const city = meta.city as string | undefined;
      const eventDate = meta.event_date as string | undefined;
      if (!venue && !city && !eventDate) return null;
      return (
        <div className="mt-5 flex flex-col items-center gap-1.5">
          {eventDate && (
            <span className="font-semibold" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)", color: "rgba(var(--text-primary), 0.8)", letterSpacing: "0.03em" }}>
              {eventDate}
            </span>
          )}
          {venue && (
            <span style={{ fontSize: "13px", color: "rgba(var(--text-primary), 0.4)" }}>
              {venue}{city && <> · {city}</>}
            </span>
          )}
        </div>
      );
    }

    case "merch": {
      const isLimited = meta.is_limited as boolean | undefined;
      if (!isLimited) return null;
      return (
        <div className="mt-4 flex items-center gap-2" style={dim}>
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "rgb(var(--accent))" }} />
          <span>Limitiert</span>
        </div>
      );
    }

    case "livestream": {
      const countdownUntil = meta.countdown_until as string | undefined;
      if (!countdownUntil) return null;
      return <LiveCountdown until={countdownUntil} />;
    }

    case "collab": {
      const partnerName = meta.partner_name as string | undefined;
      if (!partnerName) return null;
      return (
        <div className="mt-4" style={{ fontSize: "14px", color: "rgba(var(--text-primary), 0.45)", fontStyle: "italic" }}>
          with {partnerName}
        </div>
      );
    }

    default:
      return null;
  }
}
