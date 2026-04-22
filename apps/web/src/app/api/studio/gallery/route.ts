import { type NextRequest } from "next/server";
import { forwardStudioRequest, forwardUploadRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET() {
  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.gallery(),
    errorContext: "[gallery] GET",
  });
}

export async function POST(request: NextRequest) {
  return forwardUploadRequest({
    upstreamPath: studioEndpoints.gallery(),
    request,
    errorContext: "[gallery] POST",
  });
}
