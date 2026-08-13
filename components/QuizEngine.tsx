"use client";

import { useMemo, useState } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

interface Question {
  id: number;
  kategoriya: string;
  savol: string;
  variantlar: string[];
  togri: number;
}

type Stage = "select" | "playing" | "result";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bestScoreKey(category: string) {
  return `viktorina-best-${category}`;
}

export default function QuizEngine({ questions }: { questions: Question[] }) {
  const categories = useMemo(
    () => Array.from(new Set(questions.map((q) => q.kategoriya))),
    [questions]
  );
  const [stage, setStage] = useState<Stage>("select");
  const [category, setCategory] = useState<string | null>(null);
  const [pool, setPool] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  function startQuiz(cat: string) {
    hapticImpact("medium");
    const catQuestions = shuffle(questions.filter((q) => q.kategoriya === cat));
    setCategory(cat);
    setPool(catQuestions);
    setIndex(0);
    setScore(0);
    setSelectedOption(null);
    setStage("playing");
  }

  function answer(optionIndex: number) {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const correct = pool[index].togri === optionIndex;
    hapticImpact(correct ? "light" : "heavy");
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 < pool.length) {
        setIndex((i) => i + 1);
        setSelectedOption(null);
      } else {
        const finalScore = score + (correct ? 1 : 0);
        if (category && typeof window !== "undefined") {
          const key = bestScoreKey(category);
          const prev = Number(localStorage.getItem(key) ?? 0);
          const pct = Math.round((finalScore / pool.length) * 100);
          if (pct > prev) localStorage.setItem(key, String(pct));
          setBestScore(Math.max(prev, pct));
        }
        setStage("result");
      }
    }, 900);
  }

  if (stage === "select") {
    return (
      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm text-[var(--tg-hint-color)]">
          Kategoriyani tanlang va bilimingizni sinab ko&apos;ring.
        </p>
        {categories.map((cat) => {
          const best =
            typeof window !== "undefined" ? localStorage.getItem(bestScoreKey(cat)) : null;
          return (
            <button
              key={cat}
              onClick={() => startQuiz(cat)}
              className="flex items-center justify-between rounded-xl bg-[var(--tg-secondary-bg-color)] px-4 py-3.5 text-left active:bg-black/5 dark:active:bg-white/10"
            >
              <span className="text-sm font-medium text-[var(--tg-text-color)]">{cat}</span>
              <span className="flex items-center gap-1 text-xs text-[var(--tg-hint-color)]">
                {best && (
                  <>
                    <Trophy size={12} /> {best}%
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (stage === "playing") {
    const q = pool[index];
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between text-xs text-[var(--tg-hint-color)]">
          <span>
            Savol {index + 1} / {pool.length}
          </span>
          <span>{category}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--tg-secondary-bg-color)]">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${((index + 1) / pool.length) * 100}%` }}
          />
        </div>

        <h2 className="text-base font-semibold leading-snug text-[var(--tg-text-color)]">
          {q.savol}
        </h2>

        <div className="flex flex-col gap-2">
          {q.variantlar.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === q.togri;
            let style =
              "border-black/10 bg-[var(--tg-secondary-bg-color)] dark:border-white/10";
            if (selectedOption !== null) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-500/10";
              else if (isSelected) style = "border-red-500 bg-red-500/10";
            }
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={selectedOption !== null}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${style}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && isCorrect && (
                  <Check size={16} className="text-emerald-600" />
                )}
                {selectedOption !== null && isSelected && !isCorrect && (
                  <X size={16} className="text-red-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const pct = Math.round((score / pool.length) * 100);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Trophy size={40} className="text-emerald-600" />
      <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Natija: {pct}%</h2>
      <p className="text-sm text-[var(--tg-hint-color)]">
        {score} / {pool.length} to&apos;g&apos;ri javob
        {bestScore !== null && bestScore > pct && (
          <>
            <br />
            Eng yaxshi natijangiz: {bestScore}%
          </>
        )}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => category && startQuiz(category)}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white active:bg-emerald-700"
        >
          <RotateCcw size={16} /> Qayta urinish
        </button>
        <button
          onClick={() => setStage("select")}
          className="rounded-full bg-[var(--tg-secondary-bg-color)] px-5 py-2.5 text-sm font-medium text-[var(--tg-text-color)]"
        >
          Kategoriyalar
        </button>
      </div>
    </div>
  );
}
