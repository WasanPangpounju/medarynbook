import { promoBar as defaultPromoBar } from "@/data/content";
import type { PromoBarContent } from "@/data/content";

type PromoBarProps = {
  promoBar?: PromoBarContent;
};

export default function PromoBar({ promoBar = defaultPromoBar }: PromoBarProps) {
  return (
    <div id="promo" className="bg-sage text-white flex justify-center gap-8 py-3.5 px-4">
      <div className="flex items-center gap-2 text-sm text-center flex-wrap justify-center">
        <span className="bg-white/20 px-3 py-0.5 rounded text-[11px] font-medium">
          {promoBar.badge}
        </span>
        <span>
          {promoBar.text} — โค้ด {promoBar.code} | {promoBar.shipping}
        </span>
      </div>
    </div>
  );
}
