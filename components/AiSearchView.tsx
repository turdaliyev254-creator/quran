"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, ArrowUp, Info, Loader2 } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

const EXAMPLES = [
  "Ro'za tutishning shartlari qanday?",
  "Tahoratni buzadigan narsalar nimalar?",
  "Zakot kimlarga farz?",
  "Namozda qiroatni qanday to'g'ri o'qish kerak?",
];

const markdownComponents = {
  p: ({ ...props }) => <p className="mb-2 text-[15px] leading-relaxed last:mb-0" {...props} />,
  strong: ({ ...props }) => <strong className="font-bold" {...props} />,
  h1: ({ ...props }) => <p className="mb-1 mt-3 text-[15px] font-bold first:mt-0" {...props} />,
  h2: ({ ...props }) => <p className="mb-1 mt-3 text-[15px] font-bold first:mt-0" {...props} />,
  h3: ({ ...props }) => <p className="mb-1 mt-3 text-[15px] font-bold first:mt-0" {...props} />,
  ul: ({ ...props }) => <ul className="mb-2 list-disc space-y-1 pl-5 text-[15px]" {...props} />,
  ol: ({ ...props }) => <ol className="mb-2 list-decimal space-y-1 pl-5 text-[15px]" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="my-2 rounded-xl bg-turquoise/20 px-3 py-2 text-[15px] italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-3 border-line" />,
};

interface Turn {
  question: string;
  answer?: string;
  error?: string;
  loading: boolean;
}

export default function AiSearchView({ initialQuestion }: { initialQuestion?: string }) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const busy = turns.some((t) => t.loading);
  const startedRef = useRef(false);

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

  // Bosh sahifadagi savol maydonidan kelgan savolni bir marta avtomatik yuboramiz.
  useEffect(() => {
    if (initialQuestion && !startedRef.current) {
      startedRef.current = true;
      void ask(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="tile tile-gold flex items-start gap-3 rounded-2xl p-3.5">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p className="text-[13px] font-medium leading-relaxed">
          Javoblarni sun&apos;iy intellekt Qur&apos;on va sahih hadislar asosida beradi. Bu fatvo
          emas — muhim masalada ustoz yoki ulamoga murojaat qiling.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
        className="flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Diniy savolingizni yozing…"
          maxLength={500}
          aria-label="Diniy savol"
          className="min-w-0 flex-1 rounded-2xl bg-surface px-4 py-3.5 text-[15px] text-ink shadow-[inset_0_0_0_1px_var(--line)] outline-none placeholder:text-muted focus:ring-4 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={busy || !question.trim()}
          aria-label="Savolni yuborish"
          className="press tile tile-cobalt flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl disabled:opacity-50"
        >
          <ArrowUp size={24} strokeWidth={2.6} />
        </button>
      </form>

      {turns.length === 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 pt-2 text-muted">
            <Sparkles size={18} className="text-cobalt" />
            <p className="text-sm font-semibold">Masalan, so&apos;rab ko&apos;ring</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex}
                onClick={() => ask(ex)}
                className="press tile tile-plain rise rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold"
                style={{ "--i": i } as React.CSSProperties}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {turns.map((t, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="tile tile-cobalt max-w-[88%] self-end rounded-[20px] rounded-br-md px-4 py-3 text-[15px] font-semibold">
              {t.question}
            </div>
            {t.loading && (
              <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                <Loader2 size={16} className="animate-spin" /> Javob tayyorlanmoqda…
              </div>
            )}
            {t.answer && (
              <div className="tile tile-plain rise max-w-[94%] rounded-[20px] rounded-bl-md px-4 py-3.5">
                <ReactMarkdown components={markdownComponents}>{t.answer}</ReactMarkdown>
              </div>
            )}
            {t.error && (
              <div className="tile tile-coral max-w-[94%] rounded-[20px] px-4 py-3 text-[15px] font-semibold">
                {t.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
