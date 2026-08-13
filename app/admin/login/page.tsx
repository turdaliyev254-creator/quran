"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Xatolik yuz berdi");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/10">
        <Lock size={24} className="text-emerald-600" />
      </div>
      <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">Admin panel</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          autoFocus
          className="rounded-xl border border-black/10 bg-[var(--tg-secondary-bg-color)] px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-white/10"
        />
        {error && <p className="text-center text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-full bg-emerald-600 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
