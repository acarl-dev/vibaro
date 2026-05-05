import { getPlatformById } from "@/lib/platforms";
import { type TrackingLinkData } from "@/lib/api/tracking-links";

type ShareDistributionLinksListProps = {
  totalLinks: number;
  groupedLinks: [string, TrackingLinkData[]][];
  onCopy: (url: string) => void;
};

export default function ShareDistributionLinksList({
  totalLinks,
  groupedLinks,
  onCopy,
}: ShareDistributionLinksListProps) {
  return (
    <div className="pt-8" style={{ borderTop: "1px solid var(--studio-border)" }}>
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--studio-text-secondary)" }}>Links dieser Phase ({totalLinks})</h2>
      <div className="space-y-6">
        {groupedLinks.map(([platform, links]) => {
          const platformInfo = getPlatformById(platform);
          const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);

          return (
            <div key={platform}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{platformInfo?.icon || "🔗"}</span>
                <h3 className="text-sm font-semibold" style={{ color: "var(--studio-text-primary)" }}>
                  {platformInfo?.label || platform}
                </h3>
                <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                  {links.length} {links.length === 1 ? "Link" : "Links"} · {totalClicks} Klicks
                </span>
              </div>
              <div className="grid gap-2">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded p-3 transition-colors"
                    style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface-elevated)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--studio-text-primary)" }}>{link.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--studio-text-secondary)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>{link.short_code}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>{link.click_count} Klicks</span>
                      <button
                        onClick={() => onCopy(link.tracking_url)}
                        className="rounded p-1.5 transition-colors"
                        style={{ color: "var(--studio-text-secondary)" }}
                        title="Link kopieren"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}