import { NextRequest, NextResponse } from "next/server";
import { searchMutualFunds } from "@/lib/mf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 2) return NextResponse.json({ results: [] });

  try {
    const results = await searchMutualFunds(q.trim());
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
