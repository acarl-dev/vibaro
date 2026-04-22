"use client";

type Props = {
  title: string;
  type: string;
  primaryUrl: string;
};

// Icons — use w-full h-full so they scale to their container
const MusicIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PlayIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const WifiIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
  </svg>
);
const ShoppingBagIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const BoltIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/**
 * Config per SpotlightType.
 * Maps each type to a label (shown to visitors), a CTA label, and an icon.
 */
const TYPE_CONFIG: Record<string, { label: string; cta: string; Icon: () => React.ReactNode }> = {
  single:     { label: "Neue Single",          cta: "Jetzt hören",       Icon: MusicIcon },
  album:      { label: "Neues Album",          cta: "Jetzt hören",       Icon: MusicIcon },
  release:    { label: "Neue Veröffentlichung", cta: "Jetzt hören",      Icon: MusicIcon },
  video:      { label: "Neues Video",           cta: "Jetzt ansehen",    Icon: PlayIcon },
  tour:       { label: "Auf Tour",              cta: "Tickets sichern",  Icon: MapPinIcon },
  event:      { label: "Event",                 cta: "Mehr erfahren",    Icon: CalendarIcon },
  livestream: { label: "Livestream",             cta: "Jetzt ansehen",   Icon: WifiIcon },
  merch:      { label: "Neues Merch",            cta: "Zum Shop",        Icon: ShoppingBagIcon },
  collab:     { label: "Kollaboration",          cta: "Jetzt entdecken", Icon: UsersIcon },
};

const DEFAULT_CONFIG = { label: "Aktuell", cta: "Mehr erfahren", Icon: BoltIcon };

export default function ProjectHeroBanner({ title, type, primaryUrl }: Props) {
  const config = TYPE_CONFIG[type] ?? DEFAULT_CONFIG;

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        background: "rgba(var(--bg-surface), 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(var(--border-default), 0.5)",
      }}
    >
      {/* Accent top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "rgb(var(--accent))" }}
      />

      {/* Subtle accent glow behind the top edge */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-16 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(var(--accent), 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative px-8 py-10 text-center">
        {/* Status indicator with pulsing dot */}
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <span
              className="absolute w-5 h-5 rounded-full animate-ping"
              style={{
                background: "rgba(var(--accent), 0.15)",
                animationDuration: "2.5s",
              }}
            />
            {/* Dot */}
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "rgb(var(--accent))" }}
            />
          </div>
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase"
            style={{ color: "rgb(var(--accent))" }}
          >
            {config.label}
          </span>
        </div>

        {/* Type icon — larger, centered between label and title */}
        <div
          className="flex items-center justify-center mb-4"
          style={{ color: "rgba(var(--text-primary), 0.25)" }}
        >
          <div className="w-8 h-8">
            <config.Icon />
          </div>
        </div>

        {/* Title */}
        <h2
          className="font-bold mb-6"
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "rgb(var(--text-primary))",
          }}
        >
          {title}
        </h2>

        {/* CTA Button */}
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-all duration-200"
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            background: "rgb(var(--accent))",
            color: "rgb(var(--accent-contrast))",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {config.cta}
        </a>
      </div>
    </div>
  );
}
