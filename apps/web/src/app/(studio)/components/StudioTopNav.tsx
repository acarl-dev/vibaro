"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, ExternalLink } from "./StudioIcons";
import { ArtistPageData } from "../layout";

type StudioTopNavProps = {
  page: ArtistPageData;
};

// All "Meine Seite" sub-routes live under /studio/page/ after redirects
const PAGE_SECTION_PREFIX = "/studio/page";

const NAV_ITEMS = [
  { label: "Dashboard",   href: "/studio",         exact: true  },
  { label: "Meine Seite", href: "/studio/page",    exact: false, isPageSection: true },
  { label: "Module",      href: "/studio/project", exact: false },
  { label: "Teilen",      href: "/studio/share",   exact: false },
  { label: "Ergebnisse",  href: "/studio/results", exact: false },
] as const;

export default function StudioTopNav({ page }: StudioTopNavProps) {
  const pathname = usePathname();

  const isPageSectionActive = pathname.startsWith(PAGE_SECTION_PREFIX);

  const isActive = (href: string, exact: boolean, isPageSection?: boolean) => {
    if (isPageSection) return isPageSectionActive;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-40 flex-shrink-0"
      style={{
        background: "var(--studio-surface)",
        borderBottom: "1px solid var(--studio-border)",
        height: "var(--studio-nav-height, 56px)",
      }}
    >
      <div
        className="mx-auto h-full flex items-center gap-2 px-4 sm:px-6"
        style={{ maxWidth: "1200px" }}
      >
        {/* Logo */}
        <Link
          href="/studio"
          className="font-black tracking-widest uppercase text-sm flex-shrink-0 transition-colors mr-6"
          style={{ color: "var(--studio-accent)" }}
        >
          VIBARO
        </Link>

        {/* Main Nav - desktop only */}
        <nav className="hidden md:flex items-stretch h-full flex-1 gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact, (item as { isPageSection?: boolean }).isPageSection);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 text-[11px] font-semibold tracking-widest uppercase transition-colors"
                style={{
                  color: active
                    ? "var(--studio-text-primary)"
                    : "var(--studio-text-secondary)",
                  borderBottom: active
                    ? "2px solid var(--studio-accent)"
                    : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Published status badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: page.is_published
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(136, 136, 160, 0.08)",
              color: page.is_published
                ? "var(--studio-success)"
                : "var(--studio-text-secondary)",
              border: page.is_published
                ? "1px solid rgba(34, 197, 94, 0.2)"
                : "1px solid var(--studio-border)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: page.is_published
                  ? "var(--studio-success)"
                  : "var(--studio-text-secondary)",
              }}
            />
            {page.is_published ? "Live" : "Entwurf"}
          </div>

          {/* Preview link */}
          <Link
            href={`/p/${page.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium transition-all"
            style={{
              color: "var(--studio-text-secondary)",
              border: "1px solid var(--studio-border)",
            }}
            title="Seite ansehen"
          >
            <ExternalLink size={13} />
            Vorschau
          </Link>

          {/* Settings */}
          <Link
            href="/studio/settings"
            className="p-2 rounded transition-colors"
            style={{
              color: pathname.startsWith("/studio/settings")
                ? "var(--studio-text-primary)"
                : "var(--studio-text-secondary)",
            }}
            title="Einstellungen"
          >
            <Settings size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
