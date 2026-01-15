"use client";

import { useState, useEffect } from "react";
import {
  ContactSection,
  Footer,
  GalleryGrid,
  LinkList,
  PublicArtistPageData,
  ReleaseList,
  ShowList,
  VideoList,
} from "./shared";
import MusicPlayer from "./MusicPlayer";

export default function DarkEditorialFullTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const [activeSection, setActiveSection] = useState("music");
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero Section - Full width, auto height */}
      <section className="relative w-full">
        {/* Hero Image */}
        <img
          src={page.images.hero_image_url || "https://placehold.co/1920x1080/1a1a1a/666666?text=Hero+Image"}
          alt={page.display_name}
          className="block w-full h-auto"
        />

        {/* Dark gradient overlay - bottom 50% */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)",
          }}
        />

        {/* Text overlay - lower third */}
        <div
          className="absolute z-10 bottom-0 left-0 right-0"
          style={{
            paddingBottom: "clamp(4rem, 12vh, 6rem)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
              {page.display_name}
            </h1>

            {page.bio && (
              <p className="mt-3 text-zinc-200 text-base md:text-lg leading-relaxed" style={{ maxWidth: "60ch" }}>
                {page.bio}
              </p>
            )}

            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => scrollToSection("shows")}
                className="px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Tour Dates
              </button>
              <button
                onClick={() => scrollToSection("music")}
                className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Listen Now
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav
        className={`sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <div className="flex items-center justify-between h-16">
            <span className="font-semibold text-lg">{page.display_name}</span>
            <div className="flex gap-6 text-sm">
              {["music", "shows", "releases", "videos", "gallery", "about", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`hover:text-white transition-colors capitalize ${
                    activeSection === section ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Featured Content */}
      {page.releases && page.releases.length > 0 && (() => {
        const featuredRelease = page.releases.find((r) => r.is_featured) || page.releases[0];
        return (
          <section className="py-20 border-b border-zinc-900">
            <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">New Release</span>
                  <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">{featuredRelease.title}</h2>
                  {featuredRelease.release_date && (
                    <p className="text-zinc-400 text-lg mb-6">
                      Released {new Date(featuredRelease.release_date).toLocaleDateString("de", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                  {featuredRelease.url && (
                    <div className="flex gap-3">
                      <a
                        href={featuredRelease.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        Jetzt streamen
                      </a>
                    </div>
                  )}
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src={featuredRelease.cover_url || "https://placehold.co/600x600/1a1a1a/666666?text=Album+Cover"}
                    alt={featuredRelease.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Music Section */}
      <section id="music" className="py-20 border-b border-zinc-900">
        <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">Music</h2>

          {/* Featured Tracks */}
          {page.featured_tracks && page.featured_tracks.length > 0 && (
            <div className="mb-12">
              <MusicPlayer tracks={page.featured_tracks} />
            </div>
          )}

          {/* Streaming Platforms */}
          {page.links && page.links.length > 0 && (() => {
            const musicLinks = page.links.filter((link) =>
              ["spotify", "applemusic", "soundcloud", "bandcamp", "youtube"].includes(link.type || "")
            );
            return musicLinks.length > 0 ? <LinkList items={musicLinks} /> : null;
          })()}
        </div>
      </section>

      {/* Shows Section */}
      <section id="shows" className="py-20 border-b border-zinc-900">
        <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>

          {page.shows && page.shows.length > 0 ? (
            <ShowList items={page.shows} />
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>Keine anstehenden Shows</p>
            </div>
          )}
        </div>
      </section>



      {/* Releases Section - Discography */}
      <section id="releases" className="py-20 border-b border-zinc-900">
        <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">Discography</h2>

          {page.releases && page.releases.length > 0 ? (
            <ReleaseList items={page.releases} />
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>Keine Releases vorhanden</p>
            </div>
          )}
        </div>
      </section>

      {/* Videos Section */}
      {page.videos && page.videos.length > 0 && (
        <section id="videos" className="py-20 border-b border-zinc-900">
          <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
            <h2 className="text-3xl font-bold mb-8">Videos</h2>

            <VideoList items={page.videos} />
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {page.gallery_images && page.gallery_images.length > 0 && (
        <section id="gallery" className="py-20 border-b border-zinc-900">
          <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>

            <GalleryGrid items={page.gallery_images} />
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-20 border-b border-zinc-900">
        <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">About</h2>

          <div className="grid md:grid-cols-[2fr_1fr] gap-12">
            <div className="space-y-6 text-zinc-300 leading-relaxed">
              {page.bio ? (
                <div className="whitespace-pre-wrap">{page.bio}</div>
              ) : (
                <p className="text-zinc-500">Keine Bio vorhanden</p>
              )}
            </div>

            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900">
                <img
                  src={page.images.avatar_url || "https://placehold.co/400x400/1a1a1a/666666?text=Press+Photo"}
                  alt="Press photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Newsletter Section */}
      <section id="contact" className="py-20">
        <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">Contact</h2>

          <ContactSection
            booking_email={page.booking_email}
            management_email={page.management_email}
            press_email={page.press_email}
            whatsapp_number={page.whatsapp_number}
          />
        </div>
      </section>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
