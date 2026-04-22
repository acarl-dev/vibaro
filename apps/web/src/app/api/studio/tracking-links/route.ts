import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/tracking-links
 * Fetch all tracking links for authenticated user
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

    const res = await backendFetch("/api/v1/tracking-links", {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching tracking links:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/studio/tracking-links
 * Create a new tracking link
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    const res = await backendFetch("/api/v1/tracking-links", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error creating tracking link:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
