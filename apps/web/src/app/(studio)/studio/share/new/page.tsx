"use client";

import { useRouter } from "next/navigation";
import { SpotlightData } from "@/lib/api/spotlights";
import CreateSpotlightForm from "../../project/CreateSpotlightForm";
import StudioPageHeader from "../../../components/StudioPageHeader";

export default function NewPhasePage() {
  const router = useRouter();

  const handleSuccess = (spotlight: SpotlightData) => {
    // After creating, go directly to Phase overview
    void spotlight; // used by parent; navigate regardless
    router.push("/studio/share");
  };

  const handleCancel = () => {
    router.push("/studio/share");
  };

  return (
    <div className="max-w-xl">
      <StudioPageHeader
        title="NEUE PHASE"
        subtitle="Starte eine zeitlich gezielte Kampagne für deine Seite."
      />
      <CreateSpotlightForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
