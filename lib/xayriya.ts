import { Landmark, Home, Cross, School, Baby, PawPrint, Trees, type LucideIcon } from "lucide-react";

export const XAYRIYA_ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  home: Home,
  cross: Cross,
  school: School,
  baby: Baby,
  paw: PawPrint,
  tree: Trees,
};

export const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export function formatSom(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} so'm`;
}
