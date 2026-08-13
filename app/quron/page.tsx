import PageHeader from "@/components/PageHeader";
import SurahList from "@/components/SurahList";
import { getSurahList } from "@/lib/quranApi";

export const metadata = { title: "Qur'on suralari" };

export default async function QuronPage() {
  const surahs = await getSurahList();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Qur'oni Karim" subtitle="114 sura" backHref="/" />
      <SurahList surahs={surahs} />
    </div>
  );
}
