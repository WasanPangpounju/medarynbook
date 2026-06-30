import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getEvents, getSocialPosts, getSiteSettings } from "@/sanity/queries";
import type { SanityEvent, SanitySocialPost } from "@/sanity/queries";

export const revalidate = 60;

const INK = "#1C1C1A";
const SAGE = "#4E7358";
const SAGE_MID = "#7FA882";

const EVENT_TYPE_LABELS: Record<string, string> = {
  meet: "Meet & Greet",
  launch: "งานเปิดตัวหนังสือ",
  live: "Live / คลิป",
  interview: "สัมภาษณ์",
  fair: "Book Fair",
};

const FILTER_LABELS = [
  "ทั้งหมด",
  "กำลังจะมาถึง",
  "Meet & Greet",
  "งานเปิดตัวหนังสือ",
  "Live คลิป",
  "สัมภาษณ์",
];

const PLATFORM_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  facebook: { bg: "#1877f2", color: "#fff", label: "Facebook" },
  tiktok: { bg: "#010101", color: "#fff", label: "TikTok" },
  instagram: { bg: "#e1306c", color: "#fff", label: "Instagram" },
  youtube: { bg: "#ff0000", color: "#fff", label: "YouTube" },
};

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDateBoxBg(event: SanityEvent): string {
  if (event.isAnnounced === false) return "#6B6B65";
  if (event.eventType === "meet") return SAGE;
  if (event.eventType === "launch") return INK;
  return "#4a6670";
}

