import { ReleaseItem } from "./shared";
import { containerStyle, SECTION_PADDING_Y_LARGE, BORDER_DARK } from "./constants";

type FeaturedReleaseHeroProps = {
  release: ReleaseItem;
};

/**
 * FeaturedReleaseHero - Large featured release banner with cover & info
 * Used in DarkEditorialFullTemplate for prominent new release display
 */
export function FeaturedReleaseHero({ release }: FeaturedReleaseHeroProps) {
  return (
    <section className={`${SECTION_PADDING_Y_LARGE} border-b ${BORDER_DARK}`}>
      <div className="mx-auto" style={containerStyle("wide")}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-lg" />
                {/* Dot */}
                <div className="relative w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-emerald-400/90">
                New Release
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{release.title}</h2>
            {release.release_date && (
              <p className="text-zinc-400 text-lg mb-6">
                Released{" "}
                {new Date(release.release_date).toLocaleDateString("de", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {release.url && (
              <div className="flex gap-3">
                <a
                  href={release.url}
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
              src={
                release.cover_url ||
                "https://placehold.co/600x600/1a1a1a/666666?text=Album+Cover"
              }
              alt={release.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
