"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { togglePublishAction } from "./actions";
import { updateVisibleSections, toggleShowOnPage, type Spotlight } from "@/lib/api/stage";
import { useToast } from "@/context/ToastContext";
import LivePreviewPanel from "./LivePreviewPanel";

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

const SECTIONS = [
  { key: "profile",  label: "Header",    href: "/studio/page/profile"   },
  { key: "links",    label: "Links",     href: "/studio/page/links"     },
  { key: "music",    label: "Musik",     href: "/studio/page/music"     },
  { key: "shows",    label: "Shows",     href: "/studio/page/shows"     },
  { key: "releases", label: "Releases",  href: "/studio/page/releases"  },
  { key: "videos",   label: "Videos",    href: "/studio/page/videos"    },
  { key: "gallery",  label: "Galerie",   href: "/studio/page/gallery"   },
  { key: "contact",  label: "Kontakt",   href: "/studio/page/contact"   },
];

export default function PageOverviewClient({ page, counts, activeSpotlight }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>(
    page.visible_sections ?? ["profile", "links", "music", "shows", "releases", "videos", "gallery", "contact"]
  );
  const [updatingSection, setUpdatingSection] = useState<string | null>(null);
  const [showingOnPage, setShowingOnPage] = useState(false);

  // Relative path so the iframe works in any environment (local, staging, prod)
  const previewPath = `/p/${page.handle}`;
  // Full URL for the external "Öffnen" link
  const externalUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://vibaro.app"}/p/${page.handle}`;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await togglePublishAction(page.id, page.is_published);
      if (result.success) {
        router.refresh();
      } else {
        showToast(result.error || "Fehler beim Veröffentlichen", "error");
      }
    } catch {
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
    } catch {
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
    } catch {
      showToast("Fehler beim Aktualisieren", "error");
    } finally {
      setShowingOnPage(false);
    }
  };

  const contentCount = (key: string): number | null => {
    const map: Record<string, number> = {
      links:    counts.links,
      music:    counts.featured_tracks,
      shows:    counts.shows,
      releases: counts.releases,
      videos:   counts.videos,
      gallery:  counts.gallery,
    };
    return map[key] ?? null;
  };

  return (
    // Negative margin to escape the py-8 from the layout so the preview uses full height
    <div
      className="flex gap-0 -mx-4 sm:-mx-6 -mt-8 -mb-8"
      style={{ minHeight: "calc(100vh - 56px - 40px)" }} // viewport minus nav + sub-nav
    >
      {/* ── Left panel: controls ── */}
      <div
        className="flex-shrink-0 w-64 flex flex-col overflow-y-auto"
        style={{
          borderRight: "1px solid var(--studio-border)",
          background: "var(--studio-bg)",
        }}
      >
        {/* Status + publish */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--studio-border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase"
              style={{
                color: page.is_published ? "var(--studio-success)" : "var(--studio-warning)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: page.is_published
                    ? "var(--studio-success)"
                    : "var(--studio-warning)",
                }}
              />
              {page.is_published ? "Live" : "Entwurf"}
            </span>
          </div>

          <p
            className="text-[11px] font-mono mb-3 truncate"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            /@{page.handle}
          </p>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            style={
              page.is_published
                ? {
                    background: "var(--studio-surface-elevated)",
                    color: "var(--studio-text-primary)",
                    border: "1px solid var(--studio-border)",
                  }
                : {
                    background: "var(--studio-accent)",
                    color: "#fff",
                  }
            }
          >
            {isPublishing
              ? "…"
              : page.is_published
              ? "Verstecken"
              : "Veröffentlichen"}
          </button>
        </div>

        {/* Spotlight hint */}
        {activeSpotlight &&
          activeSpotlight.status === "active" &&
          !activeSpotlight.show_on_page && (
            <div
              className="m-3 rounded p-3 text-xs"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              <p className="mb-2 leading-relaxed">
                Aktives Projekt <strong>„{activeSpotlight.title}"</strong> auf der Seite anzeigen?
              </p>
              <button
                onClick={handleShowOnPage}
                disabled={showingOnPage}
                className="text-[11px] font-semibold underline"
              >
                {showingOnPage ? "…" : "Ja, anzeigen"}
              </button>
            </div>
          )}

        {/* Section toggles */}
        <div className="flex-1 p-4">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            Bereiche
          </p>
          <div className="space-y-1">
            {SECTIONS.map((section) => {
              const isVisible = visibleSections.includes(section.key);
              const isUpdating = updatingSection === section.key;
              const count = contentCount(section.key);

              return (
                <div
                  key={section.key}
                  className="flex items-center gap-2 rounded px-2 py-1.5 group transition-colors"
                  style={{ background: "transparent" }}
                >
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggleSection(section.key, !isVisible)}
                    disabled={isUpdating}
                    className="flex-shrink-0 w-7 h-4 rounded-full transition-all relative disabled:opacity-40"
                    style={{
                      background: isVisible
                        ? "var(--studio-accent)"
                        : "var(--studio-surface-elevated)",
                      border: isVisible
                        ? "none"
                        : "1px solid var(--studio-border)",
                    }}
                    title={isVisible ? "Verstecken" : "Anzeigen"}
                  >
                    <span
                      className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                      style={{
                        background: "#fff",
                        left: isVisible ? "calc(100% - 14px)" : "2px",
                      }}
                    />
                  </button>

                  {/* Label + link */}
                  <Link
                    href={section.href}
                    className="flex-1 flex items-center justify-between text-xs transition-colors"
                    style={{
                      color: isVisible
                        ? "var(--studio-text-primary)"
                        : "var(--studio-text-secondary)",
                    }}
                  >
                    <span>{section.label}</span>
                    {count !== null && (
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--studio-text-secondary)" }}
                      >
                        {count > 0 ? count : "—"}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel: live preview ── */}
      <div className="flex-1 min-w-0" style={{ background: "var(--studio-bg)" }}>
        <LivePreviewPanel previewPath={previewPath} externalUrl={externalUrl} />
      </div>
    </div>
  );
}
