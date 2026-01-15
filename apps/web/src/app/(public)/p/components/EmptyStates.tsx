/**
 * EmptyState Component
 * Displays a minimal, calm placeholder when sections have no content
 * Follows Vibaro design principle: no aggressive calls-to-action on public pages
 */

type EmptyStateProps = {
  message?: string;
  icon?: React.ReactNode;
};

/**
 * Generic empty state for missing content sections
 */
export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      {icon && <div className="mb-3 text-muted opacity-40">{icon}</div>}
      <p className="text-sm text-muted">{message || "—"}</p>
    </div>
  );
}

/**
 * Empty state for missing music/tracks
 */
export function EmptyMusicState() {
  return (
    <EmptyState
      message="No tracks available yet"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      }
    />
  );
}

/**
 * Empty state for missing shows/events
 */
export function EmptyShowsState() {
  return (
    <EmptyState
      message="No shows scheduled"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
      }
    />
  );
}

/**
 * Empty state for missing releases
 */
export function EmptyReleasesState() {
  return (
    <EmptyState
      message="No releases yet"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      }
    />
  );
}

/**
 * Empty state for missing videos
 */
export function EmptyVideosState() {
  return (
    <EmptyState
      message="No videos available"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      }
    />
  );
}

/**
 * Empty state for missing gallery images
 */
export function EmptyGalleryState() {
  return (
    <EmptyState
      message="No images in gallery"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      }
    />
  );
}

/**
 * Empty state for missing links
 */
export function EmptyLinksState() {
  return (
    <EmptyState
      message="No links available"
      icon={
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        </svg>
      }
    />
  );
}
