import Link from "next/link";
import { Mail } from "lucide-react";
import { rights as defaultRights } from "@/data/content";
import type { RightsContent } from "@/data/content";

type RightsSectionProps = {
  rights?: RightsContent;
};

const ctaClass =
  "self-start mt-4 flex items-center gap-2 bg-transparent text-white border border-white/60 px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-sage hover:border-sage";

export default function RightsSection({ rights = defaultRights }: RightsSectionProps) {
  const ctaText = rights.ctaText ?? "ขอ Pitch Deck / ติดต่อลิขสิทธิ์";

  return (
    <section id="rights" className="bg-[#1C1C1A] text-white py-20">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-5">
        <span className="text-sage-mid text-[11px] tracking-widest uppercase">
          {rights.label}
        </span>
        <h2 className="text-3xl font-semibold text-white">{rights.title}</h2>
        <p className="text-white/60 font-light max-w-xl">{rights.desc}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {rights.genres.map((genre) => (
            <span
              key={genre}
              className="border border-white/25 text-white/85 text-[12px] px-3 py-1 rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        <Link href="/rights" className={ctaClass}>
          <Mail size={18} />
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
