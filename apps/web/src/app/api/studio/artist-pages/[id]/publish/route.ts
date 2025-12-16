import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        error: {
          code: "CONFIG_ERROR",
          message: "API base URL is not configured.",
        },
      },
      { status: 500 }
    );
  }

  const token = request.cookies.get("vibaro_token")?.value;

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
    const apiResponse = await fetch(
      `${API_BASE_URL}/api/v1/artist-pages/${id}/publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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
