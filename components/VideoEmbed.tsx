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
        className="tile tile-plain flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold"
      >
        <SquarePlay size={24} className="shrink-0 text-coral" />
        <span>Bu sura uchun video ulanmagan. Rasmiy kanaldan tinglash uchun bosing.</span>
      </a>
    );
  }

  return (
    <div className="tile overflow-hidden rounded-[22px] bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
