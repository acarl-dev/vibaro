// -----------------------------------------------------------------------------
// Barrel re-export — keeps all existing `from "./shared"` imports working
// Actual implementations live in dedicated modules (types, helpers, Hero, etc.)
// -----------------------------------------------------------------------------

// Types
export type {
  LinkItem,
  ShowItem,
  ReleaseItem,
  FeaturedTrackItem,
  VideoItem,
  GalleryImageItem,
  SpotlightItem,
  ContactItem,
  PublicArtistPageData,
} from "./types";

// Helpers
export {
  getSectionTitle,
  getFocusItems,
  getOptionalSections,
  setupFocus,
  getAvailableSections,
  getUpcomingShows,
  formatDate,
} from "./helpers";

// Components
export { Hero } from "./Hero";
export {
  SectionHeader,
  Section,
  FocusSection,
  OptionalSections,
  OptionalSectionRenderer,
  MusicSection,
  Footer,
} from "./SectionLayout";
export { LinkList } from "./LinkList";
export { ShowList } from "./ShowList";
export { ReleaseList } from "./ReleaseList";
export { VideoList } from "./VideoList";
export { GalleryGrid } from "./GalleryGrid";
export { ContactInquiryButton, ContactSection } from "./ContactInquiryButton";
export { FeaturedReleaseSection } from "./FeaturedReleaseSection";
