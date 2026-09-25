import PageHeader from "@/components/PageHeader";
import AiSearchView from "@/components/AiSearchView";

export const metadata = { title: "AI qidiruv" };

export default async function AiQidiruvPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initial = (Array.isArray(q) ? q[0] : q)?.slice(0, 500);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="AI qidiruv" subtitle="Qur'on va sahih hadis asosida" backHref="/" />
      <AiSearchView initialQuestion={initial} />
    </div>
  );
}
