"use client";

import { useRouter } from "next/navigation";
import { SpotlightData } from "@/lib/api/spotlights";
import CreatePhaseWizard from "../../project/CreatePhaseWizard";
import StudioPageHeader from "../../../components/StudioPageHeader";

export default function NewPhasePage() {
  const router = useRouter();

  const handleSuccess = (spotlight: SpotlightData) => {
    // After creating, go to phases list so user can see & activate
    void spotlight;
    router.push("/studio/share/phases");
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
      <CreatePhaseWizard onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
