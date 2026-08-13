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
      // clipboard unavailable — foydalanuvchi qo'lda ko'chirishi mumkin
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/15 px-4 py-3.5 text-left active:bg-white/20"
    >
      <span className="font-mono text-lg tracking-wide text-white">{cardNumber}</span>
      {copied ? (
        <Check size={18} className="shrink-0 text-white" />
      ) : (
        <Copy size={18} className="shrink-0 text-white" />
      )}
    </button>
  );
}
