"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_SECTION_PREFIXES = [
  "/studio/page",
  "/studio/appearance",
  "/studio/profile",
  "/studio/links",
  "/studio/music",
  "/studio/shows",
  "/studio/releases",
  "/studio/videos",
  "/studio/gallery",
  "/studio/contact",
  "/studio/spotlight",
  "/studio/stage",
];

const PHASE_SECTION_PREFIXES = ["/studio/share"];

const PAGE_SUB_NAV_ITEMS = [
  { label: "Übersicht",  href: "/studio/page",          exact: true },
  { label: "Header",     href: "/studio/page/profile"               },
  { label: "Links",      href: "/studio/page/links"                 },
  { label: "Musik",      href: "/studio/page/music"                 },
  { label: "Shows",      href: "/studio/page/shows"                 },
  { label: "Releases",   href: "/studio/page/releases"              },
  { label: "Videos",     href: "/studio/page/videos"                },
  { label: "Galerie",    href: "/studio/page/gallery"               },
  { label: "Kontakt",    href: "/studio/page/contact"               },
] as const;

const PHASE_SUB_NAV_ITEMS = [
  { label: "Übersicht",    href: "/studio/share",              exact: true },
  { label: "Distribution", href: "/studio/share/distribution"             },
  { label: "QR & Offline", href: "/studio/share/qr"                       },
  { label: "Performance",  href: "/studio/share/performance"              },
] as const;

type SubNavItem = { label: string; href: string; exact?: boolean };

function SubNavBar({ items, pathname }: { items: readonly SubNavItem[]; pathname: string }) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="sticky z-30 flex-shrink-0"
      style={{
        top: "var(--studio-nav-height, 56px)",
        background: "var(--studio-surface)",
        borderBottom: "1px solid var(--studio-border)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6" style={{ maxWidth: "1200px" }}>
        <div className="flex items-stretch gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-shrink-0 flex items-center px-3 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-colors whitespace-nowrap"
                style={{
                  color: active ? "var(--studio-text-primary)" : "var(--studio-text-secondary)",
                  borderBottom: active ? "2px solid var(--studio-accent)" : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StudioPageSubNav() {
  const pathname = usePathname();

  const isPageSection = PAGE_SECTION_PREFIXES.some((p) => pathname.startsWith(p));
  const isPhaseSection = PHASE_SECTION_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPageSection) return <SubNavBar items={PAGE_SUB_NAV_ITEMS} pathname={pathname} />;
  if (isPhaseSection) return <SubNavBar items={PHASE_SUB_NAV_ITEMS} pathname={pathname} />;
  return null;
}
