import PageHeader from "@/components/PageHeader";
import LessonList from "@/components/LessonList";
import lessons from "@/data/tajvid.json";

export const metadata = { title: "Tajvid darslari" };

export default function TajvidPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Tajvid darslari" subtitle={`${lessons.length} ta dars`} backHref="/" />
      <div className="p-4">
        <LessonList lessons={lessons} basePath="/tajvid" />
      </div>
    </div>
  );
}
