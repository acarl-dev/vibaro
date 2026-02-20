import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import AppearanceClient from "./AppearanceClient";

async function fetchArtistPage() {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

import { redirect } from "next/navigation";

export default function AppearancePageRedirect() {
  redirect("/studio/page/appearance");
}
