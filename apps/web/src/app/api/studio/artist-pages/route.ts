import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST_BODY",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 }
    );
  }

  const payload = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handle: (body as any)?.handle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    display_name: (body as any)?.display_name,
  };

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/api/v1/artist-pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let json: unknown;
    try {
      json = await apiResponse.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            code: "UPSTREAM_ERROR",
            message: "Artist page service did not return valid JSON.",
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
          message: "Failed to reach artist page service.",
        },
      },
      { status: 502 }
    );
  }
}
