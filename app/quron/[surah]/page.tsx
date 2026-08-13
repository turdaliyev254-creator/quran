import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import VideoEmbed from "@/components/VideoEmbed";
import SurahAudioPlayer from "@/components/SurahAudioPlayer";
import { getSurahDetail } from "@/lib/quranApi";
import videos from "@/data/videos.json";

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

  return (
    <div className="flex flex-1 flex-col pb-4">
      <PageHeader
        title={detail.englishName}
        subtitle={`${detail.englishNameTranslation} · ${detail.numberOfAyahs} oyat`}
        backHref="/quron"
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-center text-white">
          <p className="font-arabic text-3xl">{detail.name}</p>
          <p className="mt-1 text-xs text-emerald-100">
            {detail.revelationType === "Meccan" ? "Makkiy sura" : "Madaniy sura"}
          </p>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-[var(--tg-hint-color)]">
            Shayx Alijon Qori tilovati
          </h2>
          <VideoEmbed videoId={videoId} title={detail.englishName} />
        </section>

        <section className="flex flex-col gap-3">
          {detail.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              className="rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 transition-colors dark:border-white/5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/10 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {ayah.numberInSurah}
                </span>
              </div>
              <p className="font-arabic text-right text-2xl leading-loose text-[var(--tg-text-color)]">
                {ayah.text}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--tg-hint-color)]">
                {ayah.translation}
              </p>
            </div>
          ))}
        </section>
      </div>

      <SurahAudioPlayer surahName={detail.englishName} ayahs={detail.ayahs} />
    </div>
  );
}
