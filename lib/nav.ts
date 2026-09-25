import {
  Home,
  BookOpen,
  Clock,
  ScrollText,
  Languages,
  BookA,
  Clapperboard,
  HandHeart,
  Sparkles,
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
  description: "Savol, Qur'on va so'z o'yini",
};

export const QURAN_ITEM: NavItem = {
  href: "/quron",
  label: "Qur'on",
  shortLabel: "Qur'on",
  icon: BookOpen,
  description: "114 sura, tarjima va tilovat",
};

export const AI_ITEM: NavItem = {
  href: "/ai-qidiruv",
  label: "AI qidiruv",
  shortLabel: "AI",
  icon: Sparkles,
  description: "Qur'on va sahih hadis asosida javob",
};

export const ARAB_ITEM: NavItem = {
  href: "/arab-tili",
  label: "Arab tili",
  shortLabel: "Arab tili",
  icon: Languages,
  description: "Yozma va 129 video dars",
};

export const LUGAT_ITEM: NavItem = {
  href: "/lugat",
  label: "Lug'at",
  shortLabel: "Lug'at",
  icon: BookA,
  description: "Arab–o'zbek lug'ati",
};

export const NAMOZ_ITEM: NavItem = {
  href: "/namoz-vaqtlari",
  label: "Namoz vaqtlari",
  shortLabel: "Namoz",
  icon: Clock,
  description: "Kunlik namoz vaqtlari",
};

export const HADIS_ITEM: NavItem = {
  href: "/hadislar",
  label: "Hadislar",
  shortLabel: "Hadis",
  icon: ScrollText,
  description: "Tanlangan hadislar",
};

export const VIDEO_ITEM: NavItem = {
  href: "/islomiy-videolar",
  label: "Islomiy videolar",
  shortLabel: "Videolar",
  icon: Clapperboard,
  description: "Siyrat seriali va Jannat onalari",
};

export const XAYRIYA_ITEM: NavItem = {
  href: "/xayriya",
  label: "Xayriya",
  shortLabel: "Xayriya",
  icon: HandHeart,
  description: "Loyihaning rivojiga hissa qo'shing",
};

/** Pastki navigatsiya: markazda AI. */
export const BOTTOM_NAV_ITEMS: NavItem[] = [HOME_ITEM, QURAN_ITEM, AI_ITEM, ARAB_ITEM, LUGAT_ITEM];

/** Bosh sahifadagi ikkinchi darajali bo'limlar. */
export const MORE_ITEMS: NavItem[] = [NAMOZ_ITEM, HADIS_ITEM, VIDEO_ITEM, XAYRIYA_ITEM];
