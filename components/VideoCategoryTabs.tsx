"use client";

import { useState } from "react";
import VideoLessonList from "@/components/VideoLessonList";
import { hapticSelect } from "@/lib/telegram";

interface VideoItem {
  id: number;
  title: string;
  videoId: string;
}

interface Category {
  id: string;
  sarlavha: string;
  tavsif: string;
  videolar: VideoItem[];
}

export default function VideoCategoryTabs({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  const [active, setActive] = useState(categories[0]?.id);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-2 rounded-full bg-[var(--tg-secondary-bg-color)] p-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              hapticSelect();
              setActive(c.id);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              active === c.id ? "bg-emerald-600 text-white" : "text-[var(--tg-hint-color)]"
            }`}
          >
            {c.sarlavha}
          </button>
        ))}
      </div>

      {current && (
        <>
          <p className="text-sm text-[var(--tg-hint-color)]">{current.tavsif}</p>
          <VideoLessonList videos={current.videolar} basePath={`${basePath}/${current.id}`} />
        </>
      )}
    </div>
  );
}
