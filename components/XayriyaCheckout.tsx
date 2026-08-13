"use client";

import { useState } from "react";
import { PRESET_AMOUNTS, formatSom } from "@/lib/xayriya";
import { hapticImpact, hapticSelect } from "@/lib/telegram";

export default function XayriyaCheckout({ categoryId }: { categoryId: string }) {
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS[2]);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState<"payme" | "click" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function pay(method: "payme" | "click") {
    if (!effectiveAmount || effectiveAmount <= 0) return;
    hapticImpact("medium");
    setLoading(method);
    setError(null);
    try {
      const res = await fetch("/api/xayriya/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, amount: effectiveAmount, method }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "To'lov tizimi hali ulanmagan");
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--tg-text-color)]">Summani tanlang</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => {
                hapticSelect();
                setAmount(a);
                setCustomAmount("");
              }}
              className={`rounded-xl py-2.5 text-sm font-medium ${
                !customAmount && amount === a
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--tg-secondary-bg-color)] text-[var(--tg-text-color)]"
              }`}
            >
              {formatSom(a)}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Boshqa summa (so'm)"
          className="mt-2 w-full rounded-xl border border-black/10 bg-[var(--tg-secondary-bg-color)] px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 p-3 text-center text-xs text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => pay("payme")}
          disabled={loading !== null || !effectiveAmount}
          className="rounded-full bg-[#00c8ac] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading === "payme" ? "Kutilmoqda..." : `Payme orqali ${formatSom(effectiveAmount || 0)} to'lash`}
        </button>
        <button
          onClick={() => pay("click")}
          disabled={loading !== null || !effectiveAmount}
          className="rounded-full bg-[#0080ff] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading === "click" ? "Kutilmoqda..." : `Click orqali ${formatSom(effectiveAmount || 0)} to'lash`}
        </button>
      </div>
    </div>
  );
}
