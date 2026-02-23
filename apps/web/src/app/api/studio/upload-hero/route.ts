import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function POST(req: NextRequest) {
  try {
    // Read the raw body buffer to preserve the exact multipart encoding (including boundary)
    const bodyBuffer = await req.arrayBuffer();

    const res = await backendFetch("/api/v1/artist-pages/upload-hero", {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/octet-stream",
      },
      body: bodyBuffer,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend upload-hero error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload-hero proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
