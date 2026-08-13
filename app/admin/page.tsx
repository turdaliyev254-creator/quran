import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Users, CalendarDays, TrendingUp } from "lucide-react";
import { ADMIN_COOKIE_NAME, isValidSession } from "@/lib/adminAuth";
import { getStats } from "@/lib/analytics";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSession(session)) redirect("/admin/login");

  const stats = await getStats();

  const cards = [
    { label: "Bugun faol", value: stats.dailyActive, icon: CalendarDays },
    { label: "Bu oy faol", value: stats.monthlyActive, icon: TrendingUp },
    { label: "Jami foydalanuvchi", value: stats.totalUsers, icon: Users },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">Admin dashboard</h1>
        <AdminLogoutButton />
      </div>

      {!stats.connected && (
        <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-600">
          Baza ulanmagan. <code>UPSTASH_REDIS_REST_URL</code> va{" "}
          <code>UPSTASH_REDIS_REST_TOKEN</code> muhit o&apos;zgaruvchilarini sozlang.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="flex items-center gap-3 rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 dark:border-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/10">
                <Icon size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--tg-text-color)]">{c.value}</p>
                <p className="text-xs text-[var(--tg-hint-color)]">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--tg-hint-color)]">
        Statistika Telegram Mini App ichida ochilgan foydalanuvchilar asosida hisoblanadi
        (oddiy brauzerda ochilganlar hisobga olinmaydi).
      </p>
    </div>
  );
}
