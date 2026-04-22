import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getTokenFromCookies();

  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHENTICATED",
          message: "User is not authenticated.",
        },
      },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const apiResponse = await backendFetch(
      `/api/v1/artist-pages/${id}/publish`,
      { method: "POST" }
    );

    let json: unknown;
    try {
      json = await apiResponse.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            code: "UPSTREAM_ERROR",
            message: "Publish service did not return valid JSON.",
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(json, { status: apiResponse.status });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Failed to reach publish service.",
        },
      },
      { status: 502 }
    );
  }
}
