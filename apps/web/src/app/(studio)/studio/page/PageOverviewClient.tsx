"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { togglePublishAction } from "./actions";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
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
};

export default function PageOverviewClient({ page, counts }: Props) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://vibaro.app"}/p/${page.handle}`;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await togglePublishAction(page.id, page.is_published);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Fehler beim Veröffentlichen");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Fehler beim Veröffentlichen");
    } finally {
      setIsPublishing(false);
    }
  };

  const sections = [
    {
      title: "Profil",
      href: "/studio/page/profile",
      description: "Anzeigename, Bio, Avatar & Header-Bild",
      count: page.bio ? "✓" : "−",
      icon: "👤",
    },
    {
      title: "Links",
      href: "/studio/page/links",
      description: "Social Media & externe Links",
      count: counts.links,
      icon: "🔗",
    },
    {
      title: "Musik",
      href: "/studio/page/music",
      description: "Featured Tracks (Spotify, SoundCloud, YouTube)",
      count: counts.featured_tracks,
      icon: "🎵",
    },
    {
      title: "Konzerte",
      href: "/studio/page/shows",
      description: "Kommende Konzerte & Events",
      count: counts.shows,
      icon: "🎤",
    },
    {
      title: "Releases",
      href: "/studio/page/releases",
      description: "Diskografie & Veröffentlichungen",
      count: counts.releases,
      icon: "💿",
    },
    {
      title: "Videos",
      href: "/studio/page/videos",
      description: "YouTube & Vimeo Videos",
      count: counts.videos,
      icon: "🎬",
    },
    {
      title: "Galerie",
      href: "/studio/page/gallery",
      description: "Fotos & Press Shots",
      count: counts.gallery,
      icon: "📸",
    },
    {
      title: "Design",
      href: "/studio/page/appearance",
      description: "Design & Farben deiner Seite",
      count: "−",
      icon: "🎨",
    },
    {
      title: "Kontakt",
      href: "/studio/page/contact",
      description: "Booking, Management & Presse (privat)",
      count: "−",
      icon: "✉️",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-medium text-zinc-50">Meine Seite</h1>
        <p className="text-zinc-400">
          Verwalte den Content deiner öffentlichen Künstler-Seite
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-xl font-medium text-zinc-50">
                {page.display_name}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  page.is_published
                    ? "bg-green-500/10 text-green-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {page.is_published ? "Veröffentlicht" : "Nicht veröffentlicht"}
              </span>
            </div>
            <p className="mb-4 text-sm text-zinc-400">/@{page.handle}</p>

            <div className="flex gap-3">
              {page.is_published && (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  <span>Seite ansehen</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              page.is_published
                ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            } disabled:opacity-50`}
          >
            {isPublishing
              ? "..."
              : page.is_published
                ? "Verstecken"
                : "Veröffentlichen"}
          </button>
        </div>

        {!page.is_published && (
          <div className="mt-4 rounded border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            <strong>Hinweis:</strong> Deine Seite ist noch nicht öffentlich
            sichtbar. Vervollständige Profil, Links und Music, dann kannst du
            veröffentlichen.
          </div>
        )}
      </div>

      {/* Content Sections Grid */}
      <div className="space-y-3">
        <h3 className="mb-4 text-sm uppercase tracking-wider text-zinc-500">
          Bereiche
        </h3>

        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{section.icon}</div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-100 group-hover:text-zinc-50">
                  {section.title}
                </h4>
                <p className="text-sm text-zinc-500">{section.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="min-w-[2rem] text-right text-sm font-medium text-zinc-400">
                {typeof section.count === "number" ? (
                  <span
                    className={
                      section.count > 0 ? "text-zinc-300" : "text-zinc-600"
                    }
                  >
                    {section.count}
                  </span>
                ) : (
                  <span className="text-zinc-600">{section.count}</span>
                )}
              </div>
              <svg
                className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/10 p-5">
        <h4 className="mb-2 font-medium text-zinc-300">
          💡 Tipp: Content-Strategie
        </h4>
        <p className="text-sm leading-relaxed text-zinc-500">
          Für eine starke Seite empfehlen wir: <strong>Profil + Bio</strong> (wichtig),{" "}
          <strong>3-5 Links</strong> (Instagram, Spotify, etc.),{" "}
          <strong>3-5 Featured Tracks</strong>, und optional <strong>kommende Shows</strong>{" "}
          sowie <strong>neueste Releases</strong>. Weniger ist oft mehr.
        </p>
      </div>
    </div>
  );
}
