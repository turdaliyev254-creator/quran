import PageHeader from "@/components/PageHeader";
import LugatView from "@/components/LugatView";
import { LUGAT_SIZE } from "@/lib/lugat";

export const metadata = { title: "Arab–o'zbek lug'ati" };

export default function LugatPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Lug'at" subtitle={`${LUGAT_SIZE.toLocaleString("en-US").replace(/,/g, " ")} ta so'z`} backHref="/" />
      <LugatView />
    </div>
  );
}
