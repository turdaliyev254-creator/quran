"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

interface AudioAyah {
  numberInSurah: number;
  audio?: string;
}

const ACTIVE_CLASSES = ["ring-4", "ring-gold"];

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
    let el: HTMLElement | null = null;
    const current = playable[index];
    if (current && playing) {
      el = document.getElementById(`ayah-${current.numberInSurah}`);
      if (el) {
        el.classList.add(...ACTIVE_CLASSES);
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    return () => {
      el?.classList.remove(...ACTIVE_CLASSES);
    };
  }, [index, playing, playable]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, index]);

  if (playable.length === 0) return null;
  const current = playable[index];

  return (
    <div
      className="sticky z-20 mx-4 mb-3"
      style={{ bottom: "calc(var(--safe-bottom) + 86px)" }}
    >
      <div className="tile tile-cobalt flex items-center gap-3 rounded-[24px] p-3">
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
          className="press flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40"
          disabled={index === 0}
          aria-label="Oldingi oyat"
        >
          <SkipBack size={22} />
        </button>
        <button
          onClick={() => {
            hapticImpact("medium");
            setPlaying((p) => !p);
          }}
          className="press tile tile-gold flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
          aria-label={playing ? "To'xtatish" : "Ijro etish"}
        >
          {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <button
          onClick={() => {
            hapticImpact();
            setIndex((i) => Math.min(playable.length - 1, i + 1));
          }}
          className="press flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40"
          disabled={index === playable.length - 1}
          aria-label="Keyingi oyat"
        >
          <SkipForward size={22} />
        </button>
        <div className="min-w-0 flex-1 text-right">
          <span className="font-display block truncate text-sm font-bold">{surahName}</span>
          <span className="text-xs text-white/80 tabular">
            {current.numberInSurah}-oyat / {ayahs.length}
          </span>
        </div>
      </div>
    </div>
  );
}
