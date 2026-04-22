import { type NextRequest, NextResponse } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.handlesCheck(),
    body: { handle: (body as Record<string, unknown>)?.handle },
    errorContext: "[handles/check] POST",
  });
}
