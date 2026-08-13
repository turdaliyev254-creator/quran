import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import LessonDetail from "@/components/LessonDetail";
import lessons from "@/data/tajvid.json";

export default async function TajvidDarsPage({
  params,
}: {
  params: Promise<{ dars: string }>;
}) {
  const { dars } = await params;
  const lesson = lessons.find((l) => l.id === dars);
  if (!lesson) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title={lesson.sarlavha} backHref="/tajvid" />
      <LessonDetail lesson={lesson} />
    </div>
  );
}
