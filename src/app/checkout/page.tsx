"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import {
  clearCart,
  formatBaht,
  generateOrderId,
  getCart,
  removeFromCart,
  setLastOrder,
  setPendingOrderId,
  updateCartItem,
  type CartItem,
  type DeliveryMethod,
  type PaymentMethod,
} from "@/lib/cart";

type PromoValidationResponse = {
  valid: boolean;
  code?: string;
  discountType?: "percent" | "fixed" | "gift" | "freeshipping";
  discountValue?: number;
  discountAmount?: number;
  giftDescription?: string | null;
  description?: string | null;
  message?: string;
};

type ShippingConfig = {
  registeredFee: number;
  emsFee: number;
  freeShippingThreshold: number;
  freeShippingActive: boolean;
};

const defaultShippingConfig: ShippingConfig = {
  registeredFee: 40,
  emsFee: 80,
  freeShippingThreshold: 0,
  freeShippingActive: false,
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  zipcode: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  province: "",
  zipcode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [form, setForm] = useState<FormState>(initialForm);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("registered");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("promptpay");
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [freeShippingFromPromo, setFreeShippingFromPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(defaultShippingConfig);

  useEffect(() => {
    fetch("/api/shipping")
      .then((r) => r.json())
      .then((data) => setShippingConfig(data))
      .catch(() => {}); // fallback ค่า default ถ้า API fail
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const calculateShipping = (method: DeliveryMethod, amount: number) => {
    if (
      shippingConfig.freeShippingActive &&
      shippingConfig.freeShippingThreshold > 0 &&
      amount >= shippingConfig.freeShippingThreshold
    ) {
      return 0;
    }
    if (method === "registered") return shippingConfig.registeredFee;
    if (method === "ems") return shippingConfig.emsFee;
    return 0;
  };

  const displayShippingFee = (method: DeliveryMethod) =>
    freeShippingFromPromo ? 0 : calculateShipping(method, subtotal);

  const shippingFee = displayShippingFee(deliveryMethod);
  const total = subtotal - discount + shippingFee;

  function handleIncrease(item: CartItem) {
    updateCartItem(item.title, item.quantity + 1);
    setCart(getCart());
  }

  function handleDecrease(item: CartItem) {
    updateCartItem(item.title, item.quantity - 1);
    setCart(getCart());
  }

  function handleRemove(item: CartItem) {
    removeFromCart(item.title);
    setCart(getCart());
  }

  async function applyPromoCode() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    try {
      const res = await fetch(
        `/api/promo?code=${encodeURIComponent(code)}&subtotal=${subtotal}&quantity=${totalQuantity}`
      );
      const data: PromoValidationResponse = await res.json();

      if (data.valid) {
        setPromoCode(data.code ?? code);
        setDiscount(data.discountAmount ?? 0);
        setFreeShippingFromPromo(data.discountType === "freeshipping");
        setPromoError(null);
      } else {
        setPromoCode(null);
        setDiscount(0);
        setFreeShippingFromPromo(false);
        setPromoError(data.message ?? "โค้ดส่วนลดไม่ถูกต้อง");
      }
    } catch {
      setPromoCode(null);
      setDiscount(0);
      setFreeShippingFromPromo(false);
      setPromoError("ไม่สามารถตรวจสอบโค้ดส่วนลดได้ในขณะนี้");
    }
  }

  const canSubmit =
    cart.length > 0 &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.province.trim() &&
    form.zipcode.trim();

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const orderId = generateOrderId();
    const createdAt = new Date().toISOString();

    setLastOrder({
      orderId,
      customer: form,
      deliveryMethod,
      paymentMethod,
      items: cart,
      subtotal,
      shippingFee,
      discount,
      total,
      promoCode: promoCode ?? undefined,
      createdAt,
    });
    setPendingOrderId(orderId);
    clearCart();

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            address: form.address,
            province: form.province,
            zipcode: form.zipcode,
          },
          deliveryMethod,
          paymentMethod,
          items: cart.map((item) => ({
            bookTitle: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          shippingFee,
          discount,
          total,
          promoCode: promoCode ?? undefined,
        }),
      });
    } catch {
      // localStorage already has the order; continue to payment step regardless.
    }

    router.push("/checkout/payment");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <StepIndicator current={2} />

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-4 text-base font-medium text-ink">ข้อมูลผู้รับ</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="ชื่อ">
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="นามสกุล">
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="อีเมล">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="เบอร์โทร">
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="ที่อยู่" full>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="input"
                      rows={2}
                    />
                  </Field>
                  <Field label="จังหวัด">
                    <input
                      value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="รหัสไปรษณีย์">
                    <input
                      value={form.zipcode}
                      onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
                      className="input"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-4 text-base font-medium text-ink">รูปแบบการจัดส่ง</h2>
                <div className="space-y-2">
                  <RadioOption
                    name="delivery"
                    checked={deliveryMethod === "registered"}
                    onChange={() => setDeliveryMethod("registered")}
                    label="ไปรษณีย์ลงทะเบียน"
                    price={
                      displayShippingFee("registered") === 0
                        ? "ฟรี"
                        : `฿${formatBaht(displayShippingFee("registered"))}`
                    }
                  />
                  <RadioOption
                    name="delivery"
                    checked={deliveryMethod === "ems"}
                    onChange={() => setDeliveryMethod("ems")}
                    label="EMS"
                    price={
                      displayShippingFee("ems") === 0
                        ? "ฟรี"
                        : `฿${formatBaht(displayShippingFee("ems"))}`
                    }
                  />
                </div>
              </section>

              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-4 text-base font-medium text-ink">ช่องทางชำระเงิน</h2>
                <div className="space-y-2">
                  <RadioOption
                    name="payment"
                    checked={paymentMethod === "promptpay"}
                    onChange={() => setPaymentMethod("promptpay")}
                    label="พร้อมเพย์"
                  />
                  <RadioOption
                    name="payment"
                    checked={paymentMethod === "transfer"}
                    onChange={() => setPaymentMethod("transfer")}
                    label="โอนเงิน"
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-black/5 bg-white p-6">
                <h2 className="mb-4 text-base font-medium text-ink">สรุปคำสั่งซื้อ</h2>
                {cart.length === 0 ? (
                  <p className="text-sm text-muted">ตะกร้าของคุณว่างเปล่า</p>
                ) : (
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <li key={item.title} className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex-1 text-ink">{item.title}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            className="h-6 w-6 rounded-full border border-black/10 text-ink hover:border-sage"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-ink">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="h-6 w-6 rounded-full border border-black/10 text-ink hover:border-sage"
                          >
                            +
                          </button>
                        </div>
                        <span className="w-20 text-right text-muted">
                          ฿{formatBaht(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          aria-label={`ลบ ${item.title}`}
                          className="text-muted hover:text-red-500"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="โค้ดส่วนลด"
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="rounded-lg border border-black/10 px-3 text-sm text-ink hover:border-sage"
                  >
                    ใช้โค้ด
                  </button>
                </div>
                {promoError && <p className="mt-1 text-xs text-red-500">{promoError}</p>}
                {promoCode && (
                  <p className="mt-1 text-xs text-sage">ใช้โค้ด {promoCode} แล้ว</p>
                )}

                <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{formatBaht(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>ค่าจัดส่ง</span>
                    <span>฿{formatBaht(shippingFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sage">
                      <span>ส่วนลด</span>
                      <span>-฿{formatBaht(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-black/5 pt-2 text-base font-medium text-ink">
                    <span>ยอดรวม</span>
                    <span>฿{formatBaht(total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="mt-6 w-full rounded-full bg-sage py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {submitting ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
                </button>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #4e7358;
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm text-ink ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
  price,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  price?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm ${
        checked ? "border-sage bg-sage-light" : "border-black/10"
      }`}
    >
      <span className="flex items-center gap-2">
        <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-sage" />
        {label}
      </span>
      {price && <span className="text-muted">{price}</span>}
    </label>
  );
}
