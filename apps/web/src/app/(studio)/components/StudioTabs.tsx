"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STUDIO_TABS = [
  { label: "Home", href: "/studio", icon: "🏡" },
  { label: "Meine Seite", href: "/studio/page", icon: "🏠" },
  { label: "Mein Projekt", href: "/studio/project", icon: "🎯" },
  { label: "Teilen", href: "/studio/share", icon: "📣" },
  { label: "Ergebnisse", href: "/studio/results", icon: "📊" },
];

export default function StudioTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/studio") {
      return pathname === "/studio";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop: Horizontal tabs */}
      <nav className="hidden md:flex border-b border-zinc-900/80 bg-zinc-950">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex gap-1">
            {STUDIO_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive(tab.href)
                    ? "border-zinc-50 text-zinc-50"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile: Bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-900/80 bg-zinc-950 pb-safe">
        <div className="flex justify-around">
          {STUDIO_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive(tab.href)
                  ? "text-zinc-50"
                  : "text-zinc-400"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
