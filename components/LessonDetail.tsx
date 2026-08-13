import type { Lesson } from "@/lib/lessons";
import SpeakableWord from "@/components/SpeakableWord";

export default function LessonDetail({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-xl bg-[var(--tg-secondary-bg-color)] p-4">
        <span className="mb-2 inline-block rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
          {lesson.daraja}
        </span>
        <p className="text-sm leading-relaxed text-[var(--tg-text-color)]">{lesson.kirish}</p>
      </div>

      {lesson.harflar && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {lesson.harflar.map((h, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-3 dark:border-white/5"
            >
              <span className="font-arabic text-3xl">{h.harf}</span>
              <span className="text-xs font-medium text-[var(--tg-text-color)]">{h.nomi}</span>
              <span className="text-center text-[10px] text-[var(--tg-hint-color)]">
                {h.talaffuz}
              </span>
            </div>
          ))}
        </div>
      )}

      {lesson.jadval && (
        <>
          <p className="-mb-2 text-xs text-[var(--tg-hint-color)]">
            So&apos;zga bosib, talaffuzini eshiting
          </p>
          <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
            {lesson.jadval.map((p, i) => (
              <li key={i}>
                <SpeakableWord arabic={p.arabcha} ozbekcha={p.ozbekcha} />
              </li>
            ))}
          </ul>
        </>
      )}

      {lesson.boblar && (
        <div className="flex flex-col gap-3">
          {lesson.boblar.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 dark:border-white/5"
            >
              <h3 className="mb-1.5 text-sm font-semibold text-[var(--tg-text-color)]">
                {b.sarlavha}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--tg-hint-color)]">{b.matn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
