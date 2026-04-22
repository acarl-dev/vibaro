import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET() {
  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.trackingLinks(),
    cache: "no-store",
    errorContext: "[tracking-links] GET",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.trackingLinks(),
    body,
    errorContext: "[tracking-links] POST",
  });
}
