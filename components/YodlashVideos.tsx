"use client";

import { useState } from "react";
import VideoEmbed from "@/components/VideoEmbed";
import { hapticSelect } from "@/lib/telegram";

interface YodlashVideo {
  title: string;
  videoId: string;
}

export default function YodlashVideos({
  videos,
  surahName,
}: {
  videos: YodlashVideo[];
  surahName: string;
}) {
  const [active, setActive] = useState(0);
  const current = videos[active];

  return (
    <section className="flex flex-col gap-3" aria-label="Yodlash videolari">
      <h2 className="font-display text-base font-bold">Yodlash uchun videolar</h2>
      <div className="tile tile-plum flex flex-col gap-3 rounded-[24px] p-3">
        <VideoEmbed videoId={current.videoId} title={`${surahName} — yodlash, ${current.title}`} />
        {videos.length > 1 && (
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist">
            {videos.map((v, i) => (
              <button
                key={v.videoId}
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  hapticSelect();
                  setActive(i);
                }}
                className={`press min-h-[44px] shrink-0 rounded-full px-4 text-[14px] font-bold ${
                  i === active ? "bg-gold text-ink-fixed" : "bg-white/18 text-white"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
