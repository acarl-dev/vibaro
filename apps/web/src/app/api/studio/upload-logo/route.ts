import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";

export async function POST(req: NextRequest) {
  try {
    const bodyBuffer = await req.arrayBuffer();

    const res = await backendFetch("/api/v1/artist-pages/upload-logo", {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/octet-stream",
      },
      body: bodyBuffer,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend upload-logo error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload-logo proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
