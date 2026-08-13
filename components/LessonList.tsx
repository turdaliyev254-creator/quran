import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lesson } from "@/lib/lessons";

export default function LessonList({
  lessons,
  basePath,
}: {
  lessons: Lesson[];
  basePath: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
        {lessons.map((lesson, i) => (
          <li key={lesson.id}>
            <Link
              href={`${basePath}/${lesson.id}`}
              className="flex items-center gap-3 px-3 py-3 active:bg-black/5 dark:active:bg-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--tg-text-color)]">
                  {lesson.sarlavha}
                </span>
                <span className="block truncate text-xs text-[var(--tg-hint-color)]">
                  {lesson.daraja}
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-[var(--tg-hint-color)]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
