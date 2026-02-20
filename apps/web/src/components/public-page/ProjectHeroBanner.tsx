type Props = {
  title: string;
  type: string;
  primaryUrl: string;
};

export default function ProjectHeroBanner({ title, type, primaryUrl }: Props) {
  const ctaLabel = type === "release" ? "Jetzt hören" :
                   type === "tour" ? "Tickets sichern" :
                   "Mehr erfahren";

  return (
    <div className="rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 p-8 text-center mb-8">
      <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wider">
        {type === "release" ? "🎵 Neue Veröffentlichung" :
         type === "tour" ? "🎤 Auf Tour" :
         "📢 Aktuell"}
      </p>
      <h2 className="text-2xl font-bold text-zinc-50 mb-4">{title}</h2>
      <a
        href={primaryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
      >
        {ctaLabel} →
      </a>
    </div>
  );
}
