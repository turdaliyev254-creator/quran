export interface GameWord {
  id: string;
  ar: string;
  tr?: string;
  uz: string;
}

export type GameMode = "blitz" | "match";

export interface Question {
  word: GameWord;
  /** "ar2uz": arabcha so'z -> o'zbekcha ma'no; "uz2ar": ma'no -> arabcha so'z */
  dir: "ar2uz" | "uz2ar";
  options: GameWord[];
  correctIdx: number;
}

export interface GameProgress {
  best: { blitz: number; match: number };
  streakDays: number;
  lastPlay: string;
  learned: Record<string, number>;
  muted: boolean;
}

const KEY = "oyin:v1";

export const EMPTY_PROGRESS: GameProgress = {
  best: { blitz: 0, match: 0 },
  streakDays: 0,
  lastPlay: "",
  learned: {},
  muted: false,
};

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      best: { ...EMPTY_PROGRESS.best, ...(parsed.best ?? {}) },
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(p: GameProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // saqlab bo'lmasa ham o'yin ishlayveradi
  }
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** O'yin tugaganda ketma-ket kunlar hisobini yangilaydi. */
export function touchStreak(p: GameProgress): GameProgress {
  const now = new Date();
  const today = dayKey(now);
  if (p.lastPlay === today) return p;
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
  return { ...p, lastPlay: today, streakDays: p.lastPlay === yesterday ? p.streakDays + 1 : 1 };
}

export function shortMeaning(uz: string): string {
  return uz.split(/[;,]/)[0].trim();
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeighted(pool: GameWord[], learned: Record<string, number>, exclude: Set<string>) {
  const candidates = pool.filter((w) => !exclude.has(w.id));
  const list = candidates.length > 0 ? candidates : pool;
  const weights = list.map((w) => 1 / (1 + (learned[w.id] ?? 0)));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1];
}

export function makeQuestion(
  pool: GameWord[],
  learned: Record<string, number>,
  recent: string[],
  index: number
): Question {
  const word = pickWeighted(pool, learned, new Set(recent));
  const dir: Question["dir"] = index % 4 === 3 ? "uz2ar" : "ar2uz";
  const correctText = shortMeaning(word.uz).toLowerCase();
  const used = new Set<string>([correctText, word.ar]);
  const distractors: GameWord[] = [];
  let guard = 0;
  while (distractors.length < 3 && guard < 80) {
    guard++;
    const cand = pool[Math.floor(Math.random() * pool.length)];
    const key = dir === "ar2uz" ? shortMeaning(cand.uz).toLowerCase() : cand.ar;
    if (cand.id === word.id || used.has(key) || used.has(cand.ar)) continue;
    used.add(key);
    used.add(cand.ar);
    distractors.push(cand);
  }
  const options = shuffle([word, ...distractors]);
  return { word, dir, options, correctIdx: options.findIndex((o) => o.id === word.id) };
}

/* ---------- Ovoz effektlari (WebAudio) ---------- */
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.12) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.02);
}

export function sfx(kind: "ok" | "bad" | "combo" | "win" | "tick", muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    ctx ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    if (kind === "ok") {
      tone(660, 0, 0.09);
      tone(880, 0.07, 0.14);
    } else if (kind === "combo") {
      tone(660, 0, 0.08);
      tone(880, 0.06, 0.08);
      tone(1175, 0.12, 0.18);
    } else if (kind === "bad") {
      tone(180, 0, 0.22, "sawtooth", 0.08);
    } else if (kind === "win") {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.2));
    } else {
      tone(1000, 0, 0.04, "square", 0.04);
    }
  } catch {
    // ovoz bo'lmasa ham o'yin davom etadi
  }
}

export function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
