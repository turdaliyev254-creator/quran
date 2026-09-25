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
      <div className="tile tile-cobalt flex h-14 w-14 items-center justify-center rounded-[18px]">
        <Lock size={26} className="text-gold" />
      </div>
      <h1 className="font-display text-xl font-extrabold">Admin panel</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          autoFocus
          className="rounded-2xl bg-surface px-4 py-3.5 text-[16px] shadow-[inset_0_0_0_1px_var(--line)] outline-none focus:ring-4 focus:ring-gold"
        />
        {error && <p className="text-center text-sm font-semibold text-coral">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="press tile tile-cobalt min-h-[52px] rounded-2xl font-display text-base font-bold disabled:opacity-50"
        >
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
