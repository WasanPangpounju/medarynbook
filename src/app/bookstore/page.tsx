import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookstoreClient from "@/components/bookstore/BookstoreClient";
import { getBooks, getBadgeStyles } from "@/sanity/queries";
import { books as fallbackBooks, defaultBadgeStyleMap } from "@/data/content";
import type { BadgeStyleMap } from "@/data/content";
import type { StoreBook } from "@/components/bookstore/types";

export const revalidate = 60;

const FALLBACK_CATEGORIES = ["พีเรียด", "โรแมนติก", "สืบสวน", "แฟนตาซี", "เยาวชน"];
const FALLBACK_BASE_TIME = new Date("2026-01-01T00:00:00Z").getTime();

export default async function BookstorePage() {
  const [sanityBooks, sanityBadges] = await Promise.all([getBooks(), getBadgeStyles()]);

  const badgeStyleMap: BadgeStyleMap =
    sanityBadges && sanityBadges.length > 0
      ? Object.fromEntries(
          sanityBadges.map((b) => [b.label, { bgColor: b.bgColor, textColor: b.textColor }])
        )
      : defaultBadgeStyleMap;

  const books: StoreBook[] =
    sanityBooks && sanityBooks.length > 0
      ? sanityBooks.map((book, index) => ({
          id: book.id,
          title: book.title,
          author: book.author ?? "",
          price: book.price ?? 0,
          originalPrice: book.originalPrice ?? book.price ?? 0,
          badge: book.badge === "ใหม่" || book.badge === "ขายดี" ? book.badge : null,
          coverImage: book.coverImage ?? null,
          coverImageAlt: book.coverImageAlt ?? book.title,
          bg: book.bg ?? "#7a6b55",
          url: book.url ?? "#",
          category: book.category ?? FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length],
          isPromotion: book.isPromotion ?? false,
          isFeatured: book.isFeatured ?? false,
          inStock: book.inStock ?? true,
          stockQuantity: book.stockQuantity,
          createdAt: book.createdAt ?? new Date().toISOString(),
        }))
      : fallbackBooks.map((book, index) => ({
          id: `fallback-${index}`,
          title: book.title,
          author: book.author,
          price: Number(book.price) || 0,
          originalPrice: Number(book.originalPrice) || Number(book.price) || 0,
          badge: book.badge,
          coverImage: null,
          coverImageAlt: book.title,
          bg: book.bg,
          url: book.url,
          category: FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length],
          isPromotion: index === 0,
          isFeatured: index === 1,
          inStock: book.title !== "Coming Soon",
          createdAt: new Date(FALLBACK_BASE_TIME - index * 86400000).toISOString(),
        }));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <BookstoreClient books={books} badgeStyleMap={badgeStyleMap} />
      </main>
      <Footer />
    </>
  );
}
