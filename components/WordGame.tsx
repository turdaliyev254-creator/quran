"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Flame,
  Heart,
  Zap,
  Grid2x2,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  EMPTY_PROGRESS,
  loadProgress,
  makeQuestion,
  saveProgress,
  sfx,
  shortMeaning,
  shuffle,
  speakArabic,
  touchStreak,
  type GameMode,
  type GameProgress,
  type GameWord,
  type Question,
} from "@/lib/wordGame";
import { hapticImpact, hapticNotify } from "@/lib/telegram";

type Stage = "idle" | "countdown" | "playing" | "result";

const BLITZ_SECONDS = 45;
const MATCH_SECONDS = 60;
const MAX_LIVES = 3;
const CONFETTI_COLORS = ["#ffc42e", "#20d3c4", "#ff6b4a", "#ffffff", "#2149f0"];

interface Tile {
  key: string;
  wordId: string;
  side: "ar" | "uz";
  text: string;
}

interface Summary {
  mode: GameMode;
  score: number;
  correct: number;
  bestCombo: number;
  record: boolean;
  missed: GameWord[];
}

export default function WordGame({ fallback }: { fallback: GameWord[] }) {
  const [pool, setPool] = useState<GameWord[]>(fallback);
  const [progress, setProgress] = useState<GameProgress>(EMPTY_PROGRESS);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [mode, setMode] = useState<GameMode>("blitz");
  const [count, setCount] = useState(3);

  // umumiy holat
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BLITZ_SECONDS);
  const [summary, setSummary] = useState<Summary | null>(null);
  const endAtRef = useRef(0);
  const capAtRef = useRef(0);
  const statsRef = useRef({ correct: 0, bestCombo: 0, missed: [] as GameWord[] });
  const learnedRef = useRef<Record<string, number>>({});
  const mutedRef = useRef(false);
  const scoreRef = useRef(0);
  const stageRef = useRef<Stage>("idle");
  const progressRef = useRef<GameProgress>(EMPTY_PROGRESS);

  // blitz
  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const recentRef = useRef<string[]>([]);
  const qIndexRef = useRef(0);
  const lockedRef = useRef(false);

  // match
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongKeys, setWrongKeys] = useState<string[]>([]);
  const matchLockRef = useRef(false);
  const comboRef = useRef(0);

  useEffect(() => {
    // localStorage faqat brauzerda mavjud, shuning uchun mount'dan keyin o'qiymiz.
    const p = loadProgress();
    mutedRef.current = p.muted;
    learnedRef.current = { ...p.learned };
    queueMicrotask(() => setProgress(p));
    fetch("/oyin-sozlari.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { words: GameWord[] }) => {
        if (Array.isArray(data.words) && data.words.length >= 20) setPool(data.words);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const learnedCount = useMemo(
    () => Object.values(progress.learned).filter((n) => n >= 3).length,
    [progress.learned]
  );

  const persist = useCallback((next: GameProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const toggleMute = () => {
    const muted = !progressRef.current.muted;
    mutedRef.current = muted;
    persist({ ...progressRef.current, muted });
  };

  /* ---------- Boshlash ---------- */
  function start(m: GameMode) {
    hapticImpact("medium");
    setMode(m);
    setSummary(null);
    setCount(3);
    setStage("countdown");
  }

  function begin() {
    const seconds = mode === "blitz" ? BLITZ_SECONDS : MATCH_SECONDS;
    statsRef.current = { correct: 0, bestCombo: 0, missed: [] };
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(seconds);
    endAtRef.current = Date.now() + seconds * 1000;
    capAtRef.current = Date.now() + (seconds + 25) * 1000;
    if (mode === "blitz") {
      recentRef.current = [];
      qIndexRef.current = 0;
      lockedRef.current = false;
      setLives(MAX_LIVES);
      setStreak(0);
      setPicked(null);
      setQuestion(makeQuestion(pool, learnedRef.current, [], 0));
    } else {
      comboRef.current = 0;
      matchLockRef.current = false;
      setSelected(null);
      setMatched(new Set());
      setWrongKeys([]);
      setTiles(buildBoard(pool, []));
    }
    setStage("playing");
  }

  function addTime(ms: number) {
    endAtRef.current = Math.min(capAtRef.current, endAtRef.current + ms);
  }

  function finish() {
    if (stageRef.current === "result") return;
    stageRef.current = "result";
    const s = statsRef.current;
    const final = scoreRef.current;
    const base = progressRef.current;
    const prevBest = base.best[mode];
    const record = final > prevBest && final > 0;
    const next: GameProgress = touchStreak({
      ...base,
      learned: { ...learnedRef.current },
      best: { ...base.best, [mode]: Math.max(prevBest, final) },
    });
    persist(next);
    const uniqueMissed = Array.from(new Map(s.missed.map((w) => [w.id, w])).values());
    setSummary({
      mode,
      score: final,
      correct: s.correct,
      bestCombo: s.bestCombo,
      record,
      missed: uniqueMissed.slice(0, 5),
    });
    setConfetti(record ? makeConfetti() : []);
    setStage("result");
    if (record) {
      sfx("win", mutedRef.current);
      hapticNotify("success");
    }
  }

  /* ---------- Sanoq va vaqt ---------- */
  useEffect(() => {
    if (stage !== "countdown") return;
    if (count > 0) sfx("tick", mutedRef.current);
    const t = setTimeout(
      () => {
        if (count === 0) begin();
        else setCount((c) => c - 1);
      },
      count === 0 ? 350 : 650
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, count]);

  useEffect(() => {
    if (stage !== "playing") return;
    const id = setInterval(() => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setTimeLeft(left / 1000);
      if (left <= 0) finish();
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /* ---------- Tez so'z ---------- */
  function answer(idx: number) {
    if (!question || lockedRef.current || stage !== "playing") return;
    lockedRef.current = true;
    setPicked(idx);
    const ok = idx === question.correctIdx;
    const word = question.word;

    if (ok) {
      const mult = Math.min(5, 1 + Math.floor(streak / 3));
      const gain = 10 * mult;
      scoreRef.current += gain;
      setScore(scoreRef.current);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      statsRef.current.correct += 1;
      statsRef.current.bestCombo = Math.max(statsRef.current.bestCombo, nextStreak);
      learnedRef.current[word.id] = (learnedRef.current[word.id] ?? 0) + 1;
      addTime(1500);
      sfx(nextStreak % 3 === 0 ? "combo" : "ok", mutedRef.current);
      hapticNotify("success");
    } else {
      setStreak(0);
      const remaining = lives - 1;
      setLives(remaining);
      statsRef.current.missed.push(word);
      sfx("bad", mutedRef.current);
      hapticNotify("error");
      if (remaining <= 0) {
        setTimeout(finish, 900);
        return;
      }
    }

    setTimeout(
      () => {
        if (stageRef.current !== "playing") return;
        recentRef.current = [word.id, ...recentRef.current].slice(0, 8);
        qIndexRef.current += 1;
        setPicked(null);
        setQuestion(makeQuestion(pool, learnedRef.current, recentRef.current, qIndexRef.current));
        lockedRef.current = false;
      },
      ok ? 650 : 1100
    );
  }

  /* ---------- Juftlik ---------- */
  function tapTile(t: Tile) {
    if (stage !== "playing" || matchLockRef.current || matched.has(t.key)) return;
    if (t.side === "ar") speakArabic(t.text);
    hapticImpact("light");
    if (selected === null) {
      setSelected(t.key);
      sfx("tick", mutedRef.current);
      return;
    }
    if (selected === t.key) {
      setSelected(null);
      return;
    }
    const first = tiles.find((x) => x.key === selected)!;
    if (first.wordId === t.wordId && first.side !== t.side) {
      matchLockRef.current = true;
      comboRef.current += 1;
      const gain = 10 * Math.min(5, comboRef.current);
      scoreRef.current += gain;
      setScore(scoreRef.current);
      statsRef.current.correct += 1;
      statsRef.current.bestCombo = Math.max(statsRef.current.bestCombo, comboRef.current);
      learnedRef.current[t.wordId] = (learnedRef.current[t.wordId] ?? 0) + 1;
      sfx(comboRef.current % 3 === 0 ? "combo" : "ok", mutedRef.current);
      hapticNotify("success");
      const nextMatched = new Set(matched);
      nextMatched.add(first.key);
      nextMatched.add(t.key);
      setMatched(nextMatched);
      setSelected(null);
      setTimeout(() => {
        matchLockRef.current = false;
        if (stageRef.current !== "playing") return;
        if (nextMatched.size === tiles.length) {
          scoreRef.current += 30;
          setScore(scoreRef.current);
          addTime(5000);
          sfx("win", mutedRef.current);
          const usedIds = tiles.map((x) => x.wordId);
          setMatched(new Set());
          setTiles(buildBoard(pool, usedIds));
        }
      }, 420);
    } else {
      matchLockRef.current = true;
      comboRef.current = 0;
      const bad = [first, t];
      statsRef.current.missed.push(
        ...bad.map((b) => pool.find((w) => w.id === b.wordId)!).filter(Boolean)
      );
      setWrongKeys(bad.map((b) => b.key));
      sfx("bad", mutedRef.current);
      hapticNotify("error");
      setSelected(null);
      setTimeout(() => {
        setWrongKeys([]);
        matchLockRef.current = false;
      }, 520);
    }
  }

  function share() {
    if (!summary) return;
    const text = `Arab so'zlari o'yinida ${summary.score} ball to'pladim! Sen ham urinib ko'r.`;
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (navigator.share) {
      navigator.share({ text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
    }
  }

  const totalSeconds = mode === "blitz" ? BLITZ_SECONDS : MATCH_SECONDS;
  const timePct = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
  const urgent = timeLeft <= 10;

  return (
    <section
      aria-label="Arab so'zlari o'yini"
      className="tile tile-plum khatam relative p-5"
      style={{ "--khatam-opacity": 0.16 } as React.CSSProperties}
    >
      {/* ---------- Bosh ekran ---------- */}
      {stage === "idle" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[26px] font-extrabold leading-[1.05]">
                So&apos;z
                <br />
                o&apos;yini
              </h2>
              <p className="mt-2 max-w-[13rem] text-sm text-white/85">
                Arabcha so&apos;zni ko&apos;r, ma&apos;nosini tez top. Ketma-ket javob — ko&apos;proq
                ball.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/18 px-3 py-1.5 text-sm font-bold tabular">
                <Flame size={16} className="text-gold" />
                {progress.streakDays} kun
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/18 px-3 py-1.5 text-sm font-bold tabular">
                <Sparkles size={16} className="text-gold" />
                {learnedCount} so&apos;z
              </span>
              <MuteButton muted={progress.muted} onClick={toggleMute} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => start("blitz")}
              className="press tile tile-gold flex min-h-[132px] flex-col justify-between rounded-[22px] p-4 text-left"
            >
              <Zap size={26} strokeWidth={2.4} />
              <span>
                <span className="font-display block text-lg font-bold leading-tight">Tez so&apos;z</span>
                <span className="mt-0.5 block text-xs font-semibold opacity-80 tabular">
                  Rekord: {progress.best.blitz}
                </span>
              </span>
            </button>
            <button
              onClick={() => start("match")}
              className="press tile tile-turquoise flex min-h-[132px] flex-col justify-between rounded-[22px] p-4 text-left"
            >
              <Grid2x2 size={26} strokeWidth={2.4} />
              <span>
                <span className="font-display block text-lg font-bold leading-tight">Juftlik</span>
                <span className="mt-0.5 block text-xs font-semibold opacity-80 tabular">
                  Rekord: {progress.best.match}
                </span>
              </span>
            </button>
          </div>
          <p className="text-center text-xs text-white/75">
            {pool.length} ta so&apos;z bazada · 3 marta to&apos;g&apos;ri topsangiz so&apos;z
            o&apos;zlashtirilgan hisoblanadi
          </p>
        </div>
      )}

      {/* ---------- Sanoq ---------- */}
      {stage === "countdown" && (
        <div className="flex min-h-[300px] items-center justify-center">
          <span key={count} className="pop font-display text-[96px] font-extrabold text-gold">
            {count > 0 ? count : "Bor!"}
          </span>
        </div>
      )}

      {/* ---------- O'yin ---------- */}
      {stage === "playing" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {mode === "blitz" && (
              <div className="flex gap-1" aria-label={`${lives} jon`}>
                {Array.from({ length: MAX_LIVES }, (_, i) => (
                  <Heart
                    key={i}
                    size={22}
                    className={i < lives ? "text-coral" : "text-white/30"}
                    fill={i < lives ? "currentColor" : "none"}
                  />
                ))}
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <MuteButton muted={progress.muted} onClick={toggleMute} />
              {mode === "blitz" && streak >= 3 && (
                <span
                  key={streak}
                  className="pop rounded-full bg-gold px-2.5 py-1 text-sm font-extrabold text-ink-fixed tabular"
                >
                  x{Math.min(5, 1 + Math.floor(streak / 3))}
                </span>
              )}
              <span className="font-display text-xl font-extrabold tabular" aria-live="polite">
                {score}
              </span>
            </div>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/20" role="timer" aria-label="Qolgan vaqt">
            <div
              className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
                urgent ? "bg-coral" : "bg-gold"
              }`}
              style={{ width: `${timePct}%` }}
            />
          </div>

          {mode === "blitz" && question && (
            <BlitzView question={question} picked={picked} onPick={answer} />
          )}

          {mode === "match" && (
            <div className="grid grid-cols-3 gap-2.5">
              {tiles.map((t) => {
                const isMatched = matched.has(t.key);
                const isSel = selected === t.key;
                const isWrong = wrongKeys.includes(t.key);
                return (
                  <button
                    key={t.key}
                    onClick={() => tapTile(t)}
                    disabled={isMatched}
                    className={`press flex min-h-[74px] items-center justify-center rounded-2xl px-2 py-2 text-center font-semibold leading-tight transition-all ${
                      isMatched
                        ? "pointer-events-none scale-90 bg-turquoise/30 text-white/40 opacity-40"
                        : isWrong
                          ? "shake bg-coral text-ink-fixed"
                          : isSel
                            ? "bg-gold text-ink-fixed ring-4 ring-white"
                            : "bg-surface text-ink shadow-[0_10px_18px_-10px_rgba(0,0,0,0.45)]"
                    } ${t.side === "ar" ? "font-arabic text-[26px]" : "text-[15px]"}`}
                  >
                    {t.text}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------- Natija ---------- */}
      {stage === "result" && summary && (
        <div className="relative flex flex-col gap-4">
          <div className="pointer-events-none absolute inset-x-0 -top-2 h-64 overflow-hidden" aria-hidden>
            {confetti.map((c) => (
              <span
                key={c.id}
                className="confetti"
                style={
                  {
                    left: c.left,
                    background: c.color,
                    animationDelay: c.delay,
                    "--dx": c.dx,
                    "--rot": c.rot,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-1 pt-2 text-center">
            {summary.record && (
              <span className="pop flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-sm font-extrabold text-ink-fixed">
                <Trophy size={16} /> Yangi rekord!
              </span>
            )}
            <span className="font-display text-[64px] font-extrabold leading-none tabular">
              {summary.score}
            </span>
            <span className="text-sm text-white/80">
              {summary.correct} ta to&apos;g&apos;ri · eng uzun ketma-ketlik {summary.bestCombo}
            </span>
          </div>

          {summary.missed.length > 0 && (
            <div className="rounded-2xl bg-white/14 p-3">
              <p className="mb-2 text-sm font-bold">Bu so&apos;zlarni yana takrorlang</p>
              <ul className="flex flex-col divide-y divide-white/15">
                {summary.missed.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-sm">{shortMeaning(w.uz)}</span>
                    <button
                      onClick={() => speakArabic(w.ar)}
                      className="font-arabic text-2xl"
                      aria-label={`${w.ar} ni eshitish`}
                    >
                      {w.ar}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <button
              onClick={() => start(summary.mode)}
              className="press tile tile-gold flex min-h-[56px] items-center justify-center gap-2 rounded-2xl font-display text-base font-bold"
            >
              <RotateCcw size={18} /> Yana o&apos;ynash
            </button>
            <button
              onClick={share}
              aria-label="Natijani ulashish"
              className="press tile tile-turquoise flex h-[56px] w-[56px] items-center justify-center rounded-2xl"
            >
              <Share2 size={20} />
            </button>
          </div>
          <button
            onClick={() => setStage("idle")}
            className="text-sm font-semibold text-white/85 underline underline-offset-4"
          >
            Boshqa rejim tanlash
          </button>
        </div>
      )}

    </section>
  );
}

function BlitzView({
  question,
  picked,
  onPick,
}: {
  question: Question;
  picked: number | null;
  onPick: (i: number) => void;
}) {
  const { word, dir, options, correctIdx } = question;
  const revealed = picked !== null;
  return (
    <div className="flex flex-col gap-3.5">
      <button
        onClick={() => speakArabic(word.ar)}
        disabled={dir === "uz2ar"}
        className={`flex min-h-[132px] flex-col items-center justify-center rounded-[22px] bg-surface px-4 py-3 text-ink shadow-[0_12px_22px_-12px_rgba(0,0,0,0.5)] ${
          revealed && picked !== correctIdx ? "shake" : ""
        }`}
        aria-label={dir === "ar2uz" ? `${word.ar} — eshitish uchun bosing` : shortMeaning(word.uz)}
      >
        {dir === "ar2uz" ? (
          <>
            <span className="font-arabic text-[56px] leading-tight">{word.ar}</span>
            {word.tr && <span className="text-sm text-muted">{word.tr}</span>}
          </>
        ) : (
          <span className="font-display text-2xl font-bold leading-tight">
            {shortMeaning(word.uz)}
          </span>
        )}
      </button>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isCorrect = i === correctIdx;
          const isPicked = picked === i;
          let cls = "bg-surface text-ink shadow-[0_10px_18px_-10px_rgba(0,0,0,0.45)]";
          if (revealed) {
            if (isCorrect) cls = "bg-turquoise text-ink-fixed pop";
            else if (isPicked) cls = "bg-coral text-ink-fixed shake";
            else cls = "bg-white/25 text-white/70";
          }
          return (
            <button
              key={opt.id}
              onClick={() => onPick(i)}
              disabled={revealed}
              className={`press flex min-h-[72px] items-center justify-center rounded-2xl px-3 py-2 text-center font-semibold leading-tight transition-colors ${cls} ${
                dir === "uz2ar" ? "font-arabic text-[28px]" : "text-[16px]"
              }`}
            >
              {dir === "ar2uz" ? shortMeaning(opt.uz) : opt.ar}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  dx: string;
  rot: string;
  delay: string;
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: `${Math.round(Math.random() * 100)}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    dx: `${Math.round((Math.random() - 0.5) * 120)}px`,
    rot: `${Math.round(360 + Math.random() * 540)}deg`,
    delay: `${Math.round(Math.random() * 250)}ms`,
  }));
}

function buildBoard(pool: GameWord[], exclude: string[]): Tile[] {
  const ex = new Set(exclude);
  const usable = pool.filter((w) => !ex.has(w.id) && shortMeaning(w.uz).length <= 22);
  const chosen = shuffle(usable.length >= 6 ? usable : pool).slice(0, 6);
  const tiles: Tile[] = chosen.flatMap((w) => [
    { key: `${w.id}-ar`, wordId: w.id, side: "ar" as const, text: w.ar },
    { key: `${w.id}-uz`, wordId: w.id, side: "uz" as const, text: shortMeaning(w.uz) },
  ]);
  return shuffle(tiles);
}

function MuteButton({ muted, onClick }: { muted: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
      className="press flex h-9 w-9 items-center justify-center rounded-full bg-white/18"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
