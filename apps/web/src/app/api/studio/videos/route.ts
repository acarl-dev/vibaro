import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET() {
  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.videos(),
    errorContext: "[videos] GET",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.videos(),
    body,
    errorContext: "[videos] POST",
  });
}
