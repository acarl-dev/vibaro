// Image component removed - using native img for localhost compatibility

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type LinkItem = {
  type?: string;
  title: string;
  url: string;
};

export type ShowItem = {
  title: string;
  venue: string;
  date: string;
  url?: string;
};

export type ReleaseItem = {
  title: string;
  cover_url?: string;
  url?: string;
  release_date?: string;
  is_featured?: boolean;
};

export type FeaturedTrackItem = {
  title: string;
  artist_name: string | null;
  platform: "spotify" | "soundcloud" | "youtube";
  platform_url: string;
  embed_id: string | null;
};

export type VideoItem = {
  title: string;
  platform: "youtube" | "vimeo";
  video_id: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
};

export type GalleryImageItem = {
  title?: string | null;
  image_url: string;
};

export type PublicArtistPageData = {
  handle: string;
  display_name: string;
  bio: string | null;
  images: {
    avatar_url: string | null;
    hero_image_url: string | null;
  };
  focus?: {
    type: "links" | "shows" | "releases";
    limit: number;
  };
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
  featured_tracks: FeaturedTrackItem[];
  videos?: VideoItem[];
  gallery_images?: GalleryImageItem[];
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
  theme?: {
    key: string | null;
    variant: string | null;
  };
};

// -----------------------------------------------------------------------------
// Hero Component
// -----------------------------------------------------------------------------

