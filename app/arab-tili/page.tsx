import PageHeader from "@/components/PageHeader";
import ArabTiliTabs from "@/components/ArabTiliTabs";
import lessons from "@/data/arab-tili.json";
import videos from "@/data/arab-tili-videolar.json";

export const metadata = { title: "Arab tili darslari" };

export default function ArabTiliPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Arab tili darslari"
        subtitle={`${lessons.length} yozma dars · ${videos.length} video dars`}
        backHref="/"
      />
      <ArabTiliTabs lessons={lessons} videos={videos} />
    </div>
  );
}
