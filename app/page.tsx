import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS, NAV_GROUPS } from "@/lib/nav";
import hadislar from "@/data/hadislar.json";
import ruhiyat from "@/data/ruhiyat.json";

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export default function Home() {
  const hadithOfDay = hadislar[dayOfYear() % hadislar.length];
  const ruhiyatDay = ((new Date().getDate() - 1) % ruhiyat.length) + 1;
  const ruhiyatOfDay = ruhiyat.find((r) => r.day === ruhiyatDay) ?? ruhiyat[0];

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pb-6">
      <header className="pt-2">
        <p className="text-sm text-[var(--tg-hint-color)]">Assalomu alaykum</p>
        <h1 className="text-2xl font-semibold text-[var(--tg-text-color)]">
          Islom ta&apos;limi ilovasi
        </h1>
      </header>

      <Link
        href="/ruhiyat"
        className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white active:opacity-90"
      >
        <span className="mb-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
          Bugungi ruhiyat
        </span>
        <h2 className="text-base font-semibold">{ruhiyatOfDay.sarlavha}</h2>
        <p className="mt-1.5 line-clamp-2 text-sm text-emerald-50">{ruhiyatOfDay.matn}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-50">
          Batafsil <ChevronRight size={14} />
        </span>
      </Link>

      <Link
        href="/hadislar"
        className="rounded-2xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-5 active:bg-black/5 dark:border-white/5 dark:active:bg-white/10"
      >
        <span className="mb-1 inline-block rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
          Kunning hadisi
        </span>
        <p className="text-sm leading-relaxed text-[var(--tg-text-color)]">
          {hadithOfDay.matn}
        </p>
        <p className="mt-2 text-xs text-[var(--tg-hint-color)]">{hadithOfDay.manba}</p>
      </Link>

      <div id="bolimlar" className="flex flex-col gap-5 scroll-mt-4">
        {NAV_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-sm font-semibold text-[var(--tg-hint-color)]">
              {group.title}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {group.hrefs.map((href) => {
                const item = NAV_ITEMS.find((i) => i.href === href);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col gap-2 rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 active:bg-black/5 dark:border-white/5 dark:active:bg-white/10"
                  >
                    <Icon size={22} className="text-emerald-600" />
                    <span className="text-sm font-medium text-[var(--tg-text-color)]">
                      {item.label}
                    </span>
                    <span className="text-xs leading-snug text-[var(--tg-hint-color)]">
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
