import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lesson } from "@/lib/lessons";

const GLAZES = [
  "bg-turquoise text-ink-fixed",
  "bg-gold text-ink-fixed",
  "bg-coral text-ink-fixed",
  "bg-plum text-white",
  "bg-cobalt text-white",
];

export default function LessonList({
  lessons,
  basePath,
}: {
  lessons: Lesson[];
  basePath: string;
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {lessons.map((lesson, i) => (
        <li key={lesson.id}>
          <Link
            href={`${basePath}/${lesson.id}`}
            className="press tile tile-plain flex items-center gap-3 rounded-[20px] p-3"
          >
            <span
              className={`font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-[15px] font-bold tabular ${
                GLAZES[i % GLAZES.length]
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] font-bold">{lesson.sarlavha}</span>
              <span className="block truncate text-[13px] text-muted">{lesson.daraja}</span>
            </span>
            <ChevronRight size={20} className="shrink-0 text-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
