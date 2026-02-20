import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import ContactClient from "../../contact/ContactClient";

type ArtistPage = {
  id: number;
  booking_email: string | null;
  management_email: string | null;
  press_email: string | null;
  whatsapp_number: string | null;
  contact_message: string | null;
};

async function fetchArtistPage(): Promise<ArtistPage | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    return {
      id: data.id,
      booking_email: data.booking_email ?? null,
      management_email: data.management_email ?? null,
      press_email: data.press_email ?? null,
      whatsapp_number: data.whatsapp_number ?? null,
      contact_message: data.contact_message ?? null,
    };
  } catch {
    return null;
  }
}

export default async function PageContactPage() {
  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  return (
    <ContactClient
      initialData={{
        booking_email: page.booking_email,
        management_email: page.management_email,
        press_email: page.press_email,
        whatsapp_number: page.whatsapp_number,
        contact_message: page.contact_message,
      }}
      artistPageId={page.id}
    />
  );
}
