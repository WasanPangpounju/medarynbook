"use client";

import { useState } from "react";
import { formatBaht } from "@/lib/cart";

type FoundOrder = {
  orderId: string;
  customerEmail: string;
  total?: number;
  status?: string;
};

export default function PaymentNoticeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<FoundOrder | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSearch() {
    setError(null);
    if (!query.trim()) {
      setError("กรุณากรอกเลขที่คำสั่งซื้อหรืออีเมล");
      return;
    }
    setSearching(true);
    try {
      const isEmail = query.includes("@");
      const params = new URLSearchParams(
        isEmail ? { email: query.trim() } : { orderId: query.trim() }
      );
      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) {
        setError("ไม่พบคำสั่งซื้อนี้");
        setOrder(null);
        return;
      }
      const data = await res.json();
      setOrder(data.order);
      setStep(2);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmitSlip() {
    if (!order || !file) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/orders/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          slipImageUrl: uploadData.url,
          status: "payment_submitted",
        }),
      });

      setSubmitted(true);
    } catch {
      setError("ส่งหลักฐานไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-ink">แจ้งชำระเงิน</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="space-y-3 py-6 text-center">
            <p className="text-2xl">✅</p>
            <p className="text-sm font-medium text-ink">ส่งหลักฐานสำเร็จ</p>
            <p className="text-xs text-muted">เราจะตรวจสอบและแจ้งผลทางอีเมล</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-full bg-sage py-2 text-sm font-medium text-white"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">กรอกเลขที่คำสั่งซื้อ หรืออีเมลที่ใช้สั่งซื้อ</p>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="เช่น MDB-XXXXXX หรือ email@example.com"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-sage"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="w-full rounded-full bg-sage py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {searching ? "กำลังค้นหา..." : "ค้นหาคำสั่งซื้อ"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {order && (
              <div className="rounded-lg bg-sage-light p-4 text-sm">
                <p className="font-medium text-ink">เลขที่คำสั่งซื้อ: {order.orderId}</p>
                <p className="text-muted">{order.customerEmail}</p>
                {order.total != null && (
                  <p className="mt-1 font-medium text-sage">ยอดที่ต้องชำระ: ฿{formatBaht(order.total)}</p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm text-ink">อัปโหลดสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border border-black/10 py-2.5 text-sm text-ink"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleSubmitSlip}
                disabled={!file || submitting}
                className="flex-1 rounded-full bg-sage py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {submitting ? "กำลังส่ง..." : "ส่งหลักฐาน"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
