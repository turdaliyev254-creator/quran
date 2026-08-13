import PageHeader from "@/components/PageHeader";
import PrayerTimesView from "@/components/PrayerTimesView";

export const metadata = { title: "Namoz vaqtlari" };

export default function NamozVaqtlariPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Namoz vaqtlari" backHref="/" />
      <PrayerTimesView />
    </div>
  );
}
