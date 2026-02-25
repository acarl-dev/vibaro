import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import { fetchStudioHome } from "@/lib/api/studio";
import StudioPageHeader from "../../../components/StudioPageHeader";
import StudioQRCode from "../../../components/StudioQRCode";
import StudioEmptyState from "../../../components/StudioEmptyState";
import { Megaphone } from "../../../components/StudioIcons";

async function fetchActiveHandle(): Promise<{ handle: string | null; phaseTitle: string | null; totalClicks: number }> {
  try {
    const [homeData, spotlightRes] = await Promise.all([
      fetchStudioHome(),
      backendFetch("/api/v1/spotlights/active", { cache: "no-store" }),
    ]);

    const handle = homeData?.page?.handle ?? null;
    let phaseTitle: string | null = null;
    let totalClicks = 0;

    if (spotlightRes.ok) {
      const json = await spotlightRes.json();
      phaseTitle = json?.data?.title ?? null;

      if (json?.data?.id) {
        try {
          const analyticsRes = await backendFetch(
            `/api/v1/analytics/overview?range=7d&spotlight_id=${json.data.id}`,
            { cache: "no-store" }
          );
          if (analyticsRes.ok) {
            const aJson = await analyticsRes.json();
            totalClicks = aJson?.data?.total_clicks ?? 0;
          }
        } catch {
          // ignore
        }
      }
    }

    return { handle, phaseTitle, totalClicks };
  } catch {
    return { handle: null, phaseTitle: null, totalClicks: 0 };
  }
}

export default async function QRPage() {
  const { handle, phaseTitle, totalClicks } = await fetchActiveHandle();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pageUrl = handle ? `${appUrl}/p/${handle}` : null;

  // Guard: requires active phase
  if (!phaseTitle) redirect("/studio/share");

  if (!pageUrl) {
    return (
      <div>
        <StudioPageHeader title="QR & OFFLINE" subtitle="QR-Code für diese Phase." />
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
        subtitle={phaseTitle ? `Phase: ${phaseTitle}` : "QR-Code für deine Seite."}
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
            Klicks gesamt (7 Tage)
          </p>
        </div>
        <div className="sm:col-span-2 flex items-center">
          <p className="text-sm" style={{ color: "var(--studio-text-secondary)" }}>
            Standort-Tracking für QR-Scans ist für eine spätere Phase geplant.
          </p>
        </div>
      </div>
    </div>
  );
}
