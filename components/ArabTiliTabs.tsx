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
  const [tab, setTab] = useState<"video" | "darslar">("video");

  const tabs = [
    { key: "video", label: `Video darslar` },
    { key: "darslar", label: "Yozma darslar" },
  ] as const;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        role="tablist"
        aria-label="Dars turi"
        className="grid grid-cols-2 gap-1.5 rounded-[20px] bg-surface-2 p-1.5"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              hapticSelect();
              setTab(t.key);
            }}
            className={`press min-h-[48px] rounded-[15px] text-[15px] font-bold transition-colors ${
              tab === t.key ? "tile tile-cobalt" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "video" ? (
        <VideoLessonList videos={videos} basePath="/arab-tili/video" />
      ) : (
        <LessonList lessons={lessons} basePath="/arab-tili" />
      )}
    </div>
  );
}
