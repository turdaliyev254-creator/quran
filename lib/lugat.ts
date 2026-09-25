import entries from "@/data/lugat.json";

export interface LugatEntry {
  /** harakatli arabcha yozuv */
  a: string;
  /** harakatsiz (qidiruv uchun) */
  p: string;
  /** lotincha transliteratsiya */
  t: string;
  /** o'zbekcha ma'no */
  u: string;
  /** manba: w = Wiktionary, d = dars, k = qo'lda tekshirilgan asosiy so'z */
  s: "w" | "d" | "k";
}

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;

export function normalizeArabic(text: string): string {
  return text
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .trim();
}

export function normalizeLatin(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʻʼ’‘`´]/g, "'")
    .replace(/ḥ/g, "h")
    .trim();
}

const ALL = entries as LugatEntry[];

interface Prepared {
  e: LugatEntry;
  uz: string;
  tr: string;
}

let prepared: Prepared[] | null = null;
function prepare(): Prepared[] {
  prepared ??= ALL.map((e) => ({ e, uz: normalizeLatin(e.u), tr: normalizeLatin(e.t) }));
  return prepared;
}

const HAS_ARABIC = /[؀-ۿ]/;

export function searchLugat(query: string, limit = 30, offset = 0) {
  const q = query.trim();
  const list = prepare();
  if (!q) {
    const slice = list.slice(offset, offset + limit).map((p) => p.e);
    return { total: list.length, items: slice };
  }

  const scored: { e: LugatEntry; score: number }[] = [];
  if (HAS_ARABIC.test(q)) {
    const nq = normalizeArabic(q);
    for (const p of list) {
      if (p.e.p === nq) scored.push({ e: p.e, score: 0 });
      else if (p.e.p.startsWith(nq)) scored.push({ e: p.e, score: 1 });
      else if (p.e.p.includes(nq)) scored.push({ e: p.e, score: 2 });
    }
  } else {
    const nq = normalizeLatin(q);
    for (const p of list) {
      const parts = p.uz.split(/[;,]\s*/);
      if (parts.includes(nq) || p.tr === nq) scored.push({ e: p.e, score: 0 });
      else if (parts.some((x) => x.startsWith(nq)) || p.tr.startsWith(nq))
        scored.push({ e: p.e, score: 1 });
      else if (p.uz.includes(nq) || p.tr.includes(nq)) scored.push({ e: p.e, score: 2 });
    }
  }
  scored.sort((x, y) => x.score - y.score || x.e.p.length - y.e.p.length);
  return {
    total: scored.length,
    items: scored.slice(offset, offset + limit).map((s) => s.e),
  };
}

export const LUGAT_SIZE = ALL.length;
