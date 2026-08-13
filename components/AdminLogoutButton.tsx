"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-full bg-[var(--tg-secondary-bg-color)] px-3 py-1.5 text-xs font-medium text-[var(--tg-text-color)]"
    >
      <LogOut size={14} /> Chiqish
    </button>
  );
}
