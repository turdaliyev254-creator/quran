import Link from "next/link";
import { Play } from "lucide-react";

interface VideoLesson {
  id: number;
  title: string;
  videoId: string;
}

const GLAZES = [
  "bg-turquoise text-ink-fixed",
  "bg-gold text-ink-fixed",
  "bg-coral text-ink-fixed",
  "bg-plum text-white",
  "bg-cobalt text-white",
];

/** "Arab tili alifbosi | 1-dars" -> "Arab tili alifbosi" */
function cleanTitle(title: string) {
  return title.replace(/\s*\|\s*\d+-dars\s*$/, "").replace(/\s*\d+-dars\s*$/, "");
}

export default function VideoLessonList({
  videos,
  basePath,
  numbered = true,
}: {
  videos: VideoLesson[];
  basePath: string;
  numbered?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {videos.map((v) => (
        <li key={v.id}>
          <Link
            href={`${basePath}/${v.id}`}
            className="press tile tile-plain flex items-center gap-3 rounded-[20px] p-3"
          >
            <span
              className={`font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-[15px] font-bold tabular ${
                GLAZES[(v.id - 1) % GLAZES.length]
              }`}
            >
              {numbered ? v.id : <Play size={18} />}
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug">
              {cleanTitle(v.title)}
            </span>
            <Play size={18} className="shrink-0 text-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
