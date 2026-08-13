import { HandHeart, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CopyCardNumber from "@/components/CopyCardNumber";

export const metadata = { title: "Xayriya" };

export default function XayriyaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Xayriya" subtitle="Savobga sherik bo'ling" backHref="/" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-center text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <HandHeart size={26} />
          </div>
          <h2 className="text-lg font-semibold">Loyihaning rivojiga hissa qo&apos;shing</h2>
          <p className="text-sm leading-relaxed text-emerald-50">
            Ushbu ilovani yaratish, yangi darslar va bo&apos;limlar bilan boyitib borish mehnat
            va mablag&apos; talab qiladi. Agar loyihaning rivojlanishiga xayriya qilib, savobga
            sherik bo&apos;lishni istasangiz, quyidagi karta orqali xohlagan miqdorda
            yubortishingiz mumkin. Har bir xayriyangiz uchun Alloh taolodan ajru savoblar
            tilaymiz.
          </p>
        </div>

        <div className="rounded-xl border border-black/5 bg-[var(--tg-secondary-bg-color)] p-4 dark:border-white/5">
          <p className="text-sm leading-relaxed text-[var(--tg-text-color)]">
            &ldquo;Sadaqa mol-mulkni kamaytirmaydi.&rdquo;
          </p>
          <p className="mt-2 text-xs text-[var(--tg-hint-color)]">Muslim rivoyati</p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-5">
          <div className="flex items-center gap-2 text-white/70">
            <CreditCard size={16} />
            <span className="text-xs font-medium">Xayriya kartasi</span>
          </div>
          <CopyCardNumber cardNumber="9860 1901 1206 8985" />
          <p className="text-sm font-medium text-white/90">Izzatbek T.</p>
        </div>

        <p className="text-center text-xs text-[var(--tg-hint-color)]">
          Karta raqamiga bosib nusxalab olishingiz mumkin.
        </p>
      </div>
    </div>
  );
}
