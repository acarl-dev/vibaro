import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


export async function DELETE(
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

    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/shows/${id}/flyer`,
      { method: "DELETE" }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

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
