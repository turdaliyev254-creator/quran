"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Info, Loader2 } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

const markdownComponents = {
  p: ({ ...props }) => <p className="mb-2 text-sm leading-relaxed last:mb-0" {...props} />,
  strong: ({ ...props }) => (
    <strong className="font-semibold text-[var(--tg-text-color)]" {...props} />
  ),
  h1: ({ ...props }) => <p className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />,
  h2: ({ ...props }) => <p className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />,
  h3: ({ ...props }) => <p className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />,
  ul: ({ ...props }) => <ul className="mb-2 list-disc space-y-1 pl-5 text-sm" {...props} />,
  ol: ({ ...props }) => <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="my-2 border-l-2 border-emerald-500 pl-3 text-sm italic text-[var(--tg-hint-color)]"
      {...props}
    />
  ),
  hr: () => <hr className="my-3 border-black/10 dark:border-white/10" />,
};

const EXAMPLES = [
  "Ro'za tutishning shartlari qanday?",
  "Tahoratni buzadigan narsalar nimalar?",
  "Namozda qiroatni qanday to'g'ri o'qish kerak?",
  "Zakot kimlarga farz?",
];

interface Turn {
  question: string;
  answer?: string;
  error?: string;
  loading: boolean;
}

export default function AiSearchView() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const busy = turns.some((t) => t.loading);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed || busy) return;
    hapticImpact("medium");
    setQuestion("");
    setTurns((prev) => [{ question: trimmed, loading: true }, ...prev]);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const json = await res.json();
      setTurns((prev) =>
        prev.map((t, i) =>
          i === 0
            ? {
                ...t,
                loading: false,
                answer: json.ok ? json.answer : undefined,
                error: json.ok ? undefined : json.error,
              }
            : t
        )
      );
    } catch {
      setTurns((prev) =>
        prev.map((t, i) =>
          i === 0 ? { ...t, loading: false, error: "Xatolik yuz berdi, qayta urinib ko'ring" } : t
        )
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start gap-3 rounded-xl bg-emerald-600/10 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-xs leading-relaxed text-[var(--tg-text-color)]">
          Javoblar sun&apos;iy intellekt (Gemini) tomonidan Qur&apos;on va sahih hadislar
          asosida beriladi. Bu diniy hukm (fatvo) emas — muhim masalalarda malakali ustoz yoki
          ulamoga murojaat qiling.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Diniy savolingizni yozing..."
          maxLength={500}
          className="flex-1 rounded-full border border-black/10 bg-[var(--tg-secondary-bg-color)] px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10"
        />
        <button
          type="submit"
          disabled={busy || !question.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>

      {turns.length === 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Sparkles size={28} className="text-emerald-600" />
            <p className="text-sm text-[var(--tg-hint-color)]">
              Masalan, quyidagilardan birini so&apos;rab ko&apos;ring
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => ask(ex)}
                className="rounded-xl bg-[var(--tg-secondary-bg-color)] px-4 py-3 text-left text-sm text-[var(--tg-text-color)] active:bg-black/5 dark:active:bg-white/10"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {turns.map((t, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-emerald-600 px-4 py-2.5 text-sm text-white">
              {t.question}
            </div>
            {t.loading && (
              <div className="flex items-center gap-2 text-sm text-[var(--tg-hint-color)]">
                <Loader2 size={16} className="animate-spin" /> Javob tayyorlanmoqda...
              </div>
            )}
            {t.answer && (
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-[var(--tg-secondary-bg-color)] px-4 py-3 text-[var(--tg-text-color)]">
                <ReactMarkdown components={markdownComponents}>{t.answer}</ReactMarkdown>
              </div>
            )}
            {t.error && (
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {t.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
