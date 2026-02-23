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
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <OnboardingClient />
    </div>
  );
}
