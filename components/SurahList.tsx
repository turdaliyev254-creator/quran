"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SurahMeta } from "@/lib/quranApi";

const GLAZES = [
  "bg-turquoise text-ink-fixed",
  "bg-gold text-ink-fixed",
  "bg-coral text-ink-fixed",
  "bg-plum text-white",
  "bg-cobalt text-white",
];

export default function SurahList({ surahs }: { surahs: SurahMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number) === q
    );
  }, [surahs, query]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <label className="relative block">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sura nomi yoki raqami"
          aria-label="Sura qidirish"
          className="w-full rounded-2xl bg-surface py-3.5 pl-11 pr-4 text-[15px] shadow-[inset_0_0_0_1px_var(--line)] outline-none placeholder:text-muted focus:ring-4 focus:ring-gold"
        />
      </label>

      <ul className="flex flex-col gap-2.5">
        {filtered.map((s) => (
          <li key={s.number}>
            <Link
              href={`/quron/${s.number}`}
              className="press tile tile-plain flex items-center gap-3 rounded-[20px] p-3"
            >
              <span
                className={`font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-base font-bold tabular ${
                  GLAZES[(s.number - 1) % GLAZES.length]
                }`}
              >
                {s.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] font-bold">{s.englishName}</span>
                <span className="block truncate text-[13px] text-muted">
                  {s.englishNameTranslation} · {s.numberOfAyahs} oyat ·{" "}
                  {s.revelationType === "Meccan" ? "Makkiy" : "Madaniy"}
                </span>
              </span>
              <span className="font-kufi shrink-0 text-[26px] leading-none text-cobalt dark:text-gold">
                {s.name.replace(/^سُورَةُ\s*/, "")}
              </span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-10 text-center text-sm font-semibold text-muted">Hech narsa topilmadi</li>
        )}
      </ul>
    </div>
  );
}
