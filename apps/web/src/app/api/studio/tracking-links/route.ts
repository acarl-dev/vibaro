import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
  const targetUrl = typeof body?.target_url === "string" ? body.target_url.trim() : "";
  if (!targetUrl) {
    return NextResponse.json(
      {
        error: {
          code: "missing_target_url",
          message: "Diese Phase hat noch keinen Ziel-Link. Füge einen Link hinzu, bevor du Tracking-Links erstellst.",
        },
      },
      { status: 422 }
    );
  }

  body.target_url = targetUrl;

  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.trackingLinks(),
    body,
    errorContext: "[tracking-links] POST",
  });
}
