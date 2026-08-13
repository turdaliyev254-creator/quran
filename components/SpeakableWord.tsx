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
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  function speak() {
    if (!supported) return;
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
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left active:bg-black/5 dark:active:bg-white/10"
    >
      <span className="text-sm text-[var(--tg-hint-color)]">{ozbekcha}</span>
      <span className="flex items-center gap-2">
        <span className="font-arabic text-xl">{arabic}</span>
        <Volume2
          size={16}
          className={speaking ? "text-emerald-600" : "text-[var(--tg-hint-color)]"}
        />
      </span>
    </button>
  );
}
