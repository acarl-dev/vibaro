export default function PhaseQuickActions() {
  return (
    <div
      className="rounded-lg p-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
      style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
    >
      {[
        { label: "Distribution", desc: "Plattformen & Links", href: "/studio/share/distribution" },
        { label: "QR & Offline", desc: "QR-Code für diese Phase", href: "/studio/share/qr" },
        { label: "Performance", desc: "Klicks & Plattform-Verteilung", href: "/studio/share/performance" },
      ].map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex flex-col gap-1 rounded p-4 transition-colors"
          style={{
            background: "var(--studio-surface-elevated)",
            border: "1px solid var(--studio-border)",
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {item.label}
          </span>
          <span className="text-xs" style={{ color: "var(--studio-text-secondary)" }}>
            {item.desc}
          </span>
        </a>
      ))}
    </div>
  );
}
