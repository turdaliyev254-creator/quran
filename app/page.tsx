import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import WordGame from "@/components/WordGame";
import { MORE_ITEMS } from "@/lib/nav";
import lessons from "@/data/arab-tili.json";
import type { GameWord } from "@/lib/wordGame";

const SAMPLE_QUESTIONS = ["Tahorat qanday olinadi?", "Zakot kimlarga farz?", "Ro'za nimalarni buzadi?"];

const MORE_TONES = ["bg-coral", "bg-plum text-white", "bg-cobalt text-white", "bg-turquoise"];

/** Lug'at bazasi yuklanmaguncha o'yin dars so'zlaridan ishlaydi. */
function fallbackWords(): GameWord[] {
  const words: GameWord[] = [];
  for (const lesson of lessons) {
    if (!("jadval" in lesson) || !lesson.jadval) continue;
    for (const [i, row] of lesson.jadval.entries()) {
      words.push({ id: `dars-${lesson.id}-${i}`, ar: row.arabcha, uz: row.ozbekcha });
    }
  }
  return words;
}

export default function Home() {
  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 pb-8"
      style={{ paddingTop: "calc(var(--safe-top) + 18px)" }}
    >
      <header className="rise" style={{ "--i": 0 } as React.CSSProperties}>
        <h1 className="font-display text-[30px] font-extrabold leading-[1.05]">
          Assalomu
          <br />
          alaykum!
        </h1>
      </header>

      {/* AI qidiruv — eng katta plitka */}
      <section
        className="tile tile-cobalt khatam rise p-5"
        style={{ "--i": 1, "--khatam-opacity": 0.13 } as React.CSSProperties}
        aria-label="AI qidiruv"
      >
        <Sparkles
          size={132}
          strokeWidth={1.6}
          className="pointer-events-none absolute -right-6 -top-5 rotate-12 text-gold"
          aria-hidden
        />
        <h2 className="font-display max-w-[13rem] text-[24px] font-extrabold leading-[1.1]">
          Diniy savolingiz bormi?
        </h2>
        <p className="mt-2 max-w-[15rem] text-sm text-white/85">
          Faqat Qur&apos;on va sahih hadis asosida, manba bilan javob beradi.
        </p>

        <form action="/ai-qidiruv" method="get" className="mt-5 flex gap-2">
          <input
            name="q"
            required
            maxLength={500}
            autoComplete="off"
            placeholder="Savolingizni yozing…"
            aria-label="Diniy savol"
            className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-3.5 text-[15px] text-ink-fixed outline-none placeholder:text-muted focus:ring-4 focus:ring-gold"
          />
          <button
            type="submit"
            aria-label="Savolni yuborish"
            className="press tile tile-gold flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl"
          >
            <ArrowUpRight size={24} strokeWidth={2.6} />
          </button>
        </form>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {SAMPLE_QUESTIONS.map((q) => (
            <Link
              key={q}
              href={`/ai-qidiruv?q=${encodeURIComponent(q)}`}
              className="press shrink-0 rounded-full bg-white/16 px-3.5 py-2 text-[13px] font-semibold text-white"
            >
              {q}
            </Link>
          ))}
        </div>
      </section>

      {/* Qur'on va Arab tili */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/quron"
          className="press tile tile-turquoise khatam rise flex min-h-[210px] flex-col justify-between p-4"
          style={{ "--i": 2, "--khatam-opacity": 0.11 } as React.CSSProperties}
        >
          <span
            className="font-kufi pointer-events-none absolute left-4 top-3 text-[68px] leading-none text-ink-fixed"
            aria-hidden
          >
            قرآن
          </span>
          <span />
          <span>
            <span className="font-display block text-[22px] font-extrabold leading-tight">
              Qur&apos;on
            </span>
            <span className="mt-1 block text-[13px] font-semibold text-ink-fixed/75">
              114 sura, Alijon Qori tilovati
            </span>
          </span>
        </Link>

        <Link
          href="/arab-tili"
          className="press tile tile-gold khatam rise flex min-h-[210px] flex-col justify-between p-4"
          style={{ "--i": 3, "--khatam-opacity": 0.11 } as React.CSSProperties}
        >
          <span
            className="font-kufi pointer-events-none absolute right-4 top-1 text-[104px] leading-none text-ink-fixed"
            aria-hidden
          >
            ع
          </span>
          <span />
          <span>
            <span className="font-display block text-[22px] font-extrabold leading-tight">
              Arab tili
            </span>
            <span className="mt-1 block text-[13px] font-semibold text-ink-fixed/75">
              129 video dars va lug&apos;at
            </span>
          </span>
        </Link>
      </div>

      {/* So'z o'yini — bosh sahifaning o'zida */}
      <div className="rise" style={{ "--i": 4 } as React.CSSProperties}>
        <WordGame fallback={fallbackWords()} />
      </div>

      {/* Boshqa bo'limlar */}
      <nav aria-label="Boshqa bo'limlar" className="grid grid-cols-2 gap-3">
        {MORE_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="press tile tile-plain rise flex items-center gap-3 rounded-[20px] p-3"
              style={{ "--i": 5 + i } as React.CSSProperties}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${MORE_TONES[i % MORE_TONES.length]}`}
              >
                <Icon size={22} strokeWidth={2.2} />
              </span>
              <span className="text-[15px] font-bold leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
