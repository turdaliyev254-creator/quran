import type { Metadata, Viewport } from "next";
import { Onest, Unbounded, Noto_Naskh_Arabic, Reem_Kufi } from "next/font/google";
import TelegramInit from "@/components/TelegramInit";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const onest = Onest({
  variable: "--f-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--f-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--f-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const reemKufi = Reem_Kufi({
  variable: "--f-kufi",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Qur'on va arab tili",
  description:
    "AI qidiruv, Qur'on tilovati, arab tili video darslari, arab–o'zbek lug'ati va so'z o'yini — bitta ilovada.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2149f0",
};

const CONTRACT = `<!--
THESIS: Registan majolikasi — har bo'lim shishalangan plitka; AI, Qur'on, arab tili eng katta plitkalar. Refuses: bir xil ikonka-kartalar ro'yxati.
OWN-WORLD: sovuq oq-ko'k shisha ground, kobalt/firuza/oltin/marjon/binafsha glazuralar, xatam yulduz naqshi, Unbounded + Onest + Reem Kufi.
STORY: yosh foydalanuvchi savol beradi, Qur'on o'qiydi, arab so'zini o'yinda o'zlashtiradi.
FIRST VIEWPORT: AI plitkasi (kobalt, to'liq kenglik, savol maydoni), ostida Qur'on (firuza) va Arab tili (oltin) plitkalari, so'ng so'z o'yini.
FORM: majolika plitka mozaikasi (roll #4), seed fe73e713.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${onest.variable} ${unbounded.variable} ${notoNaskhArabic.variable} ${reemKufi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <TelegramInit />
        <main className="flex flex-1 flex-col">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
