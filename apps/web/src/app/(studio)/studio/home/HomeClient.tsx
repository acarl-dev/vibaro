"use client";

import ProjectStatusCard from "./ProjectStatusCard";
import TopLinksCard from "./TopLinksCard";
import PageStatusCard from "./PageStatusCard";
import TipCard from "./TipCard";
import type { StudioHomeData } from "@/lib/api/studio";

type HomeClientProps = {
  data: StudioHomeData;
};

export default function HomeClient({ data }: HomeClientProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Home</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Dein Performance-Zentrum – schnell und übersichtlich.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <ProjectStatusCard spotlight={data.spotlight} />
          <PageStatusCard page={data.page} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TopLinksCard links={data.top_links} stats={data.stats} />
          <TipCard tip={data.tip} />
        </div>
      </div>
    </div>
  );
}
