import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/api/backend";

export async function POST(req: NextRequest) {
  const token = await getTokenFromCookies();

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/artist-pages/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend upload error:", res.status, data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
