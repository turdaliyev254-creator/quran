import { NextRequest, NextResponse } from "next/server";
import { askIslamicQuestion } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const question = body?.question;

  if (typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Savol kiritilmagan" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json(
      { ok: false, error: "Savol juda uzun (500 belgidan oshmasin)" },
      { status: 400 }
    );
  }

  const result = await askIslamicQuestion(question.trim());
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true, answer: result.answer });
}
