"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import { formatBaht, getLastOrder, type OrderSummary } from "@/lib/cart";

function CopyIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

const TIMELINE = [
  { label: "รับคำสั่งซื้อแล้ว", state: "done" as const },
  { label: "ได้รับสลิป", state: "done" as const },
  { label: "กำลังตรวจสอบ", state: "active" as const },
  { label: "กำลังแพ็กและจัดส่ง", state: "pending" as const },
  { label: "จัดส่งสำเร็จ", state: "pending" as const },
];

export default function ConfirmationPage() {
  const [order] = useState<OrderSummary | null>(getLastOrder);
  const [copied, setCopied] = useState(false);

  function copyOrderId() {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-cream">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <p className="text-sm text-muted">ไม่พบคำสั่งซื้อ</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <StepIndicator current={4} />

          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
            <p className="text-4xl">✅</p>
            <h1 className="mt-3 text-xl font-medium text-ink">ส่งหลักฐานสำเร็จ</h1>
            <p className="mt-1 text-sm text-muted">เราได้รับหลักฐานการชำระเงินของคุณแล้ว</p>

            <div className="mt-5 flex flex-col items-center gap-2">
              <p className="text-2xl font-semibold tracking-wide text-ink">
                {order.orderId}
              </p>
              <button
                type="button"
                onClick={copyOrderId}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 text-xs text-muted transition hover:border-sage hover:text-sage"
              >
                <CopyIcon />
                {copied ? "คัดลอกแล้ว ✓" : "คัดลอก Order ID"}
              </button>
              <p className="text-xs text-muted">เก็บ Order ID นี้ไว้ตรวจสอบสถานะ</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-8">
            <h2 className="mb-6 text-base font-medium text-ink">สถานะคำสั่งซื้อ</h2>
            <ol className="space-y-4">
              {TIMELINE.map((step) => (
                <li key={step.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                      step.state === "done"
                        ? "bg-sage text-white"
                        : step.state === "active"
                          ? "bg-yellow-400 text-white"
                          : "bg-black/5 text-muted"
                    }`}
                  >
                    {step.state === "done" ? "✓" : step.state === "active" ? "⏳" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      step.state === "pending" ? "text-muted" : "text-ink font-medium"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h3 className="mb-2 text-sm font-medium text-ink">ที่อยู่จัดส่ง</h3>
              <p className="text-sm text-muted">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-muted">{order.customer.address}</p>
              <p className="text-sm text-muted">
                {order.customer.province} {order.customer.zipcode}
              </p>
              <p className="text-sm text-muted">{order.customer.phone}</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h3 className="mb-2 text-sm font-medium text-ink">สรุปยอด</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{formatBaht(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{formatBaht(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sage">
                    <span>ส่วนลด</span>
                    <span>-฿{formatBaht(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-black/5 pt-1 font-medium text-ink">
                  <span>ยอดรวม</span>
                  <span>฿{formatBaht(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
            <h3 className="mb-3 text-sm font-medium text-ink">รายการหนังสือ</h3>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.title} className="flex justify-between">
                  <span className="text-ink">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-muted">฿{formatBaht(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            เราได้ส่งอีเมลยืนยันคำสั่งซื้อไปที่ {order.customer.email} แล้ว
          </p>

          <div className="mt-6 rounded-2xl border border-sage/30 bg-sage-light p-6 text-center">
            <h3 className="text-sm font-medium text-ink">สมัครสมาชิก Medaryn Book</h3>
            <p className="mt-1 text-sm text-muted">รับสิทธิพิเศษและส่วนลดก่อนใคร</p>
            <button
              type="button"
              className="mt-3 rounded-full bg-sage px-5 py-2 text-sm font-medium text-white"
            >
              สมัครสมาชิก
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/track?orderId=${encodeURIComponent(order.orderId)}`}
              className="rounded-full bg-sage px-6 py-2.5 text-sm font-medium text-white"
            >
              ติดตามสถานะ
            </Link>
            <Link
              href="/bookstore"
              className="rounded-full border border-black/10 px-6 py-2.5 text-sm text-ink"
            >
              ช้อปต่อ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
