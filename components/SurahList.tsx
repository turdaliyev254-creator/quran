"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SurahMeta } from "@/lib/quranApi";

export default function SurahList({ surahs }: { surahs: SurahMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [surahs, query]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tg-hint-color)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sura nomi yoki raqami bo'yicha qidirish"
          className="w-full rounded-full border border-black/10 bg-[var(--tg-secondary-bg-color)] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 dark:border-white/10"
        />
      </div>

      <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
        {filtered.map((s) => (
          <li key={s.number}>
            <Link
              href={`/quron/${s.number}`}
              className="flex items-center gap-3 px-3 py-3 active:bg-black/5 dark:active:bg-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {s.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--tg-text-color)]">
                  {s.englishName}
                </span>
                <span className="block truncate text-xs text-[var(--tg-hint-color)]">
                  {s.englishNameTranslation} · {s.numberOfAyahs} oyat ·{" "}
                  {s.revelationType === "Meccan" ? "Makkiy" : "Madaniy"}
                </span>
              </span>
              <span className="font-arabic shrink-0 text-lg text-[var(--tg-text-color)]">
                {s.name}
              </span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-[var(--tg-hint-color)]">
            Hech narsa topilmadi
          </li>
        )}
      </ul>
    </div>
  );
}
