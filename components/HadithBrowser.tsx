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
    <div className="flex flex-col gap-3 p-4">
      <button
        onClick={pickRandom}
        className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-2.5 text-sm font-medium text-white active:bg-emerald-700"
      >
        <Shuffle size={16} />
        Tasodifiy hadis
      </button>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              category === c
                ? "bg-emerald-600 text-white"
                : "bg-[var(--tg-secondary-bg-color)] text-[var(--tg-hint-color)]"
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
            className={`rounded-xl border p-4 transition-colors ${
              highlightId === h.id
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-black/5 bg-[var(--tg-secondary-bg-color)] dark:border-white/5"
            }`}
          >
            <span className="mb-2 inline-block rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
              {h.mavzu}
            </span>
            {h.arabcha && (
              <p className="font-arabic mb-2 text-right text-lg leading-relaxed">{h.arabcha}</p>
            )}
            <p className="text-sm leading-relaxed text-[var(--tg-text-color)]">{h.matn}</p>
            <p className="mt-2 text-xs text-[var(--tg-hint-color)]">{h.manba}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
