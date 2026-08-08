import { NextRequest, NextResponse } from "next/server";
import { getMutualFundDetail } from "@/lib/mf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing 'code' query param" }, { status: 400 });

  try {
    const detail = await getMutualFundDetail(code);
    if (!detail) return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to fetch NAV history" }, { status: 500 });
  }
}
