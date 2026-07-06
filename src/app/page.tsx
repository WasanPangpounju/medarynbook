import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromoBar from "@/components/PromoBar";
import MoodSection from "@/components/MoodSection";
import PromoCards from "@/components/PromoCards";
import ShoppingSection from "@/components/ShoppingSection";
import RightsSection from "@/components/RightsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  getBooks,
  getPromos,
  getSlides,
  getSiteSettings,
  getMoods,
  getBadgeStyles,
} from "@/sanity/queries";
import {
  hero as fallbackHero,
  promoBar as fallbackPromoBar,
  books as fallbackBooks,
  promos as fallbackPromos,
  slides as fallbackSlides,
  shopping as fallbackShopping,
  rights as fallbackRights,
  contact as fallbackContact,
  footer as fallbackFooter,
} from "@/data/content";
import type {
  Book,
  HeroContent,
  Promo,
  PromoBarContent,
  Slide,
  ShoppingChannel,
  RightsContent,
  ContactEntry,
  FooterContent,
  SocialLink,
} from "@/data/content";
import { defaultBadgeStyleMap } from "@/data/content";
import type { BadgeStyleMap } from "@/data/content";

// ISR: revalidate this page's Sanity data every 60 seconds without a rebuild.
export const revalidate = 60;

function mergeDefined<T extends object>(fallback: T, override?: Partial<Record<keyof T, string>>): T {
  if (!override) return fallback;
  const result = { ...fallback };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const value = override[key];
    if (typeof value === "string" && value.trim() !== "") {
      result[key] = value as T[keyof T];
    }
  }
  return result;
}

export default async function Home() {
  const [sanityBooks, sanityPromos, sanitySlides, sanitySettings, sanityMoods, sanityBadges] = await Promise.all([
    getBooks(),
    getPromos(),
    getSlides(),
    getSiteSettings(),
    getMoods(),
    getBadgeStyles(),
  ]);

  const totalBooks = sanityBooks && sanityBooks.length > 0 ? sanityBooks.length : fallbackBooks.length;
  const books: Book[] =
    sanityBooks && sanityBooks.length > 0
      ? sanityBooks.slice(0, 8).map((book, index) => ({
          id: book.id,
          title: book.title,
          author: book.author ?? "",
          price: book.price != null ? String(book.price) : "",
          originalPrice: book.originalPrice != null ? String(book.originalPrice) : "",
          badge: book.badge === "ใหม่" || book.badge === "ขายดี" ? book.badge : null,
          bg: book.bg ?? "#7a6b55",
          coverImage: book.coverImage ?? null,
          url: book.url ?? fallbackBooks[index % fallbackBooks.length].url,
        }))
      : fallbackBooks;

  const badgeStyleMap: BadgeStyleMap =
    sanityBadges && sanityBadges.length > 0
      ? Object.fromEntries(
          sanityBadges.map((b) => [b.label, { bgColor: b.bgColor, textColor: b.textColor }])
        )
      : defaultBadgeStyleMap;

  const FALLBACK_MOODS = ["คืนฝนตก", "เรื่องรักอบอุ่น", "สืบสวน", "เยาวชน", "วรรณกรรมไทย"];
  const moods: string[] =
    sanityMoods && sanityMoods.length > 0
      ? sanityMoods.map((m) => m.label)
      : FALLBACK_MOODS;

  const promos: Promo[] =
    sanityPromos && sanityPromos.length > 0
      ? sanityPromos.map((promo, index) => ({
          title: promo.title,
          desc: promo.description ?? "",
          cta: promo.cta ?? "ดูโปรโมชั่น",
          bg: promo.bgColor ?? fallbackPromos[index % fallbackPromos.length].bg,
          btnColor: promo.btnColor ?? fallbackPromos[index % fallbackPromos.length].btnColor,
          url: promo.url ?? "#",
        }))
      : fallbackPromos;

  const slides: Slide[] =
    sanitySlides && sanitySlides.length > 0
      ? sanitySlides.map((slide, index) => ({
          src: slide.src,
          caption: slide.caption ?? fallbackSlides[index % fallbackSlides.length].caption,
          url: slide.url ?? "#",
        }))
      : fallbackSlides;

  const hero: HeroContent = mergeDefined(fallbackHero, sanitySettings?.hero);

  const sanityPromoBar = sanitySettings?.promoBar;
  const promoBar: PromoBarContent = {
    isActive: sanityPromoBar?.isActive ?? fallbackPromoBar.isActive,
    badge: sanityPromoBar?.badge || fallbackPromoBar.badge,
    text: sanityPromoBar?.text || fallbackPromoBar.text,
    code: sanityPromoBar?.code || fallbackPromoBar.code,
    shipping: sanityPromoBar?.shipping || fallbackPromoBar.shipping,
    bgColor: sanityPromoBar?.bgColor || fallbackPromoBar.bgColor,
    textColor: sanityPromoBar?.textColor || fallbackPromoBar.textColor,
    url: sanityPromoBar?.url || fallbackPromoBar.url,
  };

  const shopping: ShoppingChannel[] =
    sanitySettings?.shopping && sanitySettings.shopping.length > 0
      ? sanitySettings.shopping.map((ch) => ({
          name: ch.name ?? "",
          desc: ch.desc ?? "",
          tag: ch.tag ?? "",
          url: ch.url ?? "#",
          icon: (ch.icon ?? "shoppingCart") as ShoppingChannel["icon"],
        }))
      : fallbackShopping;

  const rights: RightsContent = {
    label: sanitySettings?.rights?.label || fallbackRights.label,
    title: sanitySettings?.rights?.title || fallbackRights.title,
    desc: sanitySettings?.rights?.desc || fallbackRights.desc,
    genres: sanitySettings?.rights?.genres?.length
      ? sanitySettings.rights.genres
      : fallbackRights.genres,
    ctaText: sanitySettings?.rights?.ctaText || fallbackRights.ctaText,
    ctaUrl: sanitySettings?.rights?.ctaUrl || fallbackRights.ctaUrl,
  };

  const contact: ContactEntry[] =
    sanitySettings?.contact && sanitySettings.contact.length > 0
      ? sanitySettings.contact.map((entry) => ({
          icon: (entry.icon ?? "mail") as ContactEntry["icon"],
          label: entry.label ?? "",
          value: entry.value ?? [],
        }))
      : fallbackContact;

  const footerSocial: SocialLink[] =
    sanitySettings?.footer?.social && sanitySettings.footer.social.length > 0
      ? sanitySettings.footer.social.map((s) => ({
          label: s.label ?? "",
          icon: (s.icon ?? "facebook") as SocialLink["icon"],
          href: s.href ?? "#",
        }))
      : fallbackFooter.social;

  const footer: FooterContent = {
    social: footerSocial,
    copyright: sanitySettings?.footer?.copyright || fallbackFooter.copyright,
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection hero={hero} slides={slides} />
        <PromoBar promoBar={promoBar} />
        <MoodSection books={books} badgeStyleMap={badgeStyleMap} moods={moods} showViewAll={totalBooks > 8} />
        <PromoCards promos={promos} />
        <ShoppingSection shopping={shopping} />
        <RightsSection rights={rights} />
        <ContactSection contact={contact} />
      </main>
      <Footer footer={footer} />
    </>
  );
}
