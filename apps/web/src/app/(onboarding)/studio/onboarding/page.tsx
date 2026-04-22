import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./OnboardingClient";
import { backendFetch } from "@/lib/api/backend";

async function userHasArtistPage(): Promise<boolean> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (res.status === 404) return false;
    return res.ok;
  } catch {
    return false;
  }
}

export default async function StudioOnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vibaro_token")?.value;

  if (!token) {
    redirect("/login?next=/studio/onboarding");
  }

  if (await userHasArtistPage()) {
    redirect("/studio");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <OnboardingClient />
    </div>
  );
}
