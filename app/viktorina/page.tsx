import PageHeader from "@/components/PageHeader";
import QuizEngine from "@/components/QuizEngine";
import questions from "@/data/viktorina.json";

export const metadata = { title: "Viktorina" };

export default function ViktorinaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Viktorina" subtitle="Bilimingizni sinang" backHref="/" />
      <QuizEngine questions={questions} />
    </div>
  );
}
