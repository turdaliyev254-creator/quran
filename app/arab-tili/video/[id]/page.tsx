import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import VideoEmbed from "@/components/VideoEmbed";
import videos from "@/data/arab-tili-videolar.json";

export default async function ArabTiliVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const number = Number(id);
  const video = videos.find((v) => v.id === number);
  if (!video) notFound();

  const prev = videos.find((v) => v.id === number - 1);
  const next = videos.find((v) => v.id === number + 1);

  return (
    <div className="flex flex-1 flex-col pb-4">
      <PageHeader
        title={`${video.id}-dars`}
        subtitle={video.title}
        backHref="/arab-tili"
      />

      <div className="flex flex-col gap-4 p-4">
        <VideoEmbed videoId={video.videoId} title={video.title} />

        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Link
              href={`/arab-tili/video/${prev.id}`}
              className="flex flex-1 items-center gap-1 rounded-xl bg-[var(--tg-secondary-bg-color)] px-3 py-2.5 text-sm text-[var(--tg-text-color)] active:bg-black/5 dark:active:bg-white/10"
            >
              <ChevronLeft size={16} className="shrink-0 text-[var(--tg-hint-color)]" />
              <span className="truncate">{prev.id}-dars</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/arab-tili/video/${next.id}`}
              className="flex flex-1 items-center justify-end gap-1 rounded-xl bg-[var(--tg-secondary-bg-color)] px-3 py-2.5 text-sm text-[var(--tg-text-color)] active:bg-black/5 dark:active:bg-white/10"
            >
              <span className="truncate">{next.id}-dars</span>
              <ChevronRight size={16} className="shrink-0 text-[var(--tg-hint-color)]" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
}
