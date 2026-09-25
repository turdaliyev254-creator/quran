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
        subtitle={video.title.replace(/\s*\|\s*\d+-dars\s*$/, "")}
        backHref="/arab-tili"
      />

      <div className="flex flex-col gap-4 p-4">
        <VideoEmbed videoId={video.videoId} title={video.title} />

        <div className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/arab-tili/video/${prev.id}`}
              className="press tile tile-plain flex min-h-[56px] items-center gap-1 rounded-2xl px-3 text-[15px] font-bold"
            >
              <ChevronLeft size={20} className="shrink-0 text-muted" />
              {prev.id}-dars
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/arab-tili/video/${next.id}`}
              className="press tile tile-cobalt flex min-h-[56px] items-center justify-end gap-1 rounded-2xl px-3 text-[15px] font-bold"
            >
              {next.id}-dars
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
