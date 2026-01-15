"use client";

import { useState, useEffect } from "react";
import { PublicArtistPageData } from "./shared";

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
            <div className="space-y-4 mb-12">
              {page.featured_tracks.map((track, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-100 truncate">{track.title}</p>
                      <p className="text-sm text-zinc-500">{track.artist_name || page.display_name}</p>
                    </div>
                    <a
                      href={track.platform_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Play on {track.platform}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Streaming Platforms */}
          {page.links && page.links.length > 0 && (() => {
            const musicLinks = page.links.filter((link) => 
              ["spotify", "applemusic", "soundcloud", "bandcamp", "youtube"].includes(link.type || "")
            );
            return musicLinks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {musicLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                  </a>
                ))}
              </div>
            ) : null;
          })()}
        </div>
      </section>

      {/* Shows Section */}
      <section id="shows" className="py-20 border-b border-zinc-900">
        <div className="mx-auto" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>

          {page.shows && page.shows.length > 0 ? (
            <div className="space-y-4">
              {page.shows.map((show) => (
                <div
                  key={show.date + show.venue}
                  className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center p-6 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="text-center min-w-[80px]">
                    <div className="text-3xl font-bold">{new Date(show.date).getDate()}</div>
                    <div className="text-sm text-zinc-500 uppercase">
                      {new Date(show.date).toLocaleDateString("de", { month: "short" })}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{show.venue}</p>
                    <p className="text-zinc-400">{show.city}</p>
                    {show.support_acts && (
                      <p className="text-sm text-zinc-500 mt-1">Support: {show.support_acts}</p>
                    )}
                  </div>
                  {show.ticket_url && (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap"
                    >
                      Tickets
                    </a>
                  )}
                </div>
              ))}
            </div>
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
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {page.releases.map((release, idx) => (
                <a
                  key={idx}
                  href={release.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-3">
                    <img
                      src={release.cover_url || "https://placehold.co/400x400/1a1a1a/666666?text=Album"}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {release.title}
                  </h3>
                  {release.release_date && (
                    <p className="text-sm text-zinc-500">
                      {new Date(release.release_date).toLocaleDateString("de", { year: "numeric", month: "long" })}
                    </p>
                  )}
                </a>
              ))}
            </div>
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

            <div className="grid md:grid-cols-2 gap-6">
              {page.videos.map((video, idx) => (
                <a
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-3">
                    <img
                      src={video.thumbnail_url || `https://placehold.co/640x360/1a1a1a/666666?text=${encodeURIComponent(video.title)}`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-950 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-zinc-500 line-clamp-2">{video.description}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {page.gallery_images && page.gallery_images.length > 0 && (
        <section id="gallery" className="py-20 border-b border-zinc-900">
          <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 clamp(16px, 4vw, 48px)" }}>
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {page.gallery_images.map((image, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-zinc-900 cursor-pointer group">
                  <img
                    src={image.image_url}
                    alt={image.title || `Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
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
          <div className="grid md:grid-cols-2 gap-12">
            {/* Newsletter */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-zinc-400 mb-6">
                Erhalte News zu neuen Releases, Tour-Dates und exklusiven Content direkt in dein Postfach.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Abonnieren
                </button>
              </form>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Contact</h2>
              <div className="space-y-4 text-zinc-300">
                {page.booking_email && (
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Booking</p>
                    <a href={`mailto:${page.booking_email}`} className="hover:text-white transition-colors">
                      {page.booking_email}
                    </a>
                  </div>
                )}
                {page.management_email && (
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Management</p>
                    <a href={`mailto:${page.management_email}`} className="hover:text-white transition-colors">
                      {page.management_email}
                    </a>
                  </div>
                )}
                {page.press_email && (
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Press</p>
                    <a href={`mailto:${page.press_email}`} className="hover:text-white transition-colors">
                      {page.press_email}
                    </a>
                  </div>
                )}
                {page.whatsapp_number && (
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-1">WhatsApp</p>
                    <a href={`https://wa.me/${page.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {page.whatsapp_number}
                    </a>
                  </div>
                )}

                {/* Social Links */}
                <div className="pt-4">
                  <p className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Social Media</p>
                  <div className="flex gap-4">
                    {page.links &&
                      page.links.slice(0, 4).map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
                        >
                          <span className="text-xs">🔗</span>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900">
        <div className="mx-auto text-center" style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} {page.display_name}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700 mt-2">
            Powered by{" "}
            <a href="https://vibaro.com" className="hover:text-zinc-500 transition-colors">
              Vibaro
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
