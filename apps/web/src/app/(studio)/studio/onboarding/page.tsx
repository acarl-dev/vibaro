import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./OnboardingClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function userHasArtistPage(token: string): Promise<boolean> {
  if (!API_BASE_URL) return false;

  const res = await fetch(`${API_BASE_URL}/api/v1/artist-pages/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return false;
  if (!res.ok) return false;

  return true;
}

export default async function StudioOnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio/onboarding");
  }

  if (await userHasArtistPage(token)) {
    redirect("/studio");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Vibaro Studio</p>
          <h1 className="text-3xl font-semibold tracking-tight">Deine Seite ist dein Raum.</h1>
          <p className="text-sm text-zinc-400">Lass uns in Ruhe die Basis dafür anlegen.</p>
        </div>

        <OnboardingClient />

        <p className="text-xs text-zinc-500">
          Du kannst alles später jederzeit anpassen. Wichtig ist nur, dass sich deine Seite nach dir anfühlt – nicht nach Tool.
        </p>
      </div>
    </div>
  );
}
