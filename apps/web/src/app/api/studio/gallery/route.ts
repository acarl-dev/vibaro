import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/gallery
 * Gets all gallery images for current user
 * Forwards to: GET /api/v1/studio/gallery
 */
export async function GET() {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      },
      { status: 401 }
    );
  }

  try {
    const response = await backendFetch("/api/v1/studio/gallery", {
      method: "GET",
    });

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

/**
 * POST /api/studio/gallery
 * Uploads a new gallery image
 * Forwards to: POST /api/v1/studio/gallery
 */
export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      },
      { status: 401 }
    );
  }

  try {
    // Read the entire request body as a buffer to preserve the exact multipart encoding
    const bodyBuffer = await request.arrayBuffer();

    // Forward the entire body buffer with the original Content-Type header
    const response = await backendFetch("/api/v1/studio/gallery", {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") || "application/octet-stream",
      },
      body: bodyBuffer,
      // @ts-expect-error -- duplex is required for streaming bodies but not in RequestInit types
      duplex: "half",
    });

    // Get response text first to debug HTML errors
    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          error: {
            code: "UPSTREAM_ERROR",
            message: `Backend error: ${response.statusText}`,
          },
        },
        { status: response.status || 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Gallery Upload Error]", error);
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
