"use client";

import { useRouter } from "next/navigation";
import { SpotlightData } from "@/lib/api/spotlights";
import CreatePhaseWizard from "../../project/CreatePhaseWizard";
import StudioPageHeader from "../../../components/StudioPageHeader";

export default function NewPhasePage() {
  const router = useRouter();

  const handleSuccess = (spotlight: SpotlightData) => {
    const target =
      spotlight.status === "active"
        ? "/studio/share/distribution"
        : "/studio/share/phases";

    router.push(target);
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/studio/share");
  };

  return (
    <div className="max-w-xl">
      <StudioPageHeader
        title="NEUE PHASE"
        subtitle="Starte eine zeitlich gezielte Phase für deine Seite."
      />
      <CreatePhaseWizard onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
