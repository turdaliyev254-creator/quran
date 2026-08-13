import Link from "next/link";
import { PlayCircle } from "lucide-react";

interface VideoLesson {
  id: number;
  title: string;
  videoId: string;
}

export default function VideoLessonList({
  videos,
  basePath,
}: {
  videos: VideoLesson[];
  basePath: string;
}) {
  return (
    <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
      {videos.map((v) => (
        <li key={v.id}>
          <Link
            href={`${basePath}/${v.id}`}
            className="flex items-center gap-3 px-3 py-3 active:bg-black/5 dark:active:bg-white/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {v.id}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--tg-text-color)]">
              {v.title}
            </span>
            <PlayCircle size={18} className="shrink-0 text-[var(--tg-hint-color)]" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
