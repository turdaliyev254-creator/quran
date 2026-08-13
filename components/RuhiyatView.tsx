"use client";

import { useState } from "react";
import { hapticSelect } from "@/lib/telegram";

interface RuhiyatEntry {
  day: number;
  sarlavha: string;
  matn: string;
  oyat?: { matn: string; manba: string };
  dua?: { arabcha: string; tarjima: string };
}

function todayIndex(total: number) {
  const day = new Date().getDate();
  return ((day - 1) % total) + 1;
}

export default function RuhiyatView({ entries }: { entries: RuhiyatEntry[] }) {
  const [selected, setSelected] = useState(() => todayIndex(entries.length));
  const entry = entries.find((e) => e.day === selected) ?? entries[0];
  const isToday = selected === todayIndex(entries.length);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {entries.map((e) => (
          <button
            key={e.day}
            onClick={() => {
              hapticSelect();
              setSelected(e.day);
            }}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              selected === e.day
                ? "bg-emerald-600 text-white"
                : "bg-[var(--tg-secondary-bg-color)] text-[var(--tg-hint-color)]"
            }`}
          >
            {e.day}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white">
        {isToday && (
          <span className="mb-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
            Bugungi ruhiyat
          </span>
        )}
        <h2 className="text-lg font-semibold">{entry.sarlavha}</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50">{entry.matn}</p>
      </div>

      {entry.oyat && (
        <div className="rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 dark:border-white/5">
          <p className="text-sm italic leading-relaxed text-[var(--tg-text-color)]">
            &ldquo;{entry.oyat.matn}&rdquo;
          </p>
          <p className="mt-2 text-xs text-[var(--tg-hint-color)]">{entry.oyat.manba}</p>
        </div>
      )}

      {entry.dua && (
        <div className="rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 dark:border-white/5">
          <p className="font-arabic text-right text-xl leading-loose">{entry.dua.arabcha}</p>
          <p className="mt-2 text-sm text-[var(--tg-hint-color)]">{entry.dua.tarjima}</p>
        </div>
      )}
    </div>
  );
}
