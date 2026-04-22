import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

export async function POST(request: NextRequest) {
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
  };

  try {
    const apiResponse = await backendFetch("/api/v1/handles/check", {
      method: "POST",
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
            message: "Handle check service did not return valid JSON.",
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
          message: "Failed to reach handle check service.",
        },
      },
      { status: 502 }
    );
  }
}
