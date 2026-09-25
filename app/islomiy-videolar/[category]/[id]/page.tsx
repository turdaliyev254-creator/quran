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

        <div className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/islomiy-videolar/${category}/${prev.id}`}
              className="press tile tile-plain flex min-h-[56px] items-center gap-1 rounded-2xl px-3 text-[15px] font-bold"
            >
              <ChevronLeft size={20} className="shrink-0 text-muted" />
              {prev.id}-qism
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/islomiy-videolar/${category}/${next.id}`}
              className="press tile tile-plum flex min-h-[56px] items-center justify-end gap-1 rounded-2xl px-3 text-[15px] font-bold"
            >
              {next.id}-qism
              <ChevronRight size={20} className="shrink-0" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
