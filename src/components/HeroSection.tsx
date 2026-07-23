import Link from "next/link";
import HeroSlideshow from "./HeroSlideshow";
import { hero as defaultHero, slides as defaultSlides } from "@/data/content";
import type { HeroContent, Slide } from "@/data/content";

type HeroSectionProps = {
  hero?: HeroContent;
  slides?: Slide[];
};

export default function HeroSection({
  hero = defaultHero,
  slides = defaultSlides,
}: HeroSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-cream flex flex-col justify-center px-6 md:px-16 py-16 md:py-0 gap-5">
        <span className="uppercase tracking-widest text-sage font-medium text-[11px]">
          {hero.brand}
        </span>
        <p className="text-sage font-normal">{hero.tagline}</p>
        <h1 className="text-4xl md:text-5xl leading-tight text-ink">
          {hero.title}{" "}
          <em className="italic text-sage font-semibold">{hero.titleEmphasis}</em>{" "}
          {hero.titleSuffix}
        </h1>
        <p className="text-muted font-light">{hero.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <Link
            href={hero.ctaPrimaryUrl ?? "/track"}
            className="bg-sage text-white px-6 py-2.5 rounded-full hover:bg-sage-mid transition-colors"
          >
            {hero.ctaPrimary}
          </Link>
          <Link
            href={hero.ctaSecondaryUrl ?? "/bookstore"}
            className="border border-black/15 text-ink px-6 py-2.5 rounded-full hover:border-sage hover:text-sage transition-colors"
          >
            {hero.ctaSecondary}
          </Link>
        </div>
      </div>

      <div className="bg-white">
        <HeroSlideshow slides={slides} />
      </div>
    </section>
  );
}
