"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FilePen, Zap, Megaphone, TrendingUp } from "./StudioIcons";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/studio",         icon: LayoutGrid, exact: true  },
  { label: "Seite",      href: "/studio/page",    icon: FilePen,    exact: false },
  { label: "Projekt",    href: "/studio/project", icon: Zap,        exact: false },
  { label: "Teilen",     href: "/studio/share",   icon: Megaphone,  exact: false },
  { label: "Ergebnisse", href: "/studio/results", icon: TrendingUp, exact: false },
] as const;

export default function StudioBottomNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--studio-surface)] border-t border-[var(--studio-border)]">
      <div className="flex h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors"
              style={{ color: active ? "var(--studio-accent)" : "var(--studio-text-secondary)" }}>
              <Icon size={20} />
              {active && <span className="w-1 h-1 rounded-full bg-[var(--studio-accent)]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

