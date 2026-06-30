import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  getSiteSettings,
  getBooks,
  getRightsBooks,
} from "@/sanity/queries";
import {
  books as fallbackBooks,
  footer as fallbackFooter,
  rights as fallbackRights,
} from "@/data/content";

export const revalidate = 60;

const INK = "#1C1C1A";
const SAGE = "#4E7358";
const SAGE_MID = "#7FA882";

export default async function RightsPage() {
  const [sanitySettings, allBooks, rightsBooks] = await Promise.all([
    getSiteSettings(),
    getBooks(),
    getRightsBooks(),
  ]);

  const rightsContent = {
    label: sanitySettings?.rights?.label ?? fallbackRights.label,
    title: sanitySettings?.rights?.title ?? fallbackRights.title,
    desc: sanitySettings?.rights?.desc ?? fallbackRights.desc,
  };

  const soldBooks =
    rightsBooks?.filter((b) => b.adaptationStatus === "sold") ?? [];
  const availableBooks =
    rightsBooks?.filter(
      (b) =>
        b.adaptationStatus === "available" ||
        b.adaptationStatus === "translation"
    ) ?? [];

  const totalBooksCount = allBooks?.length ?? fallbackBooks.length;

  const footerLinks =
    sanitySettings?.footer?.social && sanitySettings.footer.social.length > 0
      ? sanitySettings.footer.social.map((s) => ({
          label: s.label ?? "",
          href: s.href ?? "#",
        }))
      : fallbackFooter.social.map((s) => ({ label: s.label, href: s.href }));

  const copyright =
    sanitySettings?.footer?.copyright ?? fallbackFooter.copyright;

  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <section
          className="py-24 text-white"
          style={{ background: INK }}
        >
          <div className="mx-auto max-w-6xl px-6">
            <span
              className="text-[11px] tracking-widest uppercase"
              style={{ color: SAGE_MID }}
            >
              {rightsContent.label}
            </span>
            <h1 className="mt-4 text-4xl font-medium text-white">
              {rightsContent.title}
            </h1>
            <p className="mt-4 max-w-xl text-white/60">
              {rightsContent.desc}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:rights@medarynbook.com?subject=Pitch Deck Request"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium"
                style={{ color: INK }}
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={SAGE}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
                ขอ Pitch Deck
              </a>
              <a
                href="mailto:rights@medarynbook.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium"
                style={{ color: INK }}
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={SAGE}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                ติดต่อลิขสิทธิ์
              </a>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="border-b border-black/5 bg-white py-8">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "ผลงานทั้งหมด", value: totalBooksCount },
                { label: "ดัดแปลงแล้ว", value: soldBooks.length },
                {
                  label: "พร้อมดัดแปลง",
                  value: availableBooks.length,
                },
                { label: "ภาษา", value: 2 },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-3xl font-semibold"
                    style={{ color: SAGE }}
                  >
                    {value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Sold / Adapted ─── */}
        {soldBooks.length > 0 && (
          <section className="bg-cream py-16">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-2xl font-medium text-ink">ดัดแปลงแล้ว</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {soldBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-6 overflow-hidden rounded-2xl border border-black/5 bg-white p-6"
                  >
                    <div
                      className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl"
                      style={{ backgroundColor: book.bg ?? "#7a6b55" }}
                    >
                      {book.coverImage && (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <div className="flex flex-wrap gap-2">
                        {book.adaptationType && (
                          <span
                            className="rounded-full px-3 py-0.5 text-xs font-medium"
                            style={{ background: "#EBF2EC", color: SAGE }}
                          >
                            {book.adaptationType}
                          </span>
                        )}
                        <span
                          className="rounded-full px-3 py-0.5 text-xs font-medium text-white"
                          style={{ background: SAGE }}
                        >
                          ดัดแปลงแล้ว
                        </span>
                      </div>
                      <h3 className="font-medium text-ink">{book.title}</h3>
                      {book.author && (
                        <p className="text-sm text-muted">{book.author}</p>
                      )}
                      {book.logline && (
                        <p className="line-clamp-2 text-sm text-ink/70">
                          {book.logline}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Available / Translation ─── */}
        {availableBooks.length > 0 && (
          <section className="bg-cream py-16">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-2xl font-medium text-ink">พร้อมดัดแปลง</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableBooks.map((book) => (
                  <div
                    key={book.id}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white"
                  >
                    <div
                      className="relative aspect-[3/2] overflow-hidden"
                      style={{ backgroundColor: book.bg ?? "#7a6b55" }}
                    >
                      {book.coverImage && (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      )}
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-0.5 text-xs font-medium text-white"
                        style={{
                          background:
                            book.adaptationStatus === "translation"
                              ? "#2563eb"
                              : SAGE,
                        }}
                      >
                        {book.adaptationStatus === "translation"
                          ? "พร้อมแปล"
                          : "พร้อมดัดแปลง"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-medium text-ink">{book.title}</h3>
                      {book.author && (
                        <p className="mt-0.5 text-sm text-muted">{book.author}</p>
                      )}
                      {book.logline && (
                        <p className="mt-2 line-clamp-2 text-sm text-ink/70">
                          {book.logline}
                        </p>
                      )}
                      {book.category && (
                        <div className="mt-3">
                          <span className="rounded border border-black/10 px-2 py-0.5 text-[11px] text-muted">
                            {book.category}
                          </span>
                        </div>
                      )}
                      {book.availableLanguages &&
                        book.availableLanguages.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {book.availableLanguages.map((lang) => (
                              <span
                                key={lang}
                                className="rounded border border-black/10 px-2 py-0.5 text-[11px] text-muted"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="mt-4 flex gap-2">
                        {book.adaptationStatus === "translation" ? (
                          <a
                            href={`mailto:rights@medarynbook.com?subject=Translation Rights: ${encodeURIComponent(book.title)}`}
                            className="flex-1 rounded-full border border-black/10 py-2 text-center text-xs text-ink transition hover:border-sage hover:text-sage"
                          >
                            ขอลิขสิทธิ์แปล
                          </a>
                        ) : (
                          <>
                            <a
                              href={`mailto:rights@medarynbook.com?subject=Pitch Deck Request: ${encodeURIComponent(book.title)}`}
                              className="flex-1 rounded-full border border-black/10 py-2 text-center text-xs text-ink transition hover:border-sage hover:text-sage"
                            >
                              ขอ Pitch Deck
                            </a>
                            <a
                              href={`mailto:rights@medarynbook.com?subject=Adaptation Rights: ${encodeURIComponent(book.title)}`}
                              className="rounded-full px-4 py-2 text-xs text-white"
                              style={{ background: SAGE }}
                            >
                              ขอลิขสิทธิ์
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {soldBooks.length === 0 && availableBooks.length === 0 && (
          <section className="bg-cream py-20">
            <div className="mx-auto max-w-6xl px-6 text-center">
              <p className="text-muted">
                กำลังอัปเดตข้อมูลผลงาน โปรดติดต่อโดยตรงที่{" "}
                <a
                  href="mailto:rights@medarynbook.com"
                  className="text-sage underline"
                >
                  rights@medarynbook.com
                </a>
              </p>
            </div>
          </section>
        )}

        {/* ─── CTA Section ─── */}
        <section className="py-20 text-white" style={{ background: INK }}>
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-10 text-center text-2xl font-medium">
              สนใจร่วมงานกับเรา
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Pitch Deck",
                  desc: "เอกสารนำเสนอผลงานสำหรับโปรดักชันเฮ้าส์และนักลงทุน",
                  href: "mailto:rights@medarynbook.com?subject=Pitch Deck Request",
                  btn: "ขอ Pitch Deck",
                },
                {
                  title: "ลิขสิทธิ์แปล",
                  desc: "เปิดรับการแปลผลงานสู่ภาษาต่างประเทศ พร้อมทีมประสานงาน",
                  href: "mailto:rights@medarynbook.com?subject=Translation Rights",
                  btn: "ติดต่อทีมแปล",
                },
                {
                  title: "ดัดแปลงสื่อ",
                  desc: "ร่วมพัฒนาผลงานสู่ซีรีส์ ภาพยนตร์ และสื่ออื่นๆ",
                  href: "mailto:rights@medarynbook.com?subject=Media Adaptation",
                  btn: "เริ่มต้นเจรจา",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl p-8"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <h3 className="text-lg font-medium text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/60">{card.desc}</p>
                  <a
                    href={card.href}
                    className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm text-white transition hover:bg-white hover:text-ink"
                    style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                  >
                    {card.btn}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Rights Footer ─── */}
        <footer
          className="py-12 text-white"
          style={{
            background: INK,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center gap-8">
              <Image
                src="/images/logo.png"
                alt="Medaryn Book"
                width={110}
                height={38}
                style={{ height: 32, width: "auto" }}
              />

              <div
                className="rounded-xl px-8 py-5 text-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-sm text-white/60">ติดต่อฝ่ายลิขสิทธิ์</p>
                <p className="mt-1 text-lg font-medium text-white">
                  rights@medarynbook.com
                </p>
                <a
                  href="mailto:rights@medarynbook.com"
                  className="mt-3 inline-block rounded-full px-6 py-2 text-sm font-medium text-white"
                  style={{ background: SAGE }}
                >
                  ส่งอีเมล
                </a>
              </div>

              <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/" className="transition hover:text-white">
                  หน้าแรก
                </Link>
                <Link
                  href="/bookstore"
                  className="transition hover:text-white"
                >
                  ร้านหนังสือ
                </Link>
                <Link
                  href="/rights"
                  className="text-white"
                >
                  ลิขสิทธิ์
                </Link>
              </nav>

              <div className="flex flex-wrap items-center justify-center gap-6">
                {footerLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 transition hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              <p className="text-xs text-white/30">{copyright}</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
