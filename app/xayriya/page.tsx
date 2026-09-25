import { HandHeart, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CopyCardNumber from "@/components/CopyCardNumber";

export const metadata = { title: "Xayriya" };

export default function XayriyaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Xayriya" subtitle="Savobga sherik bo'ling" backHref="/" />

      <div className="flex flex-col gap-4 p-4">
        <div
          className="tile tile-turquoise khatam flex flex-col gap-3 rounded-[26px] p-6"
          style={{ "--khatam-opacity": 0.11 } as React.CSSProperties}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-ink text-gold">
            <HandHeart size={28} />
          </div>
          <h2 className="font-display text-[24px] font-extrabold leading-tight">
            Loyihaning rivojiga hissa qo&apos;shing
          </h2>
          <p className="text-[15px] leading-relaxed">
            Ushbu ilovani yaratish, yangi darslar va bo&apos;limlar bilan boyitib borish mehnat va
            mablag&apos; talab qiladi. Loyihaning rivojlanishiga xayriya qilib, savobga sherik
            bo&apos;lishni istasangiz, quyidagi karta orqali xohlagan miqdorda yuboring. Har bir
            xayriyangiz uchun Alloh taolodan ajru savoblar tilaymiz.
          </p>
        </div>

        <div className="tile tile-plain rounded-[22px] p-4">
          <p className="text-[17px] font-semibold leading-relaxed">
            &ldquo;Sadaqa mol-mulkni kamaytirmaydi.&rdquo;
          </p>
          <p className="mt-2 text-[13px] font-semibold text-muted">Muslim rivoyati</p>
        </div>

        <div className="tile tile-cobalt khatam flex flex-col gap-3 rounded-[26px] p-5" style={{ "--khatam-opacity": 0.13 } as React.CSSProperties}>
          <div className="flex items-center gap-2 text-white/85">
            <CreditCard size={18} />
            <span className="text-sm font-bold">Xayriya kartasi</span>
          </div>
          <CopyCardNumber cardNumber="9860 1901 1206 8985" />
          <p className="font-display text-base font-bold">Izzatbek T.</p>
        </div>

        <p className="text-center text-[13px] text-muted">Karta raqamiga bosib nusxalab oling.</p>
      </div>
    </div>
  );
}
