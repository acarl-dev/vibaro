import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * DELETE /api/studio/tracking-links/[id]
 * Delete (archive) a tracking link
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const res = await backendFetch(`/api/v1/tracking-links/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Error deleting tracking link:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
