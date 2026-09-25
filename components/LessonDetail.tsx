import type { Lesson } from "@/lib/lessons";
import SpeakableWord from "@/components/SpeakableWord";

const LETTER_GLAZES = [
  "bg-turquoise text-ink-fixed",
  "bg-gold text-ink-fixed",
  "bg-coral text-ink-fixed",
  "bg-plum text-white",
  "bg-cobalt text-white",
];

export default function LessonDetail({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="tile tile-cobalt khatam rounded-[24px] p-5" style={{ "--khatam-opacity": 0.13 } as React.CSSProperties}>
        <span className="rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-ink-fixed">
          {lesson.daraja}
        </span>
        <p className="mt-3 text-[16px] leading-relaxed">{lesson.kirish}</p>
      </div>

      {lesson.harflar && (
        <div className="grid grid-cols-3 gap-2.5">
          {lesson.harflar.map((h, i) => (
            <div
              key={i}
              className={`tile flex flex-col items-center gap-1 rounded-[20px] px-2 py-4 text-center ${
                LETTER_GLAZES[i % LETTER_GLAZES.length]
              }`}
            >
              <span className="font-kufi text-[44px] leading-none">{h.harf}</span>
              <span className="mt-1 text-[15px] font-extrabold">{h.nomi}</span>
              <span className="text-[12px] font-medium leading-tight opacity-80">{h.talaffuz}</span>
            </div>
          ))}
        </div>
      )}

      {lesson.jadval && (
        <>
          <p className="text-[13px] font-semibold text-muted">
            So&apos;zga bosib, talaffuzini eshiting
          </p>
          <ul className="flex flex-col gap-2.5">
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
            <div key={i} className="tile tile-plain rounded-[22px] p-4">
              <h3 className="font-display mb-1.5 text-base font-bold">{b.sarlavha}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{b.matn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
