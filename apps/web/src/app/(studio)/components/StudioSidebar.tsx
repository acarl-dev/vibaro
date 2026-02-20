"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ArtistPageData } from "../layout";

type StudioSidebarProps = {
  page: ArtistPageData;
};

export default function StudioSidebar({ page }: StudioSidebarProps) {
  return (
    <aside className="sticky top-[73px] h-[calc(100vh-73px)] w-56 shrink-0 border-r border-zinc-900/80 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Deine Seite</p>
        <p className="mt-1 text-sm font-medium text-zinc-100 truncate">
          {page.display_name}
        </p>
        <p className="text-xs text-zinc-500">/@{page.handle}</p>
      </div>

      <nav className="space-y-6 text-sm">
        {/* Studio Section */}
        <div>
          <p className="mb-2 px-3 text-xs uppercase tracking-[0.12em] text-zinc-600">Studio</p>
          <div className="space-y-1">
            <NavLink href="/studio">Home</NavLink>
            <NavLink href="/studio/project">Projekt</NavLink>
            <NavLink href="/studio/share">Teilen</NavLink>
            <NavLink href="/studio/results">Ergebnisse</NavLink>
          </div>
        </div>

        {/* Page Content Section */}
        <div>
          <p className="mb-2 px-3 text-xs uppercase tracking-[0.12em] text-zinc-600">Meine Seite</p>
          <div className="space-y-1">
            <NavLink href="/studio/page">Übersicht</NavLink>
            <NavLink href="/studio/appearance">Themes</NavLink>
            <NavLink href="/studio/profile">Profil</NavLink>
            <NavLink href="/studio/links">Links</NavLink>
            <NavLink href="/studio/music">Music</NavLink>
            <NavLink href="/studio/shows">Shows</NavLink>
            <NavLink href="/studio/releases">Releases</NavLink>
            <NavLink href="/studio/videos">Videos</NavLink>
            <NavLink href="/studio/gallery">Gallery</NavLink>
            <NavLink href="/studio/contact">Kontakt</NavLink>
          </div>
        </div>

        {/* Settings */}
        <div className="pt-2 border-t border-zinc-800">
          <NavLink href="/studio/settings">Einstellungen</NavLink>
        </div>
      </nav>
    </aside>
  );
}

function NavLink({
  href,
  children,
  locked,
}: {
  href: string;
  children: ReactNode;
  locked?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={locked ? "#" : href}
      className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-left transition-colors ${
        isActive
          ? "bg-zinc-900 font-medium text-zinc-50"
          : locked
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
      }`}
      {...(locked && {
        onClick: (e: React.MouseEvent) => e.preventDefault(),
      })}
    >
      <span>{children}</span>
      {locked && (
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      )}
    </Link>
  );
}
