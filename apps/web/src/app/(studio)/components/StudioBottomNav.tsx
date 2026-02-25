"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FilePen, Megaphone, TrendingUp } from "./StudioIcons";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/studio",          icon: LayoutGrid, exact: true  },
  { label: "Seite",     href: "/studio/page",     icon: FilePen,    exact: false },
  { label: "Phase",     href: "/studio/share",    icon: Megaphone,  exact: false },
  { label: "Analyse",   href: "/studio/results",  icon: TrendingUp, exact: false },
] as const;

export default function StudioBottomNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{ background: "var(--studio-surface)", borderTop: "1px solid var(--studio-border)" }}>
      <div className="flex h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 gap-1 transition-colors"
              style={{ color: active ? "var(--studio-accent)" : "var(--studio-text-secondary)" }}>
              <Icon size={19} />
              <span className="text-[9px] font-semibold tracking-wider uppercase">{item.label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 rounded-t-full" style={{ background: "var(--studio-accent)" }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

