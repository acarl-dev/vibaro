import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

async function getMyArtistPageId(): Promise<number> {
  const response = await backendFetch("/api/v1/artist-pages/me");
  if (!response.ok) throw new Error("Failed to fetch artist page");
  const json = await response.json();
  return json?.data?.id;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const artistPageId = await getMyArtistPageId();
    const formData = await request.formData();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/artist-pages/${artistPageId}/shows/${id}/upload-flyer`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
