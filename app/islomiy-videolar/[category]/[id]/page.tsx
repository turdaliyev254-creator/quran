import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import VideoEmbed from "@/components/VideoEmbed";
import islomiyVideolar from "@/data/islomiy-videolar.json";

type CategoryKey = keyof typeof islomiyVideolar;

export default async function IslomiyVideoPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const cat = islomiyVideolar[category as CategoryKey];
  if (!cat) notFound();

  const number = Number(id);
  const video = cat.videolar.find((v) => v.id === number);
  if (!video) notFound();

  const prev = cat.videolar.find((v) => v.id === number - 1);
  const next = cat.videolar.find((v) => v.id === number + 1);

  return (
    <div className="flex flex-1 flex-col pb-4">
      <PageHeader title={cat.sarlavha} subtitle={video.title} backHref="/islomiy-videolar" />

      <div className="flex flex-col gap-4 p-4">
        <VideoEmbed videoId={video.videoId} title={video.title} />

        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Link
              href={`/islomiy-videolar/${category}/${prev.id}`}
              className="flex flex-1 items-center gap-1 rounded-xl bg-[var(--tg-secondary-bg-color)] px-3 py-2.5 text-sm text-[var(--tg-text-color)] active:bg-black/5 dark:active:bg-white/10"
            >
              <ChevronLeft size={16} className="shrink-0 text-[var(--tg-hint-color)]" />
              <span className="truncate">{prev.id}-qism</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/islomiy-videolar/${category}/${next.id}`}
              className="flex flex-1 items-center justify-end gap-1 rounded-xl bg-[var(--tg-secondary-bg-color)] px-3 py-2.5 text-sm text-[var(--tg-text-color)] active:bg-black/5 dark:active:bg-white/10"
            >
              <span className="truncate">{next.id}-qism</span>
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
