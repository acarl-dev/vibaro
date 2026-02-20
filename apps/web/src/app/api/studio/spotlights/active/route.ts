import { NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/spotlights/active
 * Fetch active spotlight for authenticated user
 */
export async function GET() {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const res = await backendFetch("/api/v1/spotlights/active", {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching active spotlight:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
