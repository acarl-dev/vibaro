"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FilePen,
  Megaphone,
  TrendingUp,
  Settings,
  ExternalLink,
} from "./StudioIcons";
import { ArtistPageData } from "../layout";

type StudioSidebarProps = {
  page: ArtistPageData;
};

const NAV_ITEMS = [
  { label: "DASHBOARD",   sublabel: "Übersicht",        href: "/studio",          icon: LayoutGrid, exact: true  },
  { label: "MEINE SEITE", sublabel: "Seite bearbeiten", href: "/studio/page",     icon: FilePen,    exact: false },
  { label: "PHASE",       sublabel: "Kampagne & Links", href: "/studio/share",    icon: Megaphone,  exact: false },
  { label: "ANALYSE",     sublabel: "Stats & Auswertung", href: "/studio/results", icon: TrendingUp, exact: false },
] as const;

const PAGE_SUB_NAV = [
  { label: "Übersicht", href: "/studio/page" },
  { label: "Themes",    href: "/studio/appearance" },
  { label: "Profil",    href: "/studio/profile" },
  { label: "Links",     href: "/studio/links" },
  { label: "Music",     href: "/studio/music" },
  { label: "Shows",     href: "/studio/shows" },
  { label: "Releases",  href: "/studio/releases" },
  { label: "Videos",    href: "/studio/videos" },
  { label: "Gallery",   href: "/studio/gallery" },
  { label: "Kontakt",   href: "/studio/contact" },
] as const;

const PAGE_SUB_HREFS = PAGE_SUB_NAV.map((s) => s.href);

export default function StudioSidebar({ page }: StudioSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isPageSectionActive =
    pathname.startsWith("/studio/page") ||
    PAGE_SUB_HREFS.some((h) => h !== "/studio/page" && pathname.startsWith(h));

  return (
    <aside className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-[width] duration-200 w-16 lg:w-56 bg-[var(--studio-surface)] border-r border-[var(--studio-border)]">
      <div className="flex-shrink-0 h-16 flex items-center justify-center lg:justify-start px-4 lg:px-5">
        <Link
          href="/studio"
          className="font-black tracking-widest uppercase transition-colors text-[var(--studio-accent)] hover:text-[var(--studio-accent-hover)]"
        >
          <span className="hidden lg:block text-sm">VIBARO</span>
          <span className="lg:hidden text-base">V</span>
        </Link>
      </div>

      <div className="flex-shrink-0 h-px bg-[var(--studio-border)]" />

      <nav className="flex-1 py-3 flex flex-col overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/studio/page"
              ? isPageSectionActive
              : isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                title={item.label}
                className={[
                  "relative flex items-center lg:justify-start justify-center gap-3 mx-2 px-3 py-3 rounded-sm transition-all duration-150 border-l-[3px]",
                  active
                    ? "bg-[var(--studio-surface-elevated)] border-[var(--studio-accent)] text-[var(--studio-text-primary)]"
                    : "border-transparent text-[var(--studio-text-secondary)] hover:bg-[var(--studio-surface-elevated)] hover:text-[var(--studio-text-primary)]",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  className={["flex-shrink-0", active ? "text-[var(--studio-accent)]" : ""].join(" ")}
                />
                <div className="hidden lg:block overflow-hidden">
                  <p className="text-xs font-bold tracking-wider leading-tight">{item.label}</p>
                  <p className="text-[11px] leading-tight mt-0.5 text-[var(--studio-text-secondary)]">{item.sublabel}</p>
                </div>
              </Link>

              {item.href === "/studio/page" && isPageSectionActive && (
                <div className="hidden lg:flex flex-col ml-8 mb-1 border-l border-[var(--studio-border)] pl-3">
                  {PAGE_SUB_NAV.map((sub) => {
                    const subActive =
                      pathname === sub.href ||
                      (sub.href !== "/studio/page" && pathname.startsWith(sub.href));
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={[
                          "px-2 py-1.5 text-xs rounded-sm transition-colors duration-150",
                          subActive
                            ? "text-[var(--studio-text-primary)] font-medium"
                            : "text-[var(--studio-text-secondary)] hover:text-[var(--studio-text-primary)]",
                        ].join(" ")}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex-shrink-0 h-px bg-[var(--studio-border)]" />

      <div className="flex-shrink-0 py-3">
        <Link
          href="/studio/settings"
          title="Einstellungen"
          className={[
            "relative flex items-center lg:justify-start justify-center gap-3 mx-2 px-3 py-3 rounded-sm transition-all duration-150 border-l-[3px]",
            pathname.startsWith("/studio/settings")
              ? "bg-[var(--studio-surface-elevated)] border-[var(--studio-accent)] text-[var(--studio-text-primary)]"
              : "border-transparent text-[var(--studio-text-secondary)] hover:bg-[var(--studio-surface-elevated)] hover:text-[var(--studio-text-primary)]",
          ].join(" ")}
        >
          <Settings size={18} className="flex-shrink-0" />
          <span className="hidden lg:block text-xs font-medium">Einstellungen</span>
        </Link>

        <Link
          href={`/p/${page.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Seite ansehen"
          className="relative flex items-center lg:justify-start justify-center gap-3 mx-2 px-3 py-3 rounded-sm transition-all duration-150 border-l-[3px] border-transparent text-[var(--studio-text-secondary)] hover:bg-[var(--studio-surface-elevated)] hover:text-[var(--studio-text-primary)]"
        >
          <ExternalLink size={18} className="flex-shrink-0" />
          <span className="hidden lg:block text-xs font-medium">Seite ansehen</span>
        </Link>
      </div>
    </aside>
  );
}

