"use client";

import { useState } from "react";
import LessonList from "@/components/LessonList";
import VideoLessonList from "@/components/VideoLessonList";
import { hapticSelect } from "@/lib/telegram";
import type { Lesson } from "@/lib/lessons";

interface VideoLesson {
  id: number;
  title: string;
  videoId: string;
}

export default function ArabTiliTabs({
  lessons,
  videos,
}: {
  lessons: Lesson[];
  videos: VideoLesson[];
}) {
  const [tab, setTab] = useState<"darslar" | "video">("darslar");

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-2 rounded-full bg-[var(--tg-secondary-bg-color)] p-1">
        {(
          [
            { key: "darslar", label: "Darslar" },
            { key: "video", label: `Video darslar (${videos.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              hapticSelect();
              setTab(t.key);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-emerald-600 text-white"
                : "text-[var(--tg-hint-color)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "darslar" ? (
        <LessonList lessons={lessons} basePath="/arab-tili" />
      ) : (
        <VideoLessonList videos={videos} basePath="/arab-tili/video" />
      )}
    </div>
  );
}
