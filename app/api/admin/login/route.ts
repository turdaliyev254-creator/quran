import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, expectedSessionToken, verifyPassword } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Parol noto'g'ri" }, { status: 401 });
  }

  const token = expectedSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD sozlanmagan" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
