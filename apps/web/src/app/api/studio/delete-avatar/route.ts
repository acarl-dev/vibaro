import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function DELETE() {
  return forwardStudioRequest({
    method: "DELETE",
    upstreamPath: studioEndpoints.artistPageDeleteAvatar(),
    errorContext: "[delete-avatar] DELETE",
  });
}
