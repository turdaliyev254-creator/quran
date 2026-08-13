import PageHeader from "@/components/PageHeader";
import VideoCategoryTabs from "@/components/VideoCategoryTabs";
import islomiyVideolar from "@/data/islomiy-videolar.json";

export const metadata = { title: "Islomiy videolar" };

const categories = Object.values(islomiyVideolar);

export default function IslomiyVideolarPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Islomiy videolar" subtitle="Siyrat va hikoyalar" backHref="/" />
      <VideoCategoryTabs categories={categories} basePath="/islomiy-videolar" />
    </div>
  );
}
