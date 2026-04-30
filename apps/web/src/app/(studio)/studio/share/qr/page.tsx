import { redirect } from "next/navigation";
import { fetchShareQRServerData } from "@/lib/api/studio-share.server";
import StudioPageHeader from "../../../components/StudioPageHeader";
import StudioQRCode from "../../../components/StudioQRCode";
import StudioEmptyState from "../../../components/StudioEmptyState";
import { Megaphone } from "../../../components/StudioIcons";
import ExplainPanel from "../../../components/ExplainPanel";
import WhyButton from "../../../components/WhyButton";

export default async function QRPage() {
  const { handle, phaseTitle, totalClicks, pageUrl, shouldRedirect } = await fetchShareQRServerData();

  // Guard: requires active phase
  if (shouldRedirect) redirect("/studio/share");

  if (!pageUrl) {
    return (
      <div>
        <StudioPageHeader title="QR & OFFLINE" subtitle="Nutze diesen QR-Code während der ganzen Phase." />
        <StudioEmptyState
          icon={Megaphone}
          title="Keine Seite gefunden"
          description="Deine Seite muss veröffentlicht sein, um einen QR-Code zu generieren."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StudioPageHeader
        title="QR & OFFLINE"
        subtitle={phaseTitle ? `Phase: ${phaseTitle} · Nutze diesen QR-Code während der ganzen Phase.` : "Nutze diesen QR-Code während der ganzen Phase."}
        action={
          <WhyButton
            label="Wozu ein QR-Code?"
            content={{
              title: "QR & Offline",
              what: "Ein QR-Code bringt Fans von Flyern, Postern oder dem Merchstand direkt auf deine Bandseite.",
              why: "Wenn du während der ganzen Phase denselben QR-Code nutzt, bleibt messbar, wie gut dein Offline-Push im Vergleich zu deinen Links funktioniert.",
              example: "Du druckst 200 Flyer für ein Konzert. Nach dem Konzert siehst du: 47 QR-Scans. So erkennst du, ob dein Offline-Push funktioniert hat.",
              tip: "Nutze diesen QR-Code während der ganzen Phase, zum Beispiel auf Flyern, Plakaten oder am Merchstand.",
            }}
          />
        }
      />

      <ExplainPanel
        heading="Was ist QR & Offline?"
        body={[
          "QR-Codes bringen Fans von Flyern, Postern oder Merch direkt auf deine Seite.",
          "Nutze diesen QR-Code während der ganzen Phase, damit du später sauber siehst, wie stark dein Offline-Push war.",
        ]}
        nextSteps={[
          "Lade den QR-Code unten herunter",
          "Nutze ihn auf Flyern, Plakaten oder am Merchstand",
          "Schau danach in Performance dieser Phase, wie viele QR-Scans es gab",
        ]}
        examples={[
          { icon: "🎭", label: "Konzert-Poster mit QR-Code", description: "200 Flyer gedruckt, 47 Scans. Du siehst, ob Offline-Werbung für diese Phase funktioniert hat." },
          { icon: "👕", label: "QR-Code auf Merch", description: "Fans, die dein Merch tragen, können direkt deine Seite aufrufen. Der Scan wird getrennt von deinen Social-Media-Klicks gemessen." },
        ]}
        tip={{ text: "Nutze denselben QR-Code während der ganzen Phase. Wenn du ihn zwischendurch wechselst, wird dein Offline-Ergebnis schwerer vergleichbar." }}
      />

      {/* QR Card */}
      <div
        className="rounded-lg p-8 flex flex-col items-center gap-6"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        {phaseTitle && (
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--studio-text-secondary)" }}
          >
            {phaseTitle}
          </p>
        )}

        <StudioQRCode url={pageUrl} handle={handle ?? undefined} size={220} />

        <div
          className="w-full max-w-xs rounded px-4 py-3 text-center text-xs"
          style={{
            background: "var(--studio-surface-elevated)",
            border: "1px solid var(--studio-border)",
            color: "var(--studio-text-secondary)",
            fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          }}
        >
          {pageUrl}
        </div>
      </div>

      {/* Stats */}
      <div
        className="rounded-lg p-6 grid grid-cols-2 sm:grid-cols-3 gap-6"
        style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)" }}
      >
        <div>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--studio-text-primary)" }}
          >
            {totalClicks}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--studio-text-secondary)" }}>
            Alle Klicks dieser Phase (7 Tage)
          </p>
        </div>
        <div className="sm:col-span-2 flex items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>
              QR-Scans werden in Performance dieser Phase separat ausgewiesen und nicht mit Link-Klicks verwechselt.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)", opacity: 0.5 }}>
              Standort-Insights folgen sp\u00e4ter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
