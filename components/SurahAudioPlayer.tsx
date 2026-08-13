"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

interface AudioAyah {
  numberInSurah: number;
  audio?: string;
}

const ACTIVE_CLASS = "ring-2 ring-emerald-500 bg-emerald-500/5";

export default function SurahAudioPlayer({
  surahName,
  ayahs,
}: {
  surahName: string;
  ayahs: AudioAyah[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playable = ayahs.filter((a) => a.audio);

  useEffect(() => {
    let prevEl: HTMLElement | null = null;
    const current = playable[index];
    if (current) {
      const el = document.getElementById(`ayah-${current.numberInSurah}`);
      if (el) {
        el.classList.add(...ACTIVE_CLASS.split(" "));
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        prevEl = el;
      }
    }
    return () => {
      prevEl?.classList.remove(...ACTIVE_CLASS.split(" "));
    };
  }, [index, playable]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, index]);

  if (playable.length === 0) return null;
  const current = playable[index];

  return (
    <div className="sticky bottom-[52px] z-20 mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--tg-bg-color)]/95 p-3 shadow-lg backdrop-blur dark:border-white/10">
      <audio
        ref={audioRef}
        src={current.audio}
        onEnded={() => {
          if (index < playable.length - 1) setIndex((i) => i + 1);
          else setPlaying(false);
        }}
      />
      <button
        onClick={() => {
          hapticImpact();
          setIndex((i) => Math.max(0, i - 1));
        }}
        className="text-[var(--tg-hint-color)] disabled:opacity-30"
        disabled={index === 0}
        aria-label="Oldingi oyat"
      >
        <SkipBack size={18} />
      </button>
      <button
        onClick={() => {
          hapticImpact("medium");
          setPlaying((p) => !p);
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
        aria-label={playing ? "To'xtatish" : "Ijro etish"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
      <button
        onClick={() => {
          hapticImpact();
          setIndex((i) => Math.min(playable.length - 1, i + 1));
        }}
        className="text-[var(--tg-hint-color)] disabled:opacity-30"
        disabled={index === playable.length - 1}
        aria-label="Keyingi oyat"
      >
        <SkipForward size={18} />
      </button>
      <div className="min-w-0 flex-1 text-xs text-[var(--tg-hint-color)]">
        <span className="block truncate font-medium text-[var(--tg-text-color)]">
          {surahName}
        </span>
        <span>
          {current.numberInSurah}-oyat / {ayahs.length}
        </span>
      </div>
    </div>
  );
}
