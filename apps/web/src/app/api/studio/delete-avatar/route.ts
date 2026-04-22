import { NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

export async function DELETE() {
  const token = await getTokenFromCookies();

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const res = await backendFetch("/api/v1/artist-pages/delete-avatar", {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend delete error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
