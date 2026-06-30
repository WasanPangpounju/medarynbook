"use client";

import { useMemo, useState } from "react";
import { addToCart, getPendingOrderId } from "@/lib/cart";
import NavbarCartButton from "@/components/NavbarCartButton";
import BookCard from "./BookCard";
import FilterSidebar, { type FilterState } from "./FilterSidebar";
import PaymentNoticeModal from "./PaymentNoticeModal";
import type { BadgeStyleMap } from "@/data/content";
import type { StoreBook } from "./types";

const PAGE_SIZE = 9;

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "แนะนำ",
  "price-asc": "ราคาต่ำ → สูง",
  "price-desc": "ราคาสูง → ต่ำ",
  newest: "ใหม่ล่าสุด",
};

export default function BookstoreClient({
  books,
  badgeStyleMap,
}: {
  books: StoreBook[];
  badgeStyleMap?: BadgeStyleMap;
}) {
  const maxPriceLimit = useMemo(
    () => Math.max(...books.map((book) => book.price), 100),
    [books]
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    maxPrice: maxPriceLimit,
    promotionOnly: false,
  });
  const [page, setPage] = useState(1);
  const [pendingOrderId] = useState<string | null>(getPendingOrderId);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => book.price <= filters.maxPrice);

    if (filters.categories.length > 0) {
      result = result.filter((book) => filters.categories.includes(book.category));
    }
    if (filters.promotionOnly) {
      result = result.filter((book) => book.isPromotion);
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term)
      );
    }

    const sorted = [...result];
    if (sort === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return sorted;
  }, [books, filters, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageBooks = filteredBooks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleAddToCart(book: StoreBook) {
    if (!book.stockQuantity || book.stockQuantity <= 0) {
      alert("ขออภัย หนังสือเล่มนี้หมดชั่วคราว อยู่ระหว่างจัดพิมพ์เพิ่ม");
      return;
    }
    addToCart({
      title: book.title,
      price: book.price,
      quantity: 1,
      bg: book.bg,
      coverImage: book.coverImage,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {pendingOrderId && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-5 py-4">
          <p className="text-sm text-ink">
            คุณมีคำสั่งซื้อที่ยังไม่ได้แจ้งชำระเงิน{" "}
            <span className="font-medium">({pendingOrderId})</span>
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-medium text-white"
          >
            แจ้งชำระเงิน
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">ร้านหนังสือ</h1>
          <p className="text-sm text-muted">{filteredBooks.length} รายการ</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อหนังสือ หรือผู้เขียน"
            className="w-56 rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-sage"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-sage"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <NavbarCartButton />
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <FilterSidebar
          filters={filters}
          onChange={(value) => {
            setFilters(value);
            setPage(1);
          }}
          maxPriceLimit={maxPriceLimit}
        />

        <div className="flex-1">
          {pageBooks.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted">ไม่พบหนังสือที่ตรงกับเงื่อนไข</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {pageBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={handleAddToCart}
                  badgeStyleMap={badgeStyleMap}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 w-9 rounded-full text-sm ${
                    pageNumber === currentPage
                      ? "bg-sage text-white"
                      : "border border-black/10 text-ink hover:border-sage"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && <PaymentNoticeModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
