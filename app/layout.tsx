import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import TelegramInit from "@/components/TelegramInit";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qur'on | Islom ta'limi",
  description:
    "Qur'on tilovati, arab tili va tajvid darslari, hadislar, namoz vaqtlari, kundalik ruhiyat va viktorina — bitta ilovada.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f8a5f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TelegramInit />
        <main className="flex-1 flex flex-col">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
