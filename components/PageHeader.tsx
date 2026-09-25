import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <header
      className="sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur-md"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Orqaga"
            className="press tile-plain flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          >
            <ArrowLeft size={22} />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="font-display truncate text-lg font-bold leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
