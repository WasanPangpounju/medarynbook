"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBaht } from "@/lib/cart";
import type { BadgeStyleMap } from "@/data/content";
import type { StoreBook } from "./types";

export default function BookCard({
  book,
  onAddToCart,
  badgeStyleMap,
}: {
  book: StoreBook;
  onAddToCart: (book: StoreBook) => void;
  badgeStyleMap?: BadgeStyleMap;
}) {
  const bs = book.badge ? badgeStyleMap?.[book.badge] : undefined;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ backgroundColor: book.bg }}
      >
        <Link href={`/bookstore/${book.id}`} className="absolute inset-0 z-0" aria-label={book.title} />

        {book.coverImage && (
          <Image
            src={book.coverImage}
            alt={book.coverImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {book.badge && (
          <span
            style={{
              backgroundColor: bs?.bgColor ?? "#ffffff",
              color: bs?.textColor ?? "#1C1C1A",
            }}
            className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-medium"
          >
            {book.badge}
          </span>
        )}
        {book.isPromotion && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-white">
            โปรโมชัน
          </span>
        )}
        {!book.inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
            สินค้าหมด
          </span>
        )}

        <button
          type="button"
          disabled={!book.inStock || !book.stockQuantity || book.stockQuantity <= 0}
          onClick={() => onAddToCart(book)}
          className="absolute inset-x-3 bottom-3 z-10 translate-y-12 rounded-full bg-ink py-2 text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:bg-black/30"
        >
          เพิ่มในตะกร้า
        </button>
      </div>

      <Link href={`/bookstore/${book.id}`} className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs text-muted">{book.category}</span>
        <h3 className="line-clamp-2 text-sm font-medium text-ink">{book.title}</h3>
        <p className="text-xs text-muted">{book.author}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-sm font-semibold text-sage">฿{formatBaht(book.price)}</span>
          {book.originalPrice > book.price && (
            <span className="text-xs text-muted line-through">
              ฿{formatBaht(book.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
