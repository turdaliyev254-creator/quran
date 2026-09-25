"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

export default function SpeakableWord({
  arabic,
  ozbekcha,
}: {
  arabic: string;
  ozbekcha: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    hapticImpact("light");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      onClick={speak}
      className="press tile tile-plain flex w-full items-center justify-between gap-3 rounded-[20px] px-4 py-3.5 text-left"
    >
      <span className="text-[16px] font-semibold">{ozbekcha}</span>
      <span className="flex items-center gap-3">
        <span className="font-arabic text-[30px] leading-none text-cobalt dark:text-gold">{arabic}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            speaking ? "bg-turquoise text-ink-fixed" : "bg-surface-2 text-muted"
          }`}
        >
          <Volume2 size={18} />
        </span>
      </span>
    </button>
  );
}
