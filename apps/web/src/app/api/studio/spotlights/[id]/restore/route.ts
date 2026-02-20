import { NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * POST /api/studio/spotlights/[id]/restore
 * Restore an archived spotlight
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const res = await backendFetch(`/api/v1/spotlights/${params.id}/restore`, {
      method: "POST",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error restoring spotlight:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
