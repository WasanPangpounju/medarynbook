import { NextRequest, NextResponse } from "next/server";
import { getPromoCodeByCode } from "@/sanity/queries";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal") ?? 0);
  const quantity = Number(req.nextUrl.searchParams.get("quantity") ?? 0);

  if (!code) {
    return NextResponse.json({ valid: false, message: "กรุณาใส่โค้ดส่วนลด" });
  }

  const promo = await getPromoCodeByCode(code.trim().toUpperCase());

  if (!promo) {
    return NextResponse.json({ valid: false, message: "ไม่พบโค้ดส่วนลดนี้" });
  }
  if (!promo.isActive) {
    return NextResponse.json({ valid: false, message: "โค้ดนี้ถูกยกเลิกแล้ว" });
  }
  if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ valid: false, message: "โค้ดนี้ถูกใช้ครบจำนวนแล้ว" });
  }
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, message: "โค้ดนี้หมดอายุแล้ว" });
  }

  for (const cond of promo.conditions ?? []) {
    if (cond.conditionType === "minAmount" && subtotal < cond.value) {
      return NextResponse.json({
        valid: false,
        message: cond.errorMessage || `ต้องซื้อครบ ฿${cond.value.toLocaleString()} ก่อนใช้โค้ดนี้`,
      });
    }
    if (cond.conditionType === "minQuantity" && quantity < cond.value) {
      return NextResponse.json({
        valid: false,
        message: cond.errorMessage || `ต้องซื้ออย่างน้อย ${cond.value} เล่มก่อนใช้โค้ดนี้`,
      });
    }
  }

  let discountAmount = 0;
  if (promo.discountType === "percent") {
    discountAmount = Math.round((subtotal * promo.discountValue) / 100);
  } else if (promo.discountType === "fixed") {
    discountAmount = promo.discountValue;
  }

  return NextResponse.json({
    valid: true,
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount,
    giftDescription: promo.giftDescription ?? null,
    description: promo.description ?? null,
    message:
      promo.discountType === "gift"
        ? `ของแถม: ${promo.giftDescription ?? "ของที่ระลึก"}`
        : promo.discountType === "freeshipping"
          ? "ได้รับส่วนลดค่าจัดส่งฟรี!"
          : `ส่วนลด ${promo.discountType === "percent" ? `${promo.discountValue}%` : `฿${promo.discountValue}`} (฿${discountAmount.toLocaleString()})`,
  });
}
