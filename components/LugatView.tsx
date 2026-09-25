"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Volume2, X, Info } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";
import { speakArabic } from "@/lib/wordGame";

interface Item {
  a: string;
  p: string;
  t: string;
  u: string;
  s: "w" | "d" | "k";
}

interface Result {
  total: number;
  items: Item[];
}

const SOURCE_LABEL: Record<Item["s"], string> = {
  w: "Wiktionary",
  d: "Dars",
  k: "Asosiy",
};

export default function LugatView() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const reqId = useRef(0);

  async function load(q: string, offset: number) {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const res = await fetch(`/api/lugat?q=${encodeURIComponent(q)}&offset=${offset}`);
      const json: Result = await res.json();
      if (id !== reqId.current) return;
      setResult(json);
      setItems((prev) => (offset === 0 ? json.items : [...prev, ...json.items]));
    } catch {
      // tarmoq xatosi — ro'yxat o'zgarishsiz qoladi
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => void load(query, 0), query ? 220 : 0);
    return () => clearTimeout(t);
  }, [query]);

  const hasMore = result ? items.length < result.total : false;

  return (
    <div className="flex flex-col gap-4 p-4">
      <label className="relative block">
        <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Arabcha yoki o'zbekcha so'z"
          aria-label="Lug'atdan qidirish"
          inputMode="search"
          autoComplete="off"
          className="w-full rounded-2xl bg-surface py-4 pl-12 pr-12 text-[16px] shadow-[inset_0_0_0_1px_var(--line)] outline-none placeholder:text-muted focus:ring-4 focus:ring-gold"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Tozalash"
            className="press absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface-2"
          >
            <X size={18} />
          </button>
        )}
      </label>

      <div className="tile tile-gold flex items-start gap-3 rounded-2xl p-3.5">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p className="text-[13px] font-medium leading-relaxed">
          Manba: Wiktionary (CC BY-SA) va ilova darslari. Ko&apos;p ma&apos;noli so&apos;zlarda faqat
          bazada mavjud ma&apos;nolar ko&apos;rsatiladi.
        </p>
      </div>

      {result && (
        <p className="text-[13px] font-semibold text-muted tabular">
          {query ? `${result.total} ta natija` : "Barcha so'zlar"}
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {items.map((it, i) => (
          <li
            key={`${it.p}-${i}`}
            className="tile tile-plain flex items-center gap-3 rounded-[20px] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold leading-snug">{it.u}</p>
              <p className="mt-0.5 text-[13px] text-muted">
                {it.t}
                <span className="ml-2 rounded-full bg-turquoise px-2 py-0.5 text-[11px] font-bold text-ink-fixed">
                  {SOURCE_LABEL[it.s]}
                </span>
              </p>
            </div>
            <span className="font-arabic text-[30px] leading-tight text-cobalt dark:text-gold">
              {it.a}
            </span>
            <button
              onClick={() => {
                hapticImpact("light");
                speakArabic(it.a);
              }}
              aria-label={`${it.a} ni eshitish`}
              className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2"
            >
              <Volume2 size={19} />
            </button>
          </li>
        ))}
      </ul>

      {!loading && result && items.length === 0 && (
        <p className="py-10 text-center text-[15px] font-semibold text-muted">
          Hech narsa topilmadi. Boshqacha yozib ko&apos;ring.
        </p>
      )}

      {hasMore && (
        <button
          onClick={() => void load(query, items.length)}
          disabled={loading}
          className="press tile tile-cobalt flex min-h-[52px] items-center justify-center rounded-2xl font-display text-[15px] font-bold disabled:opacity-60"
        >
          {loading ? "Yuklanmoqda…" : "Yana ko'rsatish"}
        </button>
      )}
    </div>
  );
}
