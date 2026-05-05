import type { ReleaseItem } from "./types";
import { containerStyle, PADDING_SECTION_FULL } from "./constants";
import { safeHref } from "@/lib/safe-href";

/**
 * Inline section header to avoid circular dependency with SectionLayout
 */
function FeaturedSectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest mb-6">
      {title}
    </h2>
  );
}

// -----------------------------------------------------------------------------
// FeaturedReleaseSection Component
// -----------------------------------------------------------------------------

export function FeaturedReleaseSection({ release }: { release: ReleaseItem }) {
  const releaseHref = safeHref(release.url);

  return (
    <section className="mx-auto" style={{ maxWidth: containerStyle().maxWidth, padding: PADDING_SECTION_FULL }}>
      <FeaturedSectionHeader title="New Release" />
      
      <a
        href={releaseHref ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Cover Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {release.cover_url ? (
              <img
                src={release.cover_url}
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-6xl text-zinc-700">♪</span>
              </div>
            )}
          </div>
          
          {/* Release Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
              {release.title}
            </h3>
            {release.release_date && (
              <p className="text-sm text-zinc-500 mb-6">{release.release_date}</p>
            )}
            {releaseHref && (
              <span className="inline-block px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg transition-colors group-hover:bg-zinc-100">
                Jetzt anhören
              </span>
            )}
          </div>
        </div>
      </a>
    </section>
  );
}