export function Hero({ page }: { page: PublicArtistPageData }) {
  const hasHeroImage = !!page.images.hero_image_url;
  const hasAvatar = !!page.images.avatar_url;

  return (
    <section className="w-full bg-zinc-950">
      {hasHeroImage ? (
        <header>
          {/* Hero image: mobile = full image (auto height), desktop = full-bleed cover */}
          <div className="relative w-full overflow-hidden bg-zinc-950 md:h-screen">
            <img
              src={page.images.hero_image_url!}
              alt={`${page.display_name} hero image`}
              className="block w-full h-auto md:absolute md:inset-0 md:w-full md:h-full md:object-cover"
              style={{ objectPosition: "50% 0%" }}
            />

            {/* Mobile-only subtle fade into page background */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 60%, rgb(9, 9, 11) 100%)",
              }}
            />

            {/* Desktop-only gradient overlay for readability */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)",
              }}
            />

            {/* Desktop-only text overlay (unchanged layout) */}
            <div
              className="hidden md:block absolute"
              style={{
                top: "68%",
                left: 0,
                right: 0,
                transform: "translateY(-5%)",
                paddingBottom: "2rem",
              }}
            >
              <div
                className="mx-auto"
                style={{ maxWidth: "980px", padding: "0 clamp(16px, 4vw, 48px)" }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
                  {page.display_name}
                </h1>

                {page.bio && (
                  <p
                    className="mt-3 text-zinc-200 text-base md:text-lg leading-relaxed"
                    style={{ maxWidth: "60ch" }}
                  >
                    {page.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only: name & bio below image (no overlay) */}
          <div
            className="md:hidden relative bg-zinc-950"
            style={{
              marginTop: "-1px",
              padding: "clamp(10px, 3vw, 28px) clamp(16px, 4vw, 48px)",
            }}
          >
            <div className="mx-auto" style={{ maxWidth: "980px" }}>
              <h1 className="text-4xl font-semibold tracking-tight leading-tight text-white">
                {page.display_name}
              </h1>

              {page.bio && (
                <p
                  className="mt-3 text-zinc-300 text-base leading-relaxed"
                  style={{ maxWidth: "60ch" }}
                >
                  {page.bio}
                </p>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header
          className="relative w-full flex items-center justify-center"
          style={{
            minHeight: "min(45vh, 360px)",
            padding: "clamp(40px, 8vh, 80px) clamp(16px, 4vw, 48px)",
            background: "linear-gradient(to bottom, rgb(24, 24, 27), rgb(9, 9, 11))",
          }}
        >
          {hasAvatar ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-full ring-1 ring-zinc-800/50">
              <img
                src={page.images.avatar_url!}
                alt={page.display_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800/50">
              <span className="text-5xl font-light text-zinc-600">
                {getInitials(page.display_name)}
              </span>
            </div>
          )}
        </header>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Section Components
// -----------------------------------------------------------------------------

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 pt-12 border-t border-zinc-800/20">
      <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FocusSection({
  type,
  items,
  links,
  shows,
  releases,
}: {
  type: "links" | "shows" | "releases";
  items: unknown[];
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
}) {
  const isEmpty = items.length === 0;

  return (
    <section className="mx-auto" style={{ maxWidth: '980px', padding: '48px clamp(16px, 4vw, 48px)' }}>
      <h2 className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 mb-6">
        {getSectionTitle(type)}
      </h2>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {type === "links" && <LinkList items={links} />}
          {type === "shows" && <ShowList items={shows.slice(0, items.length)} />}
          {type === "releases" && <ReleaseList items={releases.slice(0, items.length)} />}
        </>
      )}
    </section>
  );
}

function EmptyState() {
  // Calm empty states - no call to action
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-zinc-700">—</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// List Components
// -----------------------------------------------------------------------------

export function LinkList({ items }: { items: LinkItem[] }) {
  if (items.length === 0) return null;

  // Dynamic import for icons to avoid bundling issues
  const getSocialIcon = (type?: string) => {
    const iconClass = "w-6 h-6 md:w-7 md:h-7";
    
    switch (type) {
      case 'instagram':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        );
      case 'x':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'spotify':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        );
      case 'applemusic':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 00-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.62.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a4.948 4.948 0 002.12-2.325c.25-.63.345-1.29.398-1.96.025-.323.017-.648.024-.973L24 6.124zM6.16 4.457h11.68c.22 0 .433.02.643.05.57.08 1.03.32 1.384.74.35.42.524.914.524 1.486v10.093c0 .97-.49 1.665-1.425 1.963-.165.053-.333.086-.503.105-.068.008-.136.013-.204.016H6.4c-.26 0-.516-.028-.767-.09-.645-.16-1.096-.56-1.335-1.177a2.38 2.38 0 01-.124-.747V6.733c0-.97.49-1.665 1.425-1.963.165-.053.333-.086.503-.105.068-.008.136-.013.204-.016.285-.003.57 0 .854-.192z" />
          </svg>
        );
      case 'soundcloud':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.078.042-.089.092L0 14.479l.187 1.318c0 .056.038.092.089.092.05 0 .089-.036.095-.092l.21-1.318-.21-1.334c-.006-.05-.045-.092-.095-.092m1.83-1.229c-.06 0-.11.051-.117.117l-.2 2.359.2 2.237c.006.066.056.117.116.117.063 0 .11-.051.122-.117l.227-2.237-.227-2.359c-.011-.066-.059-.117-.121-.117m.941-.439c-.07 0-.132.06-.138.131l-.182 2.797.182 2.724c.006.071.068.132.138.132.062 0 .124-.061.133-.132l.21-2.724-.21-2.797c-.009-.071-.071-.131-.133-.131m.97-.452c-.08 0-.144.063-.153.149l-.166 3.246.166 3.16c.009.085.073.148.153.148.074 0 .136-.063.148-.148l.19-3.16-.19-3.246c-.012-.086-.074-.149-.148-.149m1.009-.091c-.082 0-.151.068-.16.154l-.149 3.337.149 3.258c.009.087.078.155.16.155.081 0 .15-.068.157-.155l.172-3.258-.172-3.337c-.007-.086-.076-.154-.157-.154m.964.039c-.09 0-.161.073-.172.166l-.138 3.298.138 3.218c.011.093.082.165.172.165.089 0 .159-.072.172-.165l.16-3.218-.16-3.298c-.013-.093-.083-.166-.172-.166m1.013.124c-.095 0-.168.077-.179.175l-.124 3.174.124 3.096c.011.099.084.176.179.176.093 0 .168-.077.179-.176l.142-3.096-.142-3.174c-.011-.098-.086-.175-.179-.175m.986.103c-.101 0-.181.081-.191.186l-.113 3.071.113 3.058c.01.104.09.186.191.186.1 0 .181-.082.191-.186l.13-3.058-.13-3.071c-.01-.105-.091-.186-.191-.186m1.005.17c-.106 0-.19.087-.2.196l-.101 2.901.101 2.98c.01.11.094.196.2.196.11 0 .19-.086.202-.196l.117-2.98-.117-2.901c-.012-.109-.092-.196-.202-.196m.962.119c-.111 0-.196.091-.206.204l-.09 2.782.09 2.973c.01.112.095.204.206.204.112 0 .196-.092.206-.204l.105-2.973-.105-2.782c-.01-.113-.094-.204-.206-.204m1.008.165c-.117 0-.206.095-.216.211l-.083 2.617.083 2.967c.01.118.099.213.216.213.118 0 .206-.095.216-.213l.096-2.967-.096-2.617c-.01-.116-.098-.211-.216-.211m.965.143c-.121 0-.216.099-.227.225l-.074 2.474.074 2.962c.011.125.106.225.227.225.123 0 .218-.1.227-.225l.087-2.962-.087-2.474c-.009-.126-.104-.225-.227-.225m1.007.126c-.128 0-.226.103-.236.232l-.065 2.348.065 2.957c.01.129.108.231.236.231.128 0 .226-.102.237-.231l.078-2.957-.078-2.348c-.011-.129-.109-.232-.237-.232m.993.162c-.133 0-.236.107-.246.241l-.057 2.186.057 2.952c.01.135.113.241.246.241.133 0 .235-.106.245-.241l.066-2.952-.066-2.186c-.01-.134-.112-.241-.245-.241m1.007.091c-.138 0-.246.111-.255.25l-.048 2.095.048 2.946c.009.139.117.25.255.25.14 0 .247-.111.256-.25l.057-2.946-.057-2.095c-.009-.139-.116-.25-.256-.25m.969.082c-.144 0-.251.115-.259.261l-.041 2.013.041 2.942c.008.146.115.261.259.261.145 0 .251-.115.26-.261l.05-2.942-.05-2.013c-.009-.146-.115-.261-.26-.261m1.006.077c-.151 0-.261.119-.269.269l-.032 1.931.032 2.938c.008.15.118.269.269.269.149 0 .261-.119.269-.269l.039-2.938-.039-1.931c-.008-.15-.12-.269-.269-.269m.986.064c-.155 0-.27.123-.279.279l-.023 1.867.023 2.934c.009.156.124.279.279.279.155 0 .27-.123.278-.279l.029-2.934-.029-1.867c-.008-.156-.123-.279-.278-.279m1.006.052c-.16 0-.279.127-.287.287l-.014 1.815.014 2.93c.008.161.127.288.287.288.161 0 .279-.127.288-.288l.018-2.93-.018-1.815c-.009-.16-.127-.287-.288-.287m.968.039c-.166 0-.288.131-.295.297l-.007 1.776.007 2.925c.007.167.129.297.295.297.167 0 .288-.13.295-.297l.009-2.925-.009-1.776c-.007-.166-.128-.297-.295-.297m1.007.025c-.171 0-.292.135-.3.305l-.001 1.751.001 2.922c.008.169.129.305.3.305.172 0 .293-.136.301-.305v-2.922c0-.17-.129-.305-.301-.305m.975.013c-.177 0-.302.139-.309.313v4.673c.007.174.132.313.309.313.176 0 .302-.139.309-.313V12.66c-.007-.174-.133-.313-.309-.313" />
          </svg>
        );
      case 'bandcamp':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 9.6l6.842 4.8H24L17.158 9.6H0z" />
          </svg>
        );
      case 'website':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {items.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-zinc-400 transition-colors hover:text-white"
          title={link.title}
          aria-label={link.title}
        >
          {getSocialIcon(link.type)}
        </a>
      ))}
    </div>
  );
}

