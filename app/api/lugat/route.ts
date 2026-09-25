import { NextRequest, NextResponse } from "next/server";
import { searchLugat } from "@/lib/lugat";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const offset = Math.max(0, Number(req.nextUrl.searchParams.get("offset") ?? 0) || 0);
  return NextResponse.json(searchLugat(q, 30, offset), {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
