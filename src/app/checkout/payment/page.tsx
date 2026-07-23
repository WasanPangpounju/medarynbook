"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import { formatBaht, getLastOrder, type OrderSummary } from "@/lib/cart";
import { payment as defaultPayment, type PaymentContent } from "@/data/content";

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function PaymentPage() {
  const router = useRouter();
  const [order] = useState<OrderSummary | null>(getLastOrder);
  const [tab, setTab] = useState<"promptpay" | "transfer">(
    () => order?.paymentMethod ?? "promptpay"
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentContent>(defaultPayment);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/payment")
      .then((r) => r.json())
      .then((data) => setPaymentConfig(data))
      .catch(() => {}); // fallback ค่า default ถ้า API fail
  }, []);

  const deadline = useMemo(() => {
    if (!order) return null;
    return new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000;
  }, [order]);

  const remaining = deadline ? deadline - now : 0;

  function handleFileSelect(selected: File | null) {
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  }

  async function handleCopy(account: string) {
    await navigator.clipboard.writeText(account);
    setCopiedAccount(account);
    setTimeout(() => setCopiedAccount(null), 1500);
  }

  async function handleSubmitSlip() {
    if (!file || !order || submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/orders/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          slipImageUrl: uploadData.url,
          notes,
          status: "payment_submitted",
        }),
      });
    } catch {
      // continue to confirmation even if the upload failed; user can resend later
    } finally {
      setSubmitting(false);
      router.push("/checkout/confirmation");
    }
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-cream">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <p className="text-sm text-muted">ไม่พบคำสั่งซื้อ กรุณาทำรายการที่หน้าตะกร้าก่อน</p>
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
        <div className="mx-auto max-w-6xl px-6 py-8">
          <StepIndicator current={3} />

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <section className="rounded-xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-medium text-ink">เลขที่คำสั่งซื้อ: {order.orderId}</h2>
                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                    เหลือเวลาชำระเงิน {formatCountdown(remaining)}
                  </span>
                </div>

                <div className="mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("promptpay")}
                    className={`rounded-full px-4 py-1.5 text-sm ${
                      tab === "promptpay" ? "bg-sage text-white" : "border border-black/10 text-ink"
                    }`}
                  >
                    พร้อมเพย์
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("transfer")}
                    className={`rounded-full px-4 py-1.5 text-sm ${
                      tab === "transfer" ? "bg-sage text-white" : "border border-black/10 text-ink"
                    }`}
                  >
                    โอนธนาคาร
                  </button>
                </div>

                {tab === "promptpay" ? (
                  <div className="space-y-4">
                    <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-dashed border-black/10 bg-sage-light text-sm text-muted">
                      {paymentConfig.qrCodeImage ? (
                        <Image
                          src={paymentConfig.qrCodeImage}
                          alt="QR พร้อมเพย์"
                          width={192}
                          height={192}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        "QR พร้อมเพย์"
                      )}
                    </div>
                    {paymentConfig.promptPayNumber && (
                      <p className="text-sm text-muted">พร้อมเพย์: {paymentConfig.promptPayNumber}</p>
                    )}
                    <p className="text-sm font-medium text-ink">ยอดที่ต้องชำระ: ฿{formatBaht(order.total)}</p>
                    <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
                      <li>เปิดแอปธนาคารของท่าน</li>
                      <li>สแกน QR Code ด้านบน</li>
                      <li>ตรวจสอบยอดเงินให้ถูกต้อง</li>
                      <li>ยืนยันการชำระเงินและบันทึกสลิป</li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentConfig.bankAccounts.map((bank) => (
                      <div
                        key={`${bank.bankName}-${bank.accountNumber}`}
                        className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-ink">{bank.bankName}</p>
                          {bank.accountName && <p className="text-ink">{bank.accountName}</p>}
                          <p className="text-muted">{bank.accountNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(bank.accountNumber)}
                          className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink hover:border-sage"
                        >
                          {copiedAccount === bank.accountNumber ? "คัดลอกแล้ว" : "คัดลอก"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-4 text-base font-medium text-ink">อัปโหลดสลิป</h2>
                <div
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/10 px-6 py-10 text-center hover:border-sage"
                >
                  <p className="text-sm text-muted">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
                  <p className="text-xs text-muted">รองรับไฟล์รูปภาพ และ PDF</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(event) => handleFileSelect(event.target.files?.[0] ?? null)}
                  />
                </div>

                {previewUrl && file?.type.startsWith("image/") && (
                  <div className="relative mt-4 h-40 w-40 overflow-hidden rounded-lg">
                    <Image
                      src={previewUrl}
                      alt="ตัวอย่างสลิป"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                {file && !file.type.startsWith("image/") && (
                  <p className="mt-4 text-sm text-ink">ไฟล์ที่เลือก: {file.name}</p>
                )}

                <label className="mt-4 block text-sm text-ink">
                  <span className="mb-1 block">หมายเหตุ</span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                </label>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-1 text-base font-medium text-ink">สรุปคำสั่งซื้อ</h2>
                <span className="mb-4 inline-block rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                  รอการแจ้งชำระเงิน
                </span>

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

                <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
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
                  <div className="flex justify-between border-t border-black/5 pt-2 text-base font-medium text-ink">
                    <span>ยอดรวม</span>
                    <span>฿{formatBaht(order.total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitSlip}
                  disabled={!file || submitting}
                  className="mt-6 w-full rounded-full bg-sage py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {submitting ? "กำลังส่ง..." : "ส่งหลักฐาน"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="mt-2 w-full rounded-full border border-black/10 py-3 text-sm text-ink"
                >
                  กลับแก้ไข
                </button>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
