import { SquarePlay } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@AlQuranuz";

export default function VideoEmbed({
  videoId,
  title,
}: {
  videoId: string | null;
  title: string;
}) {
  if (!videoId) {
    return (
      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-dashed border-black/10 bg-[var(--tg-secondary-bg-color)] p-4 text-sm text-[var(--tg-hint-color)] dark:border-white/10"
      >
        <SquarePlay size={22} className="shrink-0 text-red-500" />
        <span>
          Bu sura uchun video hali ulanmagan. Shayx Alijon Qori rasmiy kanalidan tinglash uchun
          bosing.
        </span>
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${title} — Shayx Alijon Qori tilovati`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
