import { type NextRequest } from "next/server";
import { forwardUploadRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(request: NextRequest) {
  return forwardUploadRequest({
    upstreamPath: studioEndpoints.artistPageUploadAvatar(),
    request,
    errorContext: "[upload-avatar] POST",
  });
}
