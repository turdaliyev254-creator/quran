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
      className="press tile tile-plain flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
    >
      <LogOut size={14} /> Chiqish
    </button>
  );
}
