"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { togglePublishAction } from "./actions";
import { updateVisibleSections, toggleShowOnPage, type Spotlight } from "@/lib/api/stage";
import { useToast } from "@/context/ToastContext";
import StudioPageHeader from "../../components/StudioPageHeader";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  visible_sections?: string[];
};

type ContentCounts = {
  links: number;
  shows: number;
  releases: number;
  featured_tracks: number;
  videos: number;
  gallery: number;
};

type Props = {
  page: ArtistPage;
  counts: ContentCounts;
  activeSpotlight?: Spotlight | null;
};

export default function PageOverviewClient({ page, counts, activeSpotlight }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>(
    page.visible_sections ?? ["profile", "links", "music", "shows", "releases", "videos", "gallery", "contact"]
  );
  const [updatingSection, setUpdatingSection] = useState<string | null>(null);
  const [showingOnPage, setShowingOnPage] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://vibaro.app"}/p/${page.handle}`;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await togglePublishAction(page.id, page.is_published);

      if (result.success) {
        router.refresh();
      } else {
        showToast(result.error || "Fehler beim Veröffentlichen", "error");
      }
    } catch (error) {
      console.error("Publish error:", error);
      showToast("Fehler beim Veröffentlichen", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleSection = async (sectionKey: string, shouldShow: boolean) => {
    setUpdatingSection(sectionKey);
    try {
      const newSections = shouldShow
        ? [...visibleSections, sectionKey]
        : visibleSections.filter((s) => s !== sectionKey);

      await updateVisibleSections(page.id, newSections);
      setVisibleSections(newSections);
      router.refresh();
    } catch (error) {
      console.error("Toggle section error:", error);
      showToast("Fehler beim Aktualisieren der Sichtbarkeit", "error");
    } finally {
      setUpdatingSection(null);
    }
  };

  const handleShowOnPage = async () => {
    if (!activeSpotlight) return;
    
    setShowingOnPage(true);
    try {
      await toggleShowOnPage(activeSpotlight.id);
      router.refresh();
    } catch (error) {
      console.error("Show on page error:", error);
      showToast("Fehler beim Aktualisieren", "error");
    } finally {
      setShowingOnPage(false);
    }
  };

  const sections = [
    {
      key: "profile",
      title: "Profil",
      href: "/studio/page/profile",
      description: "Anzeigename, Bio, Avatar & Header-Bild",
      count: page.bio ? "✓" : "−",
      icon: "👤",
    },
    {
      key: "links",
      title: "Links",
      href: "/studio/page/links",
      description: "Social Media & externe Links",
      count: counts.links,
      icon: "🔗",
    },
    {
      key: "music",
      title: "Musik",
      href: "/studio/page/music",
      description: "Featured Tracks (Spotify, SoundCloud, YouTube)",
      count: counts.featured_tracks,
      icon: "🎵",
    },
    {
      key: "shows",
      title: "Konzerte",
      href: "/studio/page/shows",
      description: "Kommende Konzerte & Events",
      count: counts.shows,
      icon: "🎤",
    },
    {
      key: "releases",
      title: "Releases",
      href: "/studio/page/releases",
      description: "Diskografie & Veröffentlichungen",
      count: counts.releases,
      icon: "💿",
    },
    {
      key: "videos",
      title: "Videos",
      href: "/studio/page/videos",
      description: "YouTube & Vimeo Videos",
      count: counts.videos,
      icon: "🎬",
    },
    {
      key: "gallery",
      title: "Galerie",
      href: "/studio/page/gallery",
      description: "Fotos & Press Shots",
      count: counts.gallery,
      icon: "📸",
    },
    {
      key: "appearance",
      title: "Design",
      href: "/studio/page/appearance",
      description: "Design & Farben deiner Seite",
      count: "−",
      icon: "🎨",
    },
    {
      key: "contact",
      title: "Kontakt",
      href: "/studio/page/contact",
      description: "Booking, Management & Presse (privat)",
      count: "−",
      icon: "✉️",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <StudioPageHeader
        title="MEINE SEITE"
        subtitle="Verwalte den Content deiner öffentlichen Künstler-Seite"
        action={
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="studio-btn studio-btn-primary disabled:opacity-50"
          >
            {isPublishing
              ? "…"
              : page.is_published
                ? "Verstecken"
                : "Veröffentlichen"}
          </button>
        }
      />

      {/* Projekt-Hinweis-Banner */}
      {activeSpotlight && activeSpotlight.status === "active" && !activeSpotlight.show_on_page && (
        <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-5">
          <p className="mb-3 text-sm text-blue-300">
            💡 Du promotest gerade <strong>„{activeSpotlight.title}"</strong>.
            Soll es oben auf deiner Seite als Hero-Banner hervorgehoben werden?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleShowOnPage}
              disabled={showingOnPage}
              className="rounded-full bg-blue-400/20 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-400/30 disabled:opacity-50"
            >
              {showingOnPage ? "..." : "Ja, anzeigen ✨"}
            </button>
            <button
              className="text-sm text-zinc-500 hover:text-zinc-400"
              onClick={() => {
                // Später: "Nicht nochmal fragen" Option mit localStorage
              }}
            >
              Nein danke
            </button>
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className="mb-8 rounded-lg p-6" style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: "var(--studio-text-primary)" }}>
                {page.display_name}
              </h2>
              <span
                className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold uppercase"
                style={page.is_published
                  ? { background: "rgba(34,197,94,0.12)", color: "var(--studio-success)" }
                  : { background: "rgba(245,158,11,0.12)", color: "var(--studio-warning)" }
                }
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: page.is_published ? "var(--studio-success)" : "var(--studio-warning)" }} />
                {page.is_published ? "Veröffentlicht" : "Nicht veröffentlicht"}
              </span>
            </div>
            <p className="mb-4 text-sm" style={{ color: "var(--studio-text-secondary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>/@{page.handle}</p>

            <div className="flex gap-3">
              {page.is_published && (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: "var(--studio-accent)" }}
                >
                  <span>Seite ansehen</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {!page.is_published && (
          <div className="mt-4 rounded px-4 py-3 text-sm" style={{ border: "1px solid var(--studio-warning)", background: "rgba(245,158,11,0.08)", color: "var(--studio-warning)" }}>
            <strong>Hinweis:</strong> Deine Seite ist noch nicht öffentlich
            sichtbar. Vervollständige Profil, Links und Music, dann kannst du
            veröffentlichen.
          </div>
        )}
      </div>

      {/* Content Sections Grid */}
      <div className="space-y-3">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--studio-text-secondary)" }}>
          Bereiche
        </h3>

        {sections.map((section) => {
          const isVisible = visibleSections.includes(section.key);
          const isUpdating = updatingSection === section.key;

          return (
            <div
              key={section.key}
              className="flex items-center justify-between rounded-lg p-5 transition-colors"
              style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}
            >
              <Link
                href={section.href}
                className="group flex flex-1 items-start gap-4 transition-all hover:opacity-80"
              >
                <div className="text-2xl">{section.icon}</div>
                <div>
                    <h4 className="mb-1 font-medium" style={{ color: "var(--studio-text-primary)" }}>
                    {section.title}
                  </h4>
                  <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>{section.description}</p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <div className="min-w-[2rem] text-right text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>
                  {typeof section.count === "number" ? (
                    <span style={{ color: section.count > 0 ? "var(--studio-text-primary)" : "var(--studio-border)" }}>
                      {section.count}
                    </span>
                  ) : (
                    <span style={{ color: "var(--studio-text-secondary)" }}>{section.count}</span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleSection(section.key, !isVisible)}
                  disabled={isUpdating}
                  className="rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-50"
                  style={
                    isVisible
                      ? { background: "rgba(34,197,94,0.12)", color: "var(--studio-success)" }
                      : { background: "var(--studio-surface-elevated)", color: "var(--studio-text-secondary)", border: "1px solid var(--studio-border)" }
                  }
                >
                  {isUpdating ? "..." : isVisible ? "Sichtbar" : "Versteckt"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-lg p-5" style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}>
        <h4 className="mb-2 font-semibold" style={{ color: "var(--studio-text-primary)" }}>
          Tipp: Content-Strategie
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "var(--studio-text-secondary)" }}>
          Für eine starke Seite empfehlen wir: <strong style={{ color: "var(--studio-text-primary)" }}>Profil + Bio</strong> (wichtig),{" "}
          <strong style={{ color: "var(--studio-text-primary)" }}>3–5 Links</strong> (Instagram, Spotify, etc.),{" "}
          <strong style={{ color: "var(--studio-text-primary)" }}>3–5 Featured Tracks</strong>, und optional <strong style={{ color: "var(--studio-text-primary)" }}>kommende Shows</strong>{" "}
          sowie <strong style={{ color: "var(--studio-text-primary)" }}>neueste Releases</strong>. Weniger ist oft mehr.
        </p>
      </div>
    </div>
  );
}
