"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/lib/nav";
import { hapticSelect } from "@/lib/telegram";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-black/5 bg-[var(--tg-bg-color,#ffffff)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)] dark:border-white/10">
      <ul className="flex">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                onClick={hapticSelect}
                className={`flex flex-col items-center justify-center gap-1.5 py-3.5 text-[13px] font-medium transition-colors active:bg-black/5 dark:active:bg-white/10 ${
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <Icon size={26} strokeWidth={active ? 2.4 : 2} />
                <span className="leading-none">{item.shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
