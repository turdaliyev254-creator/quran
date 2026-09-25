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
    <div className="flex flex-1 flex-col gap-4 p-4" style={{ paddingTop: "calc(var(--safe-top) + 16px)" }}>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold">Admin dashboard</h1>
        <AdminLogoutButton />
      </div>

      {!stats.connected && (
        <div className="tile tile-coral rounded-2xl p-4 text-sm font-semibold">
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
              className="tile tile-plain flex items-center gap-3 rounded-[20px] p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-cobalt text-white">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold tabular">{c.value}</p>
                <p className="text-xs text-muted">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted">
        Statistika Telegram Mini App ichida ochilgan foydalanuvchilar asosida hisoblanadi
        (oddiy brauzerda ochilganlar hisobga olinmaydi).
      </p>
    </div>
  );
}
