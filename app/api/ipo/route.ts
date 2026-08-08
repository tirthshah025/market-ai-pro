import { NextResponse } from "next/server";
import { getCurrentIPOs, getUpcomingIPOs } from "@/lib/ipo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [current, upcoming] = await Promise.allSettled([getCurrentIPOs(), getUpcomingIPOs()]);

    return NextResponse.json({
      current: current.status === "fulfilled" ? current.value : null,
      upcoming: upcoming.status === "fulfilled" ? upcoming.value : null,
      currentError: current.status === "rejected" ? String(current.reason) : null,
      upcomingError: upcoming.status === "rejected" ? String(upcoming.reason) : null,
    });
  } catch {
    return NextResponse.json(
      { current: null, upcoming: null, currentError: "NSE unavailable", upcomingError: "NSE unavailable" },
      { status: 200 }
    );
  }
}
