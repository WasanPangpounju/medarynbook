"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatBaht } from "@/lib/cart";

type TrackOrderItem = {
  bookTitle: string;
  price: number;
  quantity: number;
};

type TrackOrder = {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress?: {
    address?: string;
    province?: string;
    zipcode?: string;
  };
  deliveryMethod?: string;
  paymentMethod?: string;
  items?: TrackOrderItem[];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
  status?: string;
  createdAt?: string;
};

const STATUS_BADGE: Record<string, { label: string; bg: string }> = {
  pending_payment: { label: "รอชำระเงิน", bg: "#d97706" },
  payment_submitted: { label: "แจ้งชำระแล้ว", bg: "#2563eb" },
  confirmed: { label: "ยืนยันแล้ว", bg: "#16a34a" },
  shipped: { label: "จัดส่งแล้ว", bg: "#0891b2" },
  delivered: { label: "ได้รับแล้ว", bg: "#4E7358" },
};

const TIMELINE_LABELS = [
  "รับคำสั่งซื้อแล้ว",
  "ได้รับสลิปแล้ว",
  "กำลังตรวจสอบการชำระ",
  "กำลังแพ็กและจัดส่ง",
  "จัดส่งสำเร็จ",
];

function getStepState(
  stepIndex: number,
  status?: string
): "done" | "active" | "pending" {
  const s = status ?? "pending_payment";

  if (stepIndex === 0) return "done";

  if (stepIndex === 1) {
    return ["payment_submitted", "confirmed", "shipped", "delivered"].includes(s)
      ? "done"
      : "pending";
  }

  if (stepIndex === 2) {
    if (["confirmed", "shipped", "delivered"].includes(s)) return "done";
    if (s === "payment_submitted") return "active";
    return "pending";
  }

  if (stepIndex === 3) {
    if (["shipped", "delivered"].includes(s)) return "done";
    if (s === "confirmed") return "active";
    return "pending";
  }

  if (stepIndex === 4) {
    if (s === "delivered") return "done";
    if (s === "shipped") return "active";
    return "pending";
  }

  return "pending";
}

const DELIVERY_LABELS: Record<string, string> = {
  registered: "ไปรษณีย์ลงทะเบียน",
  ems: "EMS",
};

export default function TrackPageClient() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId") ?? "";

  const [inputOrderId, setInputOrderId] = useState(urlOrderId);
  const [inputPhone, setInputPhone] = useState("");
  const [result, setResult] = useState<TrackOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (overrideOrderId?: string) => {
      const oid = (overrideOrderId ?? inputOrderId).trim();
      const phone = inputPhone.trim();

      if (!oid && !phone) {
        setError("กรุณากรอก Order ID หรือเบอร์โทร");
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const params = new URLSearchParams();
        if (oid) params.set("orderId", oid);
        if (phone) params.set("phone", phone);

        const res = await fetch(`/api/orders?${params.toString()}`);
        if (!res.ok) {
          setError("ไม่พบคำสั่งซื้อ กรุณาตรวจสอบ Order ID หรือเบอร์โทร");
          return;
        }
        const data = await res.json();
        setResult(data.order);
      } catch {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        setLoading(false);
      }
    },
    [inputOrderId, inputPhone]
  );

  useEffect(() => {
    if (!urlOrderId) return;
    const timer = setTimeout(() => {
      void handleSearch(urlOrderId);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-center text-2xl font-medium text-ink">
        ติดตามคำสั่งซื้อ
      </h1>

      {/* Search form */}
      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink">
              เลขที่คำสั่งซื้อ
            </label>
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="MDB-2569-0001"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-sage"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-muted">
            <div className="flex-1 border-t border-black/10" />
            หรือ
            <div className="flex-1 border-t border-black/10" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-ink">เบอร์โทรที่ใช้สั่ง</label>
            <input
              type="tel"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="0812345678"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-sage"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "#4E7358" }}
          >
            {loading ? "กำลังค้นหา..." : "ค้นหาคำสั่งซื้อ"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted">เลขที่คำสั่งซื้อ</p>
                <p className="mt-0.5 text-lg font-semibold text-ink">
                  {result.orderId}
                </p>
                {result.customerName && (
                  <p className="mt-0.5 text-sm text-muted">{result.customerName}</p>
                )}
              </div>
              {result.status && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    background:
                      STATUS_BADGE[result.status]?.bg ?? "#6b7280",
                  }}
                >
                  {STATUS_BADGE[result.status]?.label ?? result.status}
                </span>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="mb-5 text-sm font-medium text-ink">สถานะการสั่งซื้อ</h2>
            <ol className="space-y-4">
              {TIMELINE_LABELS.map((label, i) => {
                const state = getStepState(i, result.status);
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                      style={{
                        background:
                          state === "done"
                            ? "#4E7358"
                            : state === "active"
                              ? "#d97706"
                              : "rgba(0,0,0,0.05)",
                        color:
                          state === "pending" ? "#9ca3af" : "#ffffff",
                      }}
                    >
                      {state === "done" ? "✓" : state === "active" ? "⏳" : "○"}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color:
                          state === "pending"
                            ? "#9ca3af"
                            : state === "active"
                              ? "#d97706"
                              : "#1C1C1A",
                        fontWeight: state !== "pending" ? 500 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Items */}
          {result.items && result.items.length > 0 && (
            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 text-sm font-medium text-ink">รายการหนังสือ</h2>
              <ul className="space-y-2">
                {result.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-ink">
                      {item.bookTitle} × {item.quantity}
                    </span>
                    <span className="text-muted">
                      ฿{formatBaht(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              {result.total != null && (
                <div className="mt-3 flex justify-between border-t border-black/5 pt-3 text-sm font-medium text-ink">
                  <span>ยอดรวมทั้งหมด</span>
                  <span>฿{formatBaht(result.total)}</span>
                </div>
              )}
            </div>
          )}

          {/* Shipping address */}
          {result.shippingAddress && (
            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-3 text-sm font-medium text-ink">ที่อยู่จัดส่ง</h2>
              <div className="space-y-0.5 text-sm text-muted">
                {result.shippingAddress.address && (
                  <p>{result.shippingAddress.address}</p>
                )}
                {(result.shippingAddress.province ||
                  result.shippingAddress.zipcode) && (
                  <p>
                    {result.shippingAddress.province}{" "}
                    {result.shippingAddress.zipcode}
                  </p>
                )}
                {result.deliveryMethod && (
                  <p className="mt-1 text-sage">
                    {DELIVERY_LABELS[result.deliveryMethod] ??
                      result.deliveryMethod}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* CTA for pending payment */}
          {result.status === "pending_payment" && (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: "#EBF2EC" }}
            >
              <p className="text-sm font-medium" style={{ color: "#2d5a3d" }}>
                ยังไม่ได้ชำระเงิน
              </p>
              <p className="mt-1 text-xs" style={{ color: "#4E7358" }}>
                กรุณาชำระเงินและแจ้งหลักฐานเพื่อให้เราดำเนินการต่อ
              </p>
              <Link
                href="/checkout/payment"
                className="mt-3 inline-block rounded-full px-6 py-2.5 text-sm font-medium text-white"
                style={{ background: "#4E7358" }}
              >
                แจ้งชำระเงิน
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
