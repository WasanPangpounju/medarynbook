"use client";

import { useState } from "react";
import Link from "next/link";
import { books as defaultBooks, defaultBadgeStyleMap } from "@/data/content";
import type { Book, BadgeStyleMap } from "@/data/content";

const FALLBACK_MOODS = ["คืนฝนตก", "เรื่องรักอบอุ่น", "สืบสวน", "เยาวชน", "วรรณกรรมไทย"];

type MoodSectionProps = {
  books?: Book[];
  badgeStyleMap?: BadgeStyleMap;
  moods?: string[];
  showViewAll?: boolean;
};

export default function MoodSection({
  books = defaultBooks,
  badgeStyleMap = defaultBadgeStyleMap,
  moods = FALLBACK_MOODS,
  showViewAll = false,
}: MoodSectionProps) {
  const [activeTab, setActiveTab] = useState(moods[0]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl text-ink mb-6">เลือกอ่านตามอารมณ์</h2>

      <div className="flex flex-wrap gap-3 mb-10">
        {moods.map((mood) => {
          const isActive = mood === activeTab;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => setActiveTab(mood)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-sage text-white border-sage"
                  : "border-black/15 text-ink hover:border-sage hover:text-sage"
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {books.map((book) => {
          const badgeStyle = book.badge ? badgeStyleMap?.[book.badge] : undefined;
          const href = book.id ? `/bookstore/${book.id}` : book.url;

          const inner = (
            <>
              <div
                className="relative aspect-[2/3] rounded-l-[3px] rounded-r-[7px] shadow-md transition-transform duration-300 group-hover:-translate-y-[3px]"
                style={{ backgroundColor: book.bg }}
              >
                {book.badge && (
                  <span
                    style={{
                      backgroundColor: badgeStyle?.bgColor ?? "#4E7358",
                      color: badgeStyle?.textColor ?? "#ffffff",
                    }}
                    className="absolute top-2 left-2 text-[10.5px] px-2 py-0.5 rounded"
                  >
                    {book.badge}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm text-ink line-clamp-2">{book.title}</p>
                <p className="text-xs text-muted mt-1">{book.author}</p>
                {book.price && (
                  <p className="text-sm text-sage font-medium mt-1">
                    ฿{book.price}{" "}
                    <span className="text-muted line-through font-normal text-xs">
                      ฿{book.originalPrice}
                    </span>
                  </p>
                )}
              </div>
            </>
          );

          if (book.id) {
            return (
              <Link key={book.title} href={href} className="group cursor-pointer">
                {inner}
              </Link>
            );
          }

          return (
            <a
              key={book.title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              {inner}
            </a>
          );
        })}
      </div>

      {showViewAll && (
        <div className="text-center">
          <Link
            href="/bookstore"
            className="inline-block text-sm text-sage hover:underline"
          >
            ดูหนังสือทั้งหมด →
          </Link>
        </div>
      )}
    </section>
  );
}
