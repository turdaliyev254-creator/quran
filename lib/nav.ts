import {
  Home,
  BookOpen,
  Clock,
  ScrollText,
  Languages,
  Mic2,
  HeartHandshake,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Bosh sahifa",
    shortLabel: "Bosh",
    icon: Home,
    description: "Kunlik oyat, hadis va ruhiyat",
  },
  {
    href: "/quron",
    label: "Qur'on",
    shortLabel: "Qur'on",
    icon: BookOpen,
    description: "114 sura, tarjima va tilovat",
  },
  {
    href: "/namoz-vaqtlari",
    label: "Namoz vaqtlari",
    shortLabel: "Namoz",
    icon: Clock,
    description: "Kunlik namoz vaqtlari",
  },
  {
    href: "/hadislar",
    label: "Hadislar",
    shortLabel: "Hadis",
    icon: ScrollText,
    description: "Tanlangan hadislar",
  },
  {
    href: "/arab-tili",
    label: "Arab tili darslari",
    shortLabel: "Arabcha",
    icon: Languages,
    description: "Alifbo va asosiy darslar",
  },
  {
    href: "/tajvid",
    label: "Tajvid darslari",
    shortLabel: "Tajvid",
    icon: Mic2,
    description: "To'g'ri tilovat qoidalari",
  },
  {
    href: "/ruhiyat",
    label: "Kundalik ruhiyat",
    shortLabel: "Ruhiyat",
    icon: HeartHandshake,
    description: "Har kunlik ibrat va duo",
  },
  {
    href: "/viktorina",
    label: "Viktorina",
    shortLabel: "Test",
    icon: HelpCircle,
    description: "Bilimingizni sinab ko'ring",
  },
];
