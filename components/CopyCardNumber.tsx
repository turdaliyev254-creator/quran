"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

export default function CopyCardNumber({ cardNumber }: { cardNumber: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    hapticImpact("medium");
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard mavjud emas — foydalanuvchi qo'lda ko'chiradi
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="press flex w-full items-center justify-between gap-3 rounded-2xl bg-white/15 px-4 py-4 text-left"
      aria-label={copied ? "Nusxalandi" : "Karta raqamini nusxalash"}
    >
      <span className="font-mono text-[19px] font-semibold tracking-wide tabular">{cardNumber}</span>
      {copied ? <Check size={22} className="shrink-0 text-gold" /> : <Copy size={22} className="shrink-0" />}
    </button>
  );
}
