import PageHeader from "@/components/PageHeader";
import HadithBrowser from "@/components/HadithBrowser";
import hadislar from "@/data/hadislar.json";

export const metadata = { title: "Hadislar" };

export default function HadislarPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Hadislar" subtitle={`${hadislar.length} ta tanlangan hadis`} backHref="/" />
      <HadithBrowser hadislar={hadislar} />
    </div>
  );
}
