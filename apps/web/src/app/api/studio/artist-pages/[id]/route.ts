import { type NextRequest, NextResponse } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    method: "PATCH",
    upstreamPath: studioEndpoints.artistPageById(id),
    body,
    errorContext: `[artist-pages/${id}] PATCH`,
  });
}
