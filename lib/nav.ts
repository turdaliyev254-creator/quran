import {
  Home,
  BookOpen,
  Clock,
  ScrollText,
  Languages,
  Mic2,
  HeartHandshake,
  HelpCircle,
  Clapperboard,
  HandCoins,
  Menu,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
}

export const HOME_ITEM: NavItem = {
  href: "/",
  label: "Bosh sahifa",
  shortLabel: "Bosh",
  icon: Home,
  description: "Kunlik oyat, hadis va ruhiyat",
};

export const NAV_ITEMS: NavItem[] = [
  HOME_ITEM,
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
    description: "Alifbo, so'zlar va 129 video dars",
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
  {
    href: "/islomiy-videolar",
    label: "Islomiy videolar",
    shortLabel: "Videolar",
    icon: Clapperboard,
    description: "Siyrat seriali va Jannat onalari",
  },
  {
    href: "/xayriya",
    label: "Xayriya",
    shortLabel: "Xayriya",
    icon: HandCoins,
    description: "Masjid, shifoxona, maktab va h.k. uchun xayriya",
  },
];

/** Pastki navigatsiya — scroll shart bo'lmasligi uchun cheklangan sonda. */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  HOME_ITEM,
  NAV_ITEMS.find((i) => i.href === "/quron")!,
  NAV_ITEMS.find((i) => i.href === "/namoz-vaqtlari")!,
  NAV_ITEMS.find((i) => i.href === "/hadislar")!,
  {
    href: "/#bolimlar",
    label: "Ko'proq",
    shortLabel: "Ko'proq",
    icon: Menu,
    description: "Barcha bo'limlar",
  },
];

export interface NavGroup {
  title: string;
  hrefs: string[];
}

/** Bosh sahifadagi bo'limlar tugmalarini guruhlash tartibi. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Qur'on va ta'lim",
    hrefs: ["/quron", "/arab-tili", "/tajvid", "/viktorina"],
  },
  {
    title: "Kundalik hayot",
    hrefs: ["/namoz-vaqtlari", "/hadislar", "/ruhiyat"],
  },
  {
    title: "Multimedia va yordam",
    hrefs: ["/islomiy-videolar", "/xayriya"],
  },
];
