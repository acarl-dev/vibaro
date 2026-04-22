import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.analyticsBreakdown(searchParams),
    cache: "no-store",
    errorContext: "[analytics/breakdown] GET",
  });
}
