import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/yahoo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 1) return NextResponse.json({ results: [] });

  try {
    const results = await searchSymbols(q.trim());
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
