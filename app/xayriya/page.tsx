import Link from "next/link";
import { ChevronRight, HandCoins } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import xayriya from "@/data/xayriya.json";
import { XAYRIYA_ICONS } from "@/lib/xayriya";

export const metadata = { title: "Xayriya" };

export default function XayriyaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Xayriya" subtitle="Yaxshilik ulashing" backHref="/" />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3 rounded-xl bg-emerald-600/10 p-4">
          <HandCoins size={20} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-sm leading-relaxed text-[var(--tg-text-color)]">
            Kategoriyani tanlang, summani belgilang va Payme yoki Click orqali to&apos;lang.
          </p>
        </div>

        <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
          {xayriya.map((c) => {
            const Icon = XAYRIYA_ICONS[c.icon] ?? HandCoins;
            return (
              <li key={c.id}>
                <Link
                  href={`/xayriya/${c.id}`}
                  className="flex items-center gap-3 px-3 py-3 active:bg-black/5 dark:active:bg-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/10">
                    <Icon size={18} className="text-emerald-600" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--tg-text-color)]">
                      {c.sarlavha}
                    </span>
                    <span className="block truncate text-xs text-[var(--tg-hint-color)]">
                      {c.tavsif}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-[var(--tg-hint-color)]" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
