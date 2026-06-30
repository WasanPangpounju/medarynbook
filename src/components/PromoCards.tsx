import { promos as defaultPromos } from "@/data/content";
import type { Promo } from "@/data/content";

type PromoCardsProps = {
  promos?: Promo[];
};

export default function PromoCards({ promos = defaultPromos }: PromoCardsProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promos.map((promo) => (
          <a
            key={promo.title}
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-8 flex flex-col gap-4"
            style={{ backgroundColor: promo.bg }}
          >
            <h3 className="text-xl text-ink font-medium">{promo.title}</h3>
            <p className="text-muted">{promo.desc}</p>
            <span
              className="self-start text-white px-5 py-2 rounded-full"
              style={{ backgroundColor: promo.btnColor }}
            >
              {promo.cta}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
