export default function ShareDistributionQRHint() {
  return (
    <div
      className="rounded-lg p-4 flex items-center justify-between"
      style={{ border: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}
    >
      <div>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-primary)" }}>QR & Offline</p>
        <p style={{ fontSize: "12px", color: "var(--studio-text-secondary)", marginTop: "2px" }}>QR-Code für diese Phase</p>
      </div>
      <a
        href="/studio/share/qr"
        style={{ fontSize: "12px", color: "var(--studio-accent)", fontWeight: 500, textDecoration: "none" }}
      >
        Zum QR-Code →
      </a>
    </div>
  );
}