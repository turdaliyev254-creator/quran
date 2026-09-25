"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

interface Hadith {
  id: number;
  mavzu: string;
  arabcha?: string;
  matn: string;
  manba: string;
}

export default function HadithBrowser({ hadislar }: { hadislar: Hadith[] }) {
  const categories = useMemo(
    () => ["Barchasi", ...Array.from(new Set(hadislar.map((h) => h.mavzu)))],
    [hadislar]
  );
  const [category, setCategory] = useState("Barchasi");
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (category === "Barchasi" ? hadislar : hadislar.filter((h) => h.mavzu === category)),
    [hadislar, category]
  );

  function pickRandom() {
    hapticImpact("medium");
    const pool = filtered.length > 0 ? filtered : hadislar;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setHighlightId(pick.id);
    setTimeout(() => {
      document.getElementById(`hadith-${pick.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={pickRandom}
        className="press tile tile-plum flex min-h-[56px] items-center justify-center gap-2 rounded-2xl font-display text-base font-bold"
      >
        <Shuffle size={20} />
        Tasodifiy hadis
      </button>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`press shrink-0 rounded-full px-4 py-2.5 text-[14px] font-bold ${
              category === c ? "tile tile-cobalt" : "bg-surface-2 text-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((h) => (
          <div
            key={h.id}
            id={`hadith-${h.id}`}
            className={`tile tile-plain rounded-[22px] p-4 transition-shadow ${
              highlightId === h.id ? "ring-4 ring-gold" : ""
            }`}
          >
            <span className="rounded-full bg-turquoise px-3 py-1 text-xs font-extrabold text-ink-fixed">
              {h.mavzu}
            </span>
            {h.arabcha && (
              <p className="font-arabic mt-3 text-right text-[24px] leading-[2]">{h.arabcha}</p>
            )}
            <p className="mt-3 text-[16px] leading-relaxed">{h.matn}</p>
            <p className="mt-2 text-[13px] font-semibold text-muted">{h.manba}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
