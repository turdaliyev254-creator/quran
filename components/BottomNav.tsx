"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/lib/nav";
import { hapticSelect } from "@/lib/telegram";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Asosiy navigatsiya"
      className="sticky bottom-0 z-30 border-t border-line bg-ground/90 backdrop-blur-md"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 items-end px-2 pt-2 pb-1.5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          const isAi = item.href === "/ai-qidiruv";
          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                onClick={hapticSelect}
                aria-current={active ? "page" : undefined}
                className={`press flex min-h-[60px] w-full flex-col items-center justify-center gap-1 rounded-2xl text-[12px] font-semibold ${
                  isAi ? "" : active ? "text-cobalt" : "text-muted"
                }`}
              >
                {isAi ? (
                  <span
                    className={`tile tile-cobalt -mt-7 flex h-[58px] w-[58px] items-center justify-center rounded-[20px] ${
                      active ? "ring-4 ring-gold" : ""
                    }`}
                  >
                    <Icon size={28} strokeWidth={2.3} className="text-gold" />
                  </span>
                ) : (
                  <span
                    className={`flex h-9 w-14 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-cobalt/12" : ""
                    }`}
                  >
                    <Icon size={26} strokeWidth={active ? 2.4 : 2} />
                  </span>
                )}
                <span className={`leading-none ${isAi ? "text-ink" : ""}`}>{item.shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
