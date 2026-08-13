import PageHeader from "@/components/PageHeader";
import AiSearchView from "@/components/AiSearchView";

export const metadata = { title: "AI qidiruv" };

export default function AiQidiruvPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="AI qidiruv" subtitle="Qur'on va sahih hadis asosida" backHref="/" />
      <AiSearchView />
    </div>
  );
}
