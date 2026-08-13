import { notFound } from "next/navigation";
import { HandCoins } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import XayriyaCheckout from "@/components/XayriyaCheckout";
import xayriya from "@/data/xayriya.json";
import { XAYRIYA_ICONS } from "@/lib/xayriya";

export default async function XayriyaCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = xayriya.find((c) => c.id === id);
  if (!category) notFound();

  const Icon = XAYRIYA_ICONS[category.icon] ?? HandCoins;

  return (
    <div className="flex flex-1 flex-col pb-4">
      <PageHeader title={category.sarlavha} backHref="/xayriya" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-center text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Icon size={26} />
          </div>
          <p className="text-sm leading-relaxed text-emerald-50">{category.tavsif}</p>
        </div>

        <XayriyaCheckout categoryId={category.id} />
      </div>
    </div>
  );
}
