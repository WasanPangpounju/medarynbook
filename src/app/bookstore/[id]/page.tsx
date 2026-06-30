import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDetailActions from "@/components/bookstore/BookDetailActions";
import { getBookById, getBooksByAuthor } from "@/sanity/queries";
import { formatBaht } from "@/lib/cart";

export const revalidate = 60;

const BADGE_STYLES: Record<string, string> = {
  ใหม่: "bg-sage text-white",
  ขายดี: "bg-[#b5451b] text-white",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) notFound();

  const relatedBooks = book.author
    ? await getBooksByAuthor(book.author, id)
    : null;

  const discount =
    book.price != null &&
    book.originalPrice != null &&
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/bookstore"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-sage"
          >
            ← กลับไปร้านหนังสือ
          </Link>

          {/* 2-column layout */}
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Left: cover image */}
            <div className="flex justify-center">
              <div
                className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl shadow-md"
                style={{ backgroundColor: book.bg ?? "#7a6b55" }}
              >
                {book.coverImage && (
                  <Image
                    src={book.coverImage}
                    alt={book.coverImageAlt ?? book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 320px"
                    priority
                  />
                )}
                {book.badge && (
                  <span
                    className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10.5px] ${BADGE_STYLES[book.badge] ?? "bg-white text-ink"}`}
                  >
                    {book.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Right: book info */}
            <div className="flex flex-col">
              {book.category && (
                <span className="text-xs text-muted">{book.category}</span>
              )}
              <h1 className="mt-1 text-2xl font-medium text-ink">{book.title}</h1>
              {book.author && (
                <p className="mt-1 text-sm text-muted">โดย {book.author}</p>
              )}

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                {book.price != null && (
                  <span className="text-2xl font-semibold text-sage">
                    ฿{formatBaht(book.price)}
                  </span>
                )}
                {discount !== null && book.originalPrice != null && (
                  <>
                    <span className="text-sm text-muted line-through">
                      ฿{formatBaht(book.originalPrice)}
                    </span>
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Quantity selector + action buttons */}
              <BookDetailActions
                bookId={book.id}
                title={book.title}
                price={book.price ?? 0}
                coverImage={book.coverImage}
                bg={book.bg}
                inStock={book.inStock ?? true}
                stockQuantity={book.stockQuantity}
              />

              {/* External purchase links */}
              {(book.shopeeUrl || book.mebUrl || book.naiinUrl) && (
                <div className="mt-6">
                  <p className="text-xs text-muted">ซื้อผ่านช่องทางอื่น</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {book.mebUrl && (
                      <a
                        href={book.mebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-ink hover:border-sage hover:text-sage"
                      >
                        Meb
                      </a>
                    )}
                    {book.naiinUrl && (
                      <a
                        href={book.naiinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-ink hover:border-sage hover:text-sage"
                      >
                        Naiin
                      </a>
                    )}
                    {book.shopeeUrl && (
                      <a
                        href={book.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-ink hover:border-sage hover:text-sage"
                      >
                        Shopee
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Synopsis + Metadata */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-ink">เรื่องย่อ</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                {book.synopsis ?? "ไม่มีเรื่องย่อ"}
              </p>
            </div>

            <div className="rounded-xl border border-black/5 bg-white p-6">
              <h2 className="text-sm font-medium text-ink">ข้อมูลหนังสือ</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {book.author && (
                  <div>
                    <dt className="text-muted">ผู้แต่ง</dt>
                    <dd className="mt-0.5 text-ink">{book.author}</dd>
                  </div>
                )}
                {book.category && (
                  <div>
                    <dt className="text-muted">หมวดหมู่</dt>
                    <dd className="mt-0.5 text-ink">{book.category}</dd>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <dt className="text-muted">สำนักพิมพ์</dt>
                    <dd className="mt-0.5 text-ink">{book.publisher}</dd>
                  </div>
                )}
                {book.publishYear && (
                  <div>
                    <dt className="text-muted">ปีที่พิมพ์</dt>
                    <dd className="mt-0.5 text-ink">{book.publishYear}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Related books by same author */}
          {relatedBooks && relatedBooks.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-medium text-ink">
                หนังสือเล่มอื่นจาก {book.author}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                {relatedBooks.map((related) => (
                  <Link
                    key={related.id}
                    href={`/bookstore/${related.id}`}
                    className="group"
                  >
                    <div
                      className="relative aspect-[3/4] overflow-hidden rounded-xl"
                      style={{ backgroundColor: related.bg ?? "#7a6b55" }}
                    >
                      {related.coverImage && (
                        <Image
                          src={related.coverImage}
                          alt={related.coverImageAlt ?? related.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="line-clamp-2 text-sm font-medium text-ink group-hover:text-sage">
                        {related.title}
                      </p>
                      {related.price != null && (
                        <p className="mt-0.5 text-sm text-sage">
                          ฿{formatBaht(related.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