export function ShowList({ items }: { items: ShowItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-4">
      {items.map((show, index) => (
        <li
          key={index}
          className="flex items-start justify-between gap-6 py-3 border-b border-zinc-800/30"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base text-zinc-200">{show.title}</p>
            <p className="text-sm text-zinc-500 mt-1">{show.venue}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <time className="text-sm text-zinc-500 whitespace-nowrap">{formatDate(show.date)}</time>
            {show.url && (
              <a
                href={show.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors border-b border-zinc-800 hover:border-zinc-600"
              >
                Info
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ReleaseList({ items }: { items: ReleaseItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {items.map((release, index) => (
        <li key={index}>
          <a
            href={release.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-md border border-zinc-800/50 bg-zinc-900/30 overflow-hidden transition-all hover:border-zinc-700/70"
          >
            {release.cover_url ? (
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={release.cover_url}
                  alt={release.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-zinc-900 flex items-center justify-center">
                <span className="text-4xl text-zinc-700">♪</span>
              </div>
            )}
            <div className="p-4">
              <p className="text-sm font-medium text-zinc-100 truncate">{release.title}</p>
              {release.release_date && (
                <p className="text-xs text-zinc-500 mt-1.5">{release.release_date}</p>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function VideoList({ items }: { items: VideoItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {items.map((video, index) => (
        <li key={index}>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 transition-all hover:border-zinc-700/70"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-zinc-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <svg className="w-8 h-8 text-zinc-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-zinc-100 line-clamp-2">{video.title}</p>
              {video.description && (
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{video.description}</p>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function GalleryGrid({ items }: { items: GalleryImageItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((image, index) => (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700/70 transition-all cursor-pointer"
        >
          <img
            src={image.image_url}
            alt={image.title || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {image.title && (
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm text-white font-medium">{image.title}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ContactSection({
  booking_email,
  management_email,
  press_email,
  whatsapp_number,
}: {
  booking_email?: string | null;
  management_email?: string | null;
  press_email?: string | null;
  whatsapp_number?: string | null;
}) {
  const hasAnyContact = booking_email || management_email || press_email || whatsapp_number;
  
  if (!hasAnyContact) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {booking_email && (
        <div className="group p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/70 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Bookings</h3>
              <a href={`mailto:${booking_email}`} className="text-sm text-zinc-200 hover:text-white transition-colors break-all">
                {booking_email}
              </a>
            </div>
          </div>
        </div>
      )}
      
      {management_email && (
        <div className="group p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/70 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Management</h3>
              <a href={`mailto:${management_email}`} className="text-sm text-zinc-200 hover:text-white transition-colors break-all">
                {management_email}
              </a>
            </div>
          </div>
        </div>
      )}
      
      {press_email && (
        <div className="group p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/70 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Press</h3>
              <a href={`mailto:${press_email}`} className="text-sm text-zinc-200 hover:text-white transition-colors break-all">
                {press_email}
              </a>
            </div>
          </div>
        </div>
      )}
      
      {whatsapp_number && (
        <div className="group p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/70 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">WhatsApp</h3>
              <a href={`https://wa.me/${whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-200 hover:text-white transition-colors break-all">
                {whatsapp_number}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FeaturedReleaseSection({ release }: { release: ReleaseItem }) {
  return (
    <section className="mx-auto" style={{ maxWidth: '980px', padding: '48px clamp(16px, 4vw, 48px)' }}>
      <h2 className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 mb-6">
        New Release
      </h2>
      
      <a
        href={release.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Cover Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {release.cover_url ? (
              <img
                src={release.cover_url}
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-6xl text-zinc-700">♪</span>
              </div>
            )}
          </div>
          
          {/* Release Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
              {release.title}
            </h3>
            {release.release_date && (
              <p className="text-sm text-zinc-500 mb-6">{release.release_date}</p>
            )}
            {release.url && (
              <span className="inline-block px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg transition-colors group-hover:bg-zinc-100">
                Jetzt anhören
              </span>
            )}
          </div>
        </div>
      </a>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

export function Footer({ displayName }: { displayName: string }) {
  return (
    <footer className="border-t border-zinc-900/50 py-10 px-6 mt-16">
      <div className="mx-auto max-w-xl flex flex-col items-center gap-3 text-center">
        <p className="text-xs text-zinc-600">© {displayName}</p>
        <p className="text-[10px] text-zinc-800 font-light tracking-wider uppercase">
          Vibaro
        </p>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function getSectionTitle(type: "links" | "shows" | "releases" | "Discography"): string {
  const titles: Record<string, string> = {
    links: "Links",
    shows: "Shows",
    releases: "Releases",
    Discography: "Discography",
  };
  return titles[type];
}

export function getFocusItems(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases",
  limit: number
): unknown[] {
  const items =
    focusType === "links"
      ? page.links
      : focusType === "shows"
        ? page.shows
        : page.releases;
  return items.slice(0, limit);
}

export function getOptionalSections(
  page: PublicArtistPageData,
  focusType: "links" | "shows" | "releases"
): { type: "links" | "shows" | "releases" }[] {
  // Priority: releases > shows > links
  const priority: ("links" | "shows" | "releases")[] = ["releases", "shows", "links"];
  const sections: { type: "links" | "shows" | "releases" }[] = [];

  for (const type of priority) {
    if (type === focusType) continue; // skip focus type
    if (sections.length >= 2) break; // max 2 sections

    const items =
      type === "links"
        ? page.links
        : type === "shows"
          ? page.shows
          : page.releases;

    if (items.length > 0) {
      sections.push({ type });
    }
  }

  return sections;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
}
