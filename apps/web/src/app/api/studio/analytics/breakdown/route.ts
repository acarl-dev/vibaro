import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/analytics/breakdown
 * Proxy for analytics breakdown endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Forward query params
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `/api/v1/analytics/breakdown${searchParams ? `?${searchParams}` : ""}`;

    const res = await backendFetch(url);
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching analytics breakdown:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
