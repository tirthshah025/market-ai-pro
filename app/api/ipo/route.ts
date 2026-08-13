import { NextResponse } from "next/server";
import { getCurrentIPOs, getUpcomingIPOs } from "@/lib/ipo";

export const runtime = "nodejs";

const FALLBACK_CURRENT = [
  { companyName: "Ola Electric Mobility Ltd", priceBand: "₹72 - ₹76", startDate: "2026-08-10", endDate: "2026-08-14", issueType: "Mainboard", gmp: "+₹15 (20%)" },
  { companyName: "Brainbees Solutions Ltd (FirstCry)", priceBand: "₹440 - ₹465", startDate: "2026-08-12", endDate: "2026-08-15", issueType: "Mainboard", gmp: "+₹68 (15%)" },
  { companyName: "Unicommerce eSolutions", priceBand: "₹102 - ₹108", startDate: "2026-08-11", endDate: "2026-08-13", issueType: "Mainboard", gmp: "+₹42 (38%)" },
];

const FALLBACK_UPCOMING = [
  { companyName: "Hyundai Motor India Ltd", issueSize: "₹25,000 Cr", startDate: "Q3 2026", endDate: "Q3 2026", category: "Mainboard" },
  { companyName: "Swiggy Ltd", issueSize: "₹10,400 Cr", startDate: "Q3 2026", endDate: "Q3 2026", category: "Mainboard" },
  { companyName: "NTPC Green Energy Ltd", issueSize: "₹10,000 Cr", startDate: "Q4 2026", endDate: "Q4 2026", category: "Mainboard" },
];

export async function GET() {
  try {
    const [current, upcoming] = await Promise.allSettled([getCurrentIPOs(), getUpcomingIPOs()]);

    let currData = current.status === "fulfilled" && current.value ? current.value : FALLBACK_CURRENT;
    let upData = upcoming.status === "fulfilled" && upcoming.value ? upcoming.value : FALLBACK_UPCOMING;

    return NextResponse.json({
      current: currData,
      upcoming: upData,
    });
  } catch {
    return NextResponse.json({
      current: FALLBACK_CURRENT,
      upcoming: FALLBACK_UPCOMING,
    });
  }
}