function getEventDateLabel(event: SanityEvent): { day: string; month: string } {
  if (event.isAnnounced === false) return { day: "??", month: "เร็วๆ นี้" };
  if (!event.date) return { day: "–", month: "" };
  const d = parseLocalDate(event.date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("th-TH", { month: "short" });
  return { day, month };
}

function getSocialHref(
  links: Array<{ label?: string; href?: string }>,
  label: string
): string {
  return (
    links.find((s) => s.label?.toLowerCase() === label.toLowerCase())?.href ?? "#"
  );
}

function EventCard({ event }: { event: SanityEvent }) {
  const { day, month } = getEventDateLabel(event);
  const dateBg = getDateBoxBg(event);
  const typeLabel = event.eventType
    ? (EVENT_TYPE_LABELS[event.eventType] ?? event.eventType)
    : null;

  const hasRegisterLink = event.registerUrl && event.isAnnounced !== false;
  const isUnannounced = event.isAnnounced === false;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-black/5 bg-white p-5">
      {/* Date box */}
      <div
        className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white"
        style={{ background: dateBg }}
      >
        <span className="text-xl font-semibold leading-none">{day}</span>
        <span className="text-[11px] mt-1 opacity-80">{month}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {typeLabel && (
          <span
            className="text-[11px] tracking-widest uppercase font-medium"
            style={{ color: SAGE_MID }}
          >
            {typeLabel}
          </span>
        )}
        <p className="mt-0.5 text-base font-medium text-ink leading-snug">
          {event.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted">
          {event.location && <span>{event.location}</span>}
          {event.timeStart && (
            <span>
              {event.timeStart}
              {event.timeEnd ? ` – ${event.timeEnd}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      {hasRegisterLink ? (
        <a
          href={event.registerUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 self-start sm:self-auto rounded-full px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: SAGE }}
        >
          ลงทะเบียน
        </a>
      ) : isUnannounced ? (
        <span
          className="flex-shrink-0 self-start sm:self-auto rounded-full px-5 py-2 text-sm font-medium cursor-default"
          style={{ background: "rgba(0,0,0,0.06)", color: "#999" }}
        >
          แจ้งเตือน
        </span>
      ) : (
        <span
          className="flex-shrink-0 self-start sm:self-auto rounded-full px-5 py-2 text-sm font-medium cursor-default"
          style={{ background: "rgba(0,0,0,0.06)", color: "#999" }}
        >
          สนใจเข้าร่วม
        </span>
      )}
    </div>
  );
}

function SocialCard({ post }: { post: SanitySocialPost }) {
  const badge = PLATFORM_BADGE[post.platform] ?? {
    bg: "#555",
    color: "#fff",
    label: post.platform,
  };

  const publishedStr = post.publishedAt
    ? parseLocalDate(post.publishedAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden" style={{ background: "#2a2a28" }}>
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.caption ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-4xl select-none">▶</span>
          </div>
        )}

        {/* Platform badge */}
        <span
          className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>

        {/* Play icon overlay */}
        {post.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Likes badge */}
        {post.likes && (
          <span
            className="absolute bottom-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            ♥ {post.likes}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {publishedStr && (
          <p className="text-[11px] text-muted mb-1">{publishedStr}</p>
        )}
        {post.caption && (
          <p className="text-sm text-ink leading-relaxed line-clamp-3">{post.caption}</p>
        )}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: SAGE }}
          >
            ดูโพสต์ต้นฉบับ →
          </a>
        )}
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const [events, socialPosts, siteSettings] = await Promise.all([
    getEvents(),
    getSocialPosts(),
    getSiteSettings(),
  ]);

  const eventList = events ?? [];
  const postList = socialPosts ?? [];
  const socialLinks = siteSettings?.footer?.social ?? [];

  const heroPills = [
    {
      label: "Facebook",
      bg: "rgba(24,119,242,0.15)",
      color: "#60a4f8",
      href: getSocialHref(socialLinks, "Facebook"),
    },
    {
      label: "TikTok",
      bg: "rgba(255,255,255,0.08)",
      color: "#ffffff",
      href: getSocialHref(socialLinks, "TikTok"),
    },
    {
      label: "Instagram",
      bg: "rgba(225,48,108,0.15)",
      color: "#f48fb1",
      href: getSocialHref(socialLinks, "Instagram"),
    },
    {
      label: "YouTube",
      bg: "rgba(255,0,0,0.12)",
      color: "#ef9a9a",
      href: getSocialHref(socialLinks, "YouTube"),
    },
  ];

  const ctaPlatforms = [
    { label: "Facebook", href: getSocialHref(socialLinks, "Facebook") },
    { label: "TikTok", href: getSocialHref(socialLinks, "TikTok") },
    { label: "Instagram", href: getSocialHref(socialLinks, "Instagram") },
    { label: "YouTube", href: getSocialHref(socialLinks, "YouTube") },
  ];

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
              EVENTS & SOCIAL
            </span>
            <h1 className="mt-4 text-4xl font-medium text-white">
              กิจกรรมและความเคลื่อนไหว
            </h1>
            <p className="mt-4 max-w-xl text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              ติดตามกิจกรรม meet &amp; greet, งานเปิดตัวหนังสือ
              และอัปเดตล่าสุดจากนักเขียน
            </p>

            {/* Social pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              {heroPills.map((pill) => (
                <a
                  key={pill.label}
                  href={pill.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{ background: pill.bg, color: pill.color }}
                >
                  {pill.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Filter Bar (UI decoration) ─── */}
        <section
          className="border-b border-black/5 bg-white py-4 sticky z-40"
          style={{ top: 64 }}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {FILTER_LABELS.map((label, i) => (
                <button
                  key={label}
                  className="shrink-0 rounded-full px-4 py-1.5 text-sm transition"
                  style={
                    i === 0
                      ? { background: INK, color: "#fff" }
                      : { border: "1px solid rgba(0,0,0,0.12)", color: "#555" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Events ─── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-medium text-ink">
              กิจกรรมที่กำลังจะมาถึง
            </h2>
            <p className="mt-2 text-muted">
              Meet &amp; greet, งานเปิดตัวหนังสือ และกิจกรรมพิเศษจากนักเขียน Medaryn Book
            </p>

            {eventList.length === 0 ? (
              <div className="mt-10 flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white"
                  style={{ background: "#6B6B65" }}
                >
                  <span className="text-xl font-semibold leading-none">??</span>
                  <span className="text-[11px] mt-1 opacity-80">เร็วๆ นี้</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">กำลังอัปเดตกิจกรรม</p>
                  <p className="text-sm text-muted">ติดตามกิจกรรมใหม่ได้เร็วๆ นี้</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                {eventList.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Divider ─── */}
        <div className="mx-auto max-w-6xl px-6">
          <hr style={{ borderColor: "rgba(0,0,0,0.08)" }} />
        </div>

        {/* ─── Social Feed ─── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-medium text-ink">Social Feed</h2>
            <p className="mt-2 text-muted">
              อัปเดตล่าสุดจากช่องทางโซเชียลมีเดียของนักเขียน
            </p>

            {postList.length === 0 ? (
              <div className="mt-10 py-12 text-center text-muted">
                กำลังอัปเดต Social Feed — กลับมาใหม่เร็วๆ นี้
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {postList.map((post) => (
                  <SocialCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── CTA Bar ─── */}
        <section className="py-14" style={{ background: SAGE }}>
          <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <p className="text-white text-lg font-medium text-center sm:text-left">
              ไม่พลาดทุกอัปเดต — ติดตามนักเขียนบนโซเชียลมีเดีย
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {ctaPlatforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
