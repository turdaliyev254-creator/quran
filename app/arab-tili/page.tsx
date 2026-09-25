import Link from "next/link";
import { BookA, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ArabTiliTabs from "@/components/ArabTiliTabs";
import lessons from "@/data/arab-tili.json";
import videos from "@/data/arab-tili-videolar.json";

export const metadata = { title: "Arab tili darslari" };

export default function ArabTiliPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Arab tili"
        subtitle={`${videos.length} video dars · ${lessons.length} yozma dars`}
        backHref="/"
      />

      <div className="px-4 pt-4">
        <Link
          href="/lugat"
          className="press tile tile-gold khatam flex items-center gap-3 rounded-[22px] p-4"
          style={{ "--khatam-opacity": 0.11 } as React.CSSProperties}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-ink text-gold">
            <BookA size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-display block text-base font-bold">Arab–o&apos;zbek lug&apos;ati</span>
            <span className="block text-[13px] font-semibold text-ink-fixed/75">So&apos;z qidiring va eshiting</span>
          </span>
          <ArrowUpRight size={22} />
        </Link>
      </div>

      <ArabTiliTabs lessons={lessons} videos={videos} />
    </div>
  );
}
