"use client";

import { useState, useEffect } from "react";
import {
  ContactInquiryButton,
  Footer,
  GalleryGrid,
  LinkList,
  PublicArtistPageData,
  ReleaseList,
  ShowList,
  VideoList,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import { FullHeroSection } from "./FullHeroSection";
import { StickyNavigationBar } from "./StickyNavigationBar";
import { FeaturedReleaseHero } from "./FeaturedReleaseHero";
import { ContentSection } from "./ContentSection";
import { SCROLL_THRESHOLD_NAV } from "./constants";

export default function DarkEditorialFullTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const [activeSection, setActiveSection] = useState("music");
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > SCROLL_THRESHOLD_NAV);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const featuredRelease = page.releases?.find((r) => r.is_featured) || page.releases?.[0];
  const musicLinks = page.links?.filter((link) =>
    ["spotify", "applemusic", "soundcloud", "bandcamp", "youtube"].includes(link.type || "")
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero Section */}
      <FullHeroSection
        displayName={page.display_name}
        heroImageUrl={page.images.hero_image_url}
        bio={page.bio}
        onScrollToSection={scrollToSection}
      />

      {/* Sticky Navigation */}
      <StickyNavigationBar
        displayName={page.display_name}
        sections={["music", "shows", "releases", "videos", "gallery", "about", "contact"]}
        activeSection={activeSection}
        isVisible={showNav}
        onSectionClick={scrollToSection}
      />

      {/* Featured Release */}
      {featuredRelease && <FeaturedReleaseHero release={featuredRelease} />}

      {/* Music Section */}
      <ContentSection id="music" title="Music">
        {page.featured_tracks && page.featured_tracks.length > 0 && (
          <div className="mb-12">
            <MusicPlayer tracks={page.featured_tracks} />
          </div>
        )}

        {musicLinks && musicLinks.length > 0 && <LinkList items={musicLinks} />}
      </ContentSection>

      {/* Shows Section */}
      {page.shows && page.shows.length > 0 && (
        <ContentSection id="shows" title="Upcoming Shows">
          <ShowList items={page.shows} />
        </ContentSection>
      )}

      {/* Releases Section */}
      {page.releases && page.releases.length > 0 && (
        <ContentSection id="releases" title="Discography" containerWidth="wide">
          <ReleaseList items={page.releases} />
        </ContentSection>
      )}

      {/* Videos Section */}
      {page.videos && page.videos.length > 0 && (
        <ContentSection id="videos" title="Videos" containerWidth="wide">
          <VideoList items={page.videos} />
        </ContentSection>
      )}

      {/* Gallery Section */}
      {page.gallery_images && page.gallery_images.length > 0 && (
        <ContentSection id="gallery" title="Gallery" containerWidth="wide">
          <GalleryGrid items={page.gallery_images} />
        </ContentSection>
      )}

      {/* About Section */}
      {(page.bio || page.images.avatar_url) && (
        <ContentSection id="about" title="About">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12">
            {page.bio && (
              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <div className="whitespace-pre-wrap">{page.bio}</div>
              </div>
            )}

            {page.images.avatar_url && (
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900">
                  <img
                    src={page.images.avatar_url}
                    alt="Press photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </ContentSection>
      )}

      {/* Contact Section */}
      <ContentSection id="contact" title="Contact" noBorder>
        <ContactInquiryButton
          booking_email={page.booking_email}
          management_email={page.management_email}
          press_email={page.press_email}
          whatsapp_number={page.whatsapp_number}
        />
      </ContentSection>

      {/* Footer */}
      <Footer displayName={page.display_name} />
    </div>
  );
}
