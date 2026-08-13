import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[var(--tg-bg-color)]/95 px-4 py-3 backdrop-blur dark:border-white/10">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--tg-hint-color)] active:bg-black/5 dark:active:bg-white/10"
            aria-label="Orqaga"
          >
            <ChevronLeft size={22} />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-[var(--tg-text-color)]">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-[var(--tg-hint-color)]">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
