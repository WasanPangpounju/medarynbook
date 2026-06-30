import { Icon } from "./icons";
import ShoppingActionBar from "./ShoppingActionBar";
import { shopping as defaultShopping } from "@/data/content";
import type { ShoppingChannel } from "@/data/content";

type ShoppingSectionProps = {
  shopping?: ShoppingChannel[];
};

export default function ShoppingSection({ shopping = defaultShopping }: ShoppingSectionProps) {
  return (
    <section id="shopping" className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl text-ink mb-8">ช่องทางการสั่งซื้อ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shopping.map((channel) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-black/10 rounded-xl p-8 flex flex-col items-center gap-3 text-center transition-all hover:border-sage hover:-translate-y-0.5"
            >
              <Icon name={channel.icon} size={32} className="text-sage" />
              <p className="text-ink font-medium">{channel.name}</p>
              <p className="text-muted text-sm">{channel.desc}</p>
              <span className="bg-sage-light text-sage text-[10.5px] px-2.5 py-0.5 rounded">
                {channel.tag}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-8 border-t border-black/5 pt-6">
          <ShoppingActionBar />
        </div>
      </div>
    </section>
  );
}
