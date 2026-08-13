import PageHeader from "@/components/PageHeader";
import LessonList from "@/components/LessonList";
import lessons from "@/data/arab-tili.json";

export const metadata = { title: "Arab tili darslari" };

export default function ArabTiliPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Arab tili darslari" subtitle={`${lessons.length} ta dars`} backHref="/" />
      <LessonList lessons={lessons} basePath="/arab-tili" />
    </div>
  );
}
