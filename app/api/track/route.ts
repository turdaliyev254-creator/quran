import { NextRequest, NextResponse } from "next/server";
import { trackVisit } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const userId = body?.userId;

  if (!userId || (typeof userId !== "number" && typeof userId !== "string")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await trackVisit(userId);
  return NextResponse.json({ ok: true });
}
