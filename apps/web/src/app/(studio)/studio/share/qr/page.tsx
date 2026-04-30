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

  // Guard: requires a published band page URL for QR generation
  if (shouldRedirect) redirect("/studio/share");

  if (!pageUrl) {
    return (
      <div>
        <StudioPageHeader title="QR & OFFLINE" subtitle="Dieser QR-Code führt dauerhaft zu deiner öffentlichen Bandseite." />
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
        subtitle={phaseTitle ? `Aktive Phase: ${phaseTitle} · Der QR-Code bleibt stabil und führt zu deiner Bandseite.` : "Dieser QR-Code führt dauerhaft zu deiner öffentlichen Bandseite."}
        action={
          <WhyButton
            label="Wozu ein QR-Code?"
            content={{
              title: "QR & Offline",
              what: "Ein QR-Code bringt Fans von Flyern, Postern oder dem Merchstand direkt auf deine Bandseite.",
              why: "Ein fester QR-Code spart dir Neudrucke und bleibt auf Flyern, Postern oder Merch langfristig nutzbar.",
              example: "Du druckst 200 Flyer für ein Konzert. Fans scannen den Code und landen direkt auf deiner Bandseite.",
              tip: "Nutze denselben QR-Code dauerhaft, zum Beispiel auf Flyern, Plakaten oder am Merchstand.",
            }}
          />
        }
      />

      <ExplainPanel
        heading="Was ist QR & Offline?"
        body={[
          "QR-Codes bringen Fans von Flyern, Postern oder Merch direkt auf deine Seite.",
          "Dieser QR-Code bleibt stabil und führt dauerhaft zu deiner öffentlichen Bandseite.",
        ]}
        nextSteps={[
          "Lade den QR-Code unten herunter",
          "Nutze ihn auf Flyern, Plakaten oder am Merchstand",
          "Behalte die Aufrufe deiner Bandseite in der Analyse im Blick",
        ]}
        examples={[
          { icon: "🎭", label: "Konzert-Poster mit QR-Code", description: "200 Flyer gedruckt. Fans gelangen per Scan direkt auf deine Bandseite." },
          { icon: "👕", label: "QR-Code auf Merch", description: "Fans, die dein Merch tragen, können direkt deine Seite aufrufen und aktuelle Inhalte sehen." },
        ]}
        tip={{ text: "Nutze denselben QR-Code dauerhaft. So bleibt dein Print-Material langfristig einsetzbar." }}
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
            Aufrufe in der Analyse (7 Tage)
          </p>
        </div>
        <div className="sm:col-span-2 flex items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--studio-text-secondary)" }}>
              Aufrufe deiner Bandseite werden in der Analyse beruecksichtigt.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--studio-text-secondary)", opacity: 0.5 }}>
              Standort-Insights folgen spaeter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
