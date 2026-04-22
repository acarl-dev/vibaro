import { NextRequest } from "next/server";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";

/**
 * PATCH /api/studio/spotlights/[id]
 * Update a spotlight
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  return forwardStudioRequest({
    method: "PATCH",
    upstreamPath: studioEndpoints.spotlightById(id),
    body,
    errorContext: "Error updating spotlight:",
  });
}

/**
 * DELETE /api/studio/spotlights/[id]
 * Permanently delete an archived spotlight
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return forwardStudioRequest({
    method: "DELETE",
    upstreamPath: studioEndpoints.spotlightById(id),
    errorContext: "Error deleting spotlight:",
  });
}
