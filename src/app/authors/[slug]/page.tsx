import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAuthorBySlug, getBooksByAuthorRef, getAuthors } from "@/sanity/queries";

export const revalidate = 60;

const INK = "#1C1C1A";
const SAGE = "#4E7358";
const SAGE_MID = "#7FA882";

export async function generateStaticParams() {
  const authors = await getAuthors();
  return (authors ?? []).map((a) => ({ slug: a.slug }));
}

const AWARD_ICONS: Record<string, string> = {
  trophy: "🏆",
  star: "⭐",
  globe: "🌏",
  movie: "🎬",
  book: "📚",
  heart: "❤️",
};

function awardIcon(icon?: string) {
  if (!icon) return "🏅";
  return AWARD_ICONS[icon] ?? "🏅";
}

type BookItem = {
  id: string;
  title: string;
  badge?: string | null;
  coverImage?: string | null;
  bg?: string;
  category?: string;
  price?: number;
  adaptationStatus?: string;
  adaptationType?: string;
  logline?: string;
};

function BookCard({ book }: { book: BookItem }) {
  return (
    <div className="flex gap-4 rounded-xl border border-black/5 bg-white p-4">
      <div
        className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: book.bg ?? "#7a6b55" }}
      >
        {book.coverImage && (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        {book.badge && book.badge !== "none" && (
          <span
            className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ background: book.badge === "ขายดี" ? "#b5451b" : SAGE }}
          >
            {book.badge}
          </span>
        )}
        <p className="font-medium text-ink leading-snug line-clamp-2">{book.title}</p>
        {book.category && (
          <p className="text-xs text-muted">{book.category}</p>
        )}
        {book.price != null && (
          <p className="text-sm font-semibold" style={{ color: SAGE }}>
            ฿{book.price.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) notFound();

  const featuredBooks = author.featuredWorks ?? [];
  const refBooks = await getBooksByAuthorRef(author.id) ?? [];

  const seenIds = new Set(featuredBooks.map((b) => b.id));
  const mergedBooks: BookItem[] = [
    ...featuredBooks,
    ...refBooks.filter((b) => !seenIds.has(b.id)),
  ];
  const booksToShow = mergedBooks;

  const mediaBooks = booksToShow.filter((b) => b.adaptationStatus === "sold");

  const displayName = author.penName ?? author.nameTh;
  const subName = author.penName ? author.nameTh : (author.nameEn ?? null);

  const socialLinks = [
    { label: "Facebook", href: author.social?.facebook },
    { label: "TikTok", href: author.social?.tiktok },
    { label: "Instagram", href: author.social?.instagram },
    { label: "YouTube", href: author.social?.youtube },
  ].filter((s) => s.href);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── Back link ─── */}
        <div className="bg-white border-b border-black/5">
          <div className="mx-auto max-w-6xl px-6 py-3">
            <Link
              href="/authors"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12l7-7M5 12l7 7" />
              </svg>
              นักเขียนทั้งหมด
            </Link>
          </div>
        </div>

        {/* ─── Hero ─── */}
        <section className="py-16 text-white" style={{ background: INK }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
              {/* Photo */}
              <div className="shrink-0">
                <div
                  className="relative mx-auto h-52 w-52 overflow-hidden rounded-2xl md:h-64 md:w-64"
                  style={{ backgroundColor: "#3d5a48" }}
                >
                  {author.photo ? (
                    <Image
                      src={author.photo}
                      alt={author.photoAlt ?? displayName}
                      fill
                      className="object-cover"
                      sizes="256px"
                      priority
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #3d5a48 0%, #7a6b8a 100%)" }}
                    >
                      <span className="text-6xl font-medium text-white/50 select-none">
                        {displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[11px] tracking-widest uppercase font-medium"
                  style={{ color: SAGE_MID }}
                >
                  MEDARYN BOOK AUTHOR
                </span>
                <h1 className="mt-2 text-3xl font-medium text-white md:text-4xl">
                  {displayName}
                </h1>
                {subName && (
                  <p className="mt-1 text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {subName}
                  </p>
                )}

                {/* Genres */}
                {author.genres && author.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {author.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Languages */}
                {author.languages && author.languages.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      ภาษา:
                    </span>
                    {author.languages.map((l) => (
                      <span
                        key={l}
                        className="rounded border px-2 py-0.5 text-[11px]"
                        style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social links */}
                {socialLinks.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full px-4 py-1.5 text-xs transition hover:bg-white hover:text-ink"
                        style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)" }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="border-b border-black/5 bg-white py-8">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-3 gap-6 sm:grid-cols-3">
              {[
                { label: "ผลงาน", value: author.worksCount ?? booksToShow.length },
                { label: "ดัดแปลง", value: author.adaptationsCount ?? 0 },
                { label: "ยอดขายรวม", value: author.totalSales ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-semibold" style={{ color: SAGE }}>
                    {value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Biography ─── */}
        {(author.biographyTh || author.biographyEn) && (
          <section className="bg-white py-14">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-xl font-medium text-ink mb-8">ประวัตินักเขียน</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {author.biographyTh && (
                  <div>
                    <p
                      className="mb-3 text-[11px] font-medium uppercase tracking-widest"
                      style={{ color: "#6B6B65" }}
                    >
                      ประวัติ (ภาษาไทย)
                    </p>
                    <p className="text-sm leading-relaxed text-ink/80 whitespace-pre-line">
                      {author.biographyTh}
                    </p>
                  </div>
                )}
                {author.biographyEn && (
                  <div>
                    <p
                      className="mb-3 text-[11px] font-medium uppercase tracking-widest"
                      style={{ color: "#6B6B65" }}
                    >
                      Biography (English)
                    </p>
                    <p
                      className="text-sm leading-relaxed italic whitespace-pre-line"
                      style={{ color: "#6B6B65" }}
                    >
                      {author.biographyEn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── Awards ─── */}
        {author.awards && author.awards.length > 0 && (
          <section className="bg-white py-14">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-xl font-medium text-ink">รางวัลและการยอมรับ</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {author.awards.map((award, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-black/5 p-4"
                  >
                    <span className="text-2xl leading-none mt-0.5">{awardIcon(award.icon)}</span>
                    <div>
                      <p className="font-medium text-ink leading-snug">{award.title}</p>
                      {award.year && (
                        <p className="mt-0.5 text-sm text-muted">{award.year}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Media Rights ─── */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-xl font-medium text-ink">ลิขสิทธิ์สื่อ · Media Rights</h2>
            <p className="mt-1 text-sm text-muted">ผลงานที่ได้รับการดัดแปลงเป็นสื่อ</p>
            {mediaBooks.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mediaBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-4 rounded-xl border border-black/5 bg-cream p-4"
                  >
                    <div
                      className="relative h-32 w-20 shrink-0 overflow-hidden rounded-lg"
                      style={{ backgroundColor: book.bg ?? "#7a6b55" }}
                    >
                      {book.coverImage && (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col justify-center gap-2">
                      {book.adaptationType && (
                        <span
                          className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                          style={{ background: "#b5451b" }}
                        >
                          {book.adaptationType}
                        </span>
                      )}
                      <p className="font-medium text-ink leading-snug line-clamp-2">
                        {book.title}
                      </p>
                      {book.logline && (
                        <p className="text-xs leading-relaxed line-clamp-3 text-muted">
                          {book.logline}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">
                ยังไม่มีผลงานที่ดัดแปลงเป็นสื่อในขณะนี้
              </p>
            )}
          </div>
        </section>

        {/* ─── Books ─── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-medium text-ink">ผลงานทั้งหมด</h2>
            <p className="mt-1 text-sm text-muted">
              หนังสือที่ตีพิมพ์ภายใต้ Medaryn Book
            </p>

            {booksToShow.length === 0 ? (
              <div className="mt-12 text-center text-muted">
                ยังไม่มีผลงานในระบบ — กลับมาใหม่เร็วๆ นี้
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {booksToShow.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Link
                href="/bookstore"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 text-sm text-ink transition hover:border-sage hover:text-sage"
              >
                ดูหนังสือทั้งหมดในร้าน
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        {/* ─── Contact CTA ─── */}
        <section className="bg-cream py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div
              className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}
            >
              <div>
                <p className="text-base font-medium text-ink">
                  ติดต่อขอลิขสิทธิ์หรือสอบถามข้อมูล
                </p>
                <p className="mt-1 text-sm" style={{ color: "#6B6B65" }}>
                  สำหรับผู้จัด สตูดิโอ และนักแปล · For producers, studios &amp; translators
                </p>
              </div>
              <a
                href="mailto:rights@medarynbook.com"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white shrink-0"
                style={{ background: "#4E7358" }}
              >
                ติดต่อทีมลิขสิทธิ์
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
