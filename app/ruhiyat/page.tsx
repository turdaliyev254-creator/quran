import PageHeader from "@/components/PageHeader";
import RuhiyatView from "@/components/RuhiyatView";
import ruhiyat from "@/data/ruhiyat.json";

export const metadata = { title: "Kundalik ruhiyat" };

export default function RuhiyatPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Kundalik ruhiyat" subtitle="Har kunga bir ibrat" backHref="/" />
      <RuhiyatView entries={ruhiyat} />
    </div>
  );
}
