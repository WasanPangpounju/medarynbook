import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAuthors } from "@/sanity/queries";
import type { SanityAuthor } from "@/sanity/queries";

export const revalidate = 60;

const INK = "#1C1C1A";
const SAGE = "#4E7358";
const SAGE_MID = "#7FA882";

const LANGUAGES = ["ทั้งหมด", "ไทย", "EN", "JP", "KR", "ZH"];

function computeStats(authors: SanityAuthor[]) {
  const totalWorks = authors.reduce((s, a) => s + (a.worksCount ?? 0), 0);
  const totalAdaptations = authors.reduce((s, a) => s + (a.adaptationsCount ?? 0), 0);
  const allLangs = new Set(authors.flatMap((a) => a.languages ?? []));
  return { count: authors.length, totalWorks, totalAdaptations, langCount: allLangs.size || 2 };
}

function AuthorCard({ author }: { author: SanityAuthor }) {
  const displayName = author.penName ?? author.nameTh;
  const subName = author.penName ? author.nameTh : (author.nameEn ?? null);

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-md hover:-translate-y-0.5"
      style={{ transitionDuration: "200ms" }}
    >
      {/* Photo */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-[#e8e4dc]"
        style={{ backgroundColor: "#e8e4dc" }}
      >
        {author.photo ? (
          <Image
            src={author.photo}
            alt={author.photoAlt ?? displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3d5a48 0%, #7a6b8a 100%)" }}
          >
            <span className="text-4xl font-medium text-white/60 select-none">
              {displayName.charAt(0)}
            </span>
          </div>
        )}
        {/* Genre tag overlay */}
        {author.genres && author.genres.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {author.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                style={{ background: "rgba(28,28,26,0.55)" }}
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-base font-medium text-ink leading-snug">{displayName}</p>
        {subName && (
          <p className="mt-0.5 text-sm text-muted">{subName}</p>
        )}

        {/* Biography */}
        {author.biographyTh && (
          <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
            {author.biographyTh}
          </p>
        )}
        {author.biographyEn && (
          <p
            className="mt-1 text-xs line-clamp-1 leading-relaxed italic"
            style={{ color: "#6B6B65" }}
          >
            {author.biographyEn}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          {author.worksCount != null && (
            <span className="text-ink/70">
              <span className="font-semibold" style={{ color: SAGE }}>{author.worksCount}</span>{" "}
              ผลงาน
            </span>
          )}
          {author.adaptationsCount != null && author.adaptationsCount > 0 && (
            <span className="text-ink/70">
              <span className="font-semibold" style={{ color: SAGE }}>{author.adaptationsCount}</span>{" "}
              ดัดแปลง
            </span>
          )}
          {author.totalSales && (
            <span className="ml-auto text-xs text-muted">{author.totalSales}</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-black/5">
          <span
            className="text-sm font-medium transition-colors"
            style={{ color: SAGE }}
          >
            ดูผลงาน →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function AuthorsPage() {
  const authors = (await getAuthors()) ?? [];
  const stats = computeStats(authors);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <section className="py-24 text-white" style={{ background: INK }}>
          <div className="mx-auto max-w-6xl px-6">
            <span
              className="text-[11px] tracking-widest uppercase font-medium"
              style={{ color: SAGE_MID }}
            >
              OUR AUTHORS
            </span>
            <h1 className="mt-4 text-4xl font-medium text-white">
              นักเขียนของเรา
            </h1>
            <p className="mt-1 text-2xl font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
              Meet the Authors of Medaryn Book
            </p>
            <p className="mt-4 max-w-xl text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              พบกับนักเขียนผู้สร้างสรรค์เรื่องราวที่ทรงพลัง ตั้งแต่พีเรียดประวัติศาสตร์ไทย
              จนถึงโรแมนติกที่ไม่มีวันลืม
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { value: stats.count, label: "นักเขียน" },
                { value: stats.totalWorks, label: "ผลงานรวม" },
                { value: stats.langCount, label: "ภาษา" },
                { value: stats.totalAdaptations, label: "ดัดแปลง" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-semibold text-white">{value}</div>
                  <div className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Language filter bar (UI decoration) ─── */}
        <section className="border-b border-black/5 bg-white py-4 sticky top-[64px] z-40">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {LANGUAGES.map((lang, i) => (
                <button
                  key={lang}
                  className="shrink-0 rounded-full px-4 py-1.5 text-sm transition"
                  style={
                    i === 0
                      ? { background: INK, color: "#fff" }
                      : { border: "1px solid rgba(0,0,0,0.12)", color: "#555" }
                  }
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Authors Grid ─── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-medium text-ink">
              ผู้สร้างเรื่องราวที่คุณรัก
            </h2>
            <p className="mt-2 text-muted">
              แต่ละคนมีสไตล์เป็นของตัวเอง แต่ทุกคนรวมกันทำให้ Medaryn Book
              เป็นบ้านของเรื่องราวที่ดีที่สุด
            </p>

            {authors.length === 0 ? (
              <div className="mt-16 text-center text-muted">
                กำลังอัปเดตข้อมูลนักเขียน — กลับมาใหม่เร็วๆ นี้
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {authors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
