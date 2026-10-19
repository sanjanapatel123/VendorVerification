import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  note: string;
  icon: LucideIcon;
  accent?: boolean;
  delay?: string;
};

export default function StatCard({
  title,
  value,
  note,
  icon: Icon,
  accent = false,
  delay = "",
}: Props) {
  return (
    <article
      className={`animate-fade-up ${delay} rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#22372b]/[0.04] ${
        accent
          ? "border-[#22372b] bg-[#22372b] text-white"
          : "border-[#e9ebe4] bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <p
          className={`text-[12px] font-medium ${accent ? "text-white/70" : "text-[#858a82]"}`}
        >
          {title}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent ? "bg-white/10 text-white" : "bg-[#f1f4ee] text-[#344c39]"
          }`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-5 text-[32px] font-semibold tracking-tight">{value}</p>
      <div
        className={`mt-2 flex items-center gap-1.5 text-[11px] ${
          accent ? "text-white/65" : "text-[#858a82]"
        }`}
      >
        <ArrowUpRight size={13} />
        {note}
      </div>
    </article>
  );
}
