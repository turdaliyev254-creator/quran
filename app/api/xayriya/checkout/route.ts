import { NextRequest, NextResponse } from "next/server";
import { buildCheckoutUrl, type PaymentMethod } from "@/lib/payment";
import xayriya from "@/data/xayriya.json";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { categoryId, amount, method } = body ?? {};

  const category = xayriya.find((c) => c.id === categoryId);
  if (!category) {
    return NextResponse.json({ ok: false, error: "Kategoriya topilmadi" }, { status: 400 });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ ok: false, error: "Summa noto'g'ri" }, { status: 400 });
  }
  if (method !== "payme" && method !== "click") {
    return NextResponse.json({ ok: false, error: "To'lov usuli noto'g'ri" }, { status: 400 });
  }

  const result = buildCheckoutUrl(method as PaymentMethod, categoryId, amount);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url });
}
