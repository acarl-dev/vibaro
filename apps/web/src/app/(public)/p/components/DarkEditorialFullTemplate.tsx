"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ContactInquiryButton,
  Footer,
  GalleryGrid,
  LinkList,
  PublicArtistPageData,
  ReleaseList,
  ShowList,
  VideoList,
  getUpcomingShows,
} from "./shared";
import MusicPlayer from "./MusicPlayer";
import { FullHeroSection } from "./FullHeroSection";
import { StickyNavigationBar } from "./StickyNavigationBar";
import { FeaturedReleaseHero } from "./FeaturedReleaseHero";
import { ContentSection } from "./ContentSection";
import { SCROLL_THRESHOLD_NAV } from "./constants";
import { useThrottledScroll } from "../hooks/useThrottledScroll";
import { useActiveSectionObserver } from "../hooks/useActiveSectionObserver";

export default function DarkEditorialFullTemplate({
  page,
}: {
  page: PublicArtistPageData;
}) {
  const [activeSection, setActiveSection] = useState("music");
  const [showNav, setShowNav] = useState(false);

  // Optimized scroll handler with throttling and passive listener
  const handleScroll = useCallback((scrollY: number) => {
    setShowNav(scrollY > SCROLL_THRESHOLD_NAV);
  }, []);

  useThrottledScroll(handleScroll, 100);

  // Define available sections based on page data
  const availableSections = useMemo(() => {
    const sections = ["music"];
    if (page.shows?.length > 0) sections.push("shows");
    if (page.releases?.length > 0) sections.push("releases");
    if (page.videos?.length > 0) sections.push("videos");
    if (page.gallery_images?.length > 0) sections.push("gallery");
    if (page.bio || page.images.avatar_url) sections.push("about");
    sections.push("contact");
    return sections;
  }, [page]);

  // Track active section with Intersection Observer
  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  useActiveSectionObserver(availableSections, handleSectionChange);

  // Scroll to section with smooth behavior
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.scrollIntoView({ behavior: "smooth" });
    // Manually update active section for immediate feedback
    setActiveSection(id);
  }, []);

  // Defensive null checks for public data - memoize to prevent re-filtering
  const featuredRelease = useMemo(
    () => page.releases?.find((r) => r?.is_featured) || page.releases?.[0],
    [page.releases]
  );

  const musicLinks = useMemo(
    () =>
      page.links?.filter(
        (link) =>
          link?.type &&
          ["spotify", "applemusic", "soundcloud", "bandcamp", "youtube"].includes(link.type)
      ) || [],
    [page.links]
  );

  return (
    <div className="min-h-screen bg-page text-primary">
      {/* Hero Section */}
      <FullHeroSection
        displayName={page.display_name || "Artist"}
        heroImageUrl={page.images?.hero_image_url}
        bio={page.bio}
        onScrollToSection={scrollToSection}
      />

      {/* Sticky Navigation */}
      <StickyNavigationBar
        displayName={page.display_name}
        sections={availableSections}
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

        {musicLinks.length > 0 && <LinkList items={musicLinks} />}
      </ContentSection>

      {/* Shows Section */}
      {page.shows && page.shows.length > 0 && (
        <ContentSection id="shows" title="Upcoming Shows">
          <ShowList items={getUpcomingShows(page.shows)} />
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
      {(page.bio || page.images?.avatar_url) && (
        <ContentSection id="about" title="About">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12">
            {page.bio && (
              <div className="space-y-6 text-secondary leading-relaxed">
                <div className="whitespace-pre-wrap">{page.bio}</div>
              </div>
            )}

            {page.images?.avatar_url && (
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-surface">
                  <img
                    src={page.images.avatar_url}
                    alt={`${page.display_name || "Artist"} press photo`}
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
          contact_message={page.contact_message}
        />
      </ContentSection>

      {/* Footer */}
      <Footer displayName={page.display_name || "Artist"} />
    </div>
  );
}
