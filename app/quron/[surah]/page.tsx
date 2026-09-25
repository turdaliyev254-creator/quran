import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import VideoEmbed from "@/components/VideoEmbed";
import SurahAudioPlayer from "@/components/SurahAudioPlayer";
import { getSurahDetail } from "@/lib/quranApi";
import videos from "@/data/videos.json";
import yodlash from "@/data/yodlash.json";
import YodlashVideos from "@/components/YodlashVideos";

export default async function SurahPage({
  params,
}: {
  params: Promise<{ surah: string }>;
}) {
  const { surah } = await params;
  const number = Number(surah);
  if (!Number.isInteger(number) || number < 1 || number > 114) notFound();

  const detail = await getSurahDetail(number);
  const videoId = (videos as Record<string, string | null>)[String(number)] ?? null;
  const yodlashVideos = (yodlash as Record<string, { title: string; videoId: string }[]>)[String(number)];

  return (
    <div className="flex flex-1 flex-col pb-4">
      <PageHeader
        title={detail.englishName}
        subtitle={`${detail.englishNameTranslation} · ${detail.numberOfAyahs} oyat`}
        backHref="/quron"
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="tile tile-turquoise khatam flex flex-col items-center gap-1 px-5 py-7 text-center">
          <p className="font-kufi text-[52px] leading-tight">{detail.name}</p>
          <p className="text-sm font-bold text-ink-fixed/75">
            {detail.revelationType === "Meccan" ? "Makkiy sura" : "Madaniy sura"}
          </p>
        </div>

        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-base font-bold">Shayx Alijon Qori tilovati</h2>
          <VideoEmbed videoId={videoId} title={detail.englishName} />
        </section>

        {yodlashVideos && yodlashVideos.length > 0 && (
          <YodlashVideos videos={yodlashVideos} surahName={detail.englishName} />
        )}

        <section className="flex flex-col gap-3">
          {detail.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              className="tile tile-plain rounded-[22px] p-4 transition-shadow"
            >
              <span className="font-display flex h-8 min-w-8 items-center justify-center self-start rounded-[10px] bg-gold px-2 text-xs font-bold text-ink-fixed tabular">
                {ayah.numberInSurah}
              </span>
              <p className="font-arabic mt-3 text-right text-[28px] leading-[2.1]">{ayah.text}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{ayah.translation}</p>
            </div>
          ))}
        </section>
      </div>

      <SurahAudioPlayer surahName={detail.englishName} ayahs={detail.ayahs} />
    </div>
  );
}
