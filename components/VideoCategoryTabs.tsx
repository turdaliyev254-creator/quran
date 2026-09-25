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
    <div className="flex flex-col gap-4 p-4">
      <div
        role="tablist"
        aria-label="Kategoriya"
        className="grid grid-cols-2 gap-1.5 rounded-[20px] bg-surface-2 p-1.5"
      >
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={active === c.id}
            onClick={() => {
              hapticSelect();
              setActive(c.id);
            }}
            className={`press min-h-[52px] rounded-[15px] px-2 text-[14px] font-bold leading-tight transition-colors ${
              active === c.id ? "tile tile-plum" : "text-muted"
            }`}
          >
            {c.sarlavha}
          </button>
        ))}
      </div>

      {current && (
        <>
          <p className="text-[15px] text-muted">{current.tavsif}</p>
          <VideoLessonList
            videos={current.videolar}
            basePath={`${basePath}/${current.id}`}
          />
        </>
      )}
    </div>
  );
}
