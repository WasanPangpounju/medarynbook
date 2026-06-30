import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  bookTitle: string;
  price: number;
  quantity: number;
};

type NewOrderEmailParams = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    address?: string;
    province?: string;
    zipcode?: string;
  };
  deliveryMethod?: "registered" | "ems";
  paymentMethod?: "promptpay" | "transfer";
  items?: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
  promoCode?: string;
};

export async function sendNewOrderEmail(order: NewOrderEmailParams) {
  const deliveryLabel = order.deliveryMethod === "ems" ? "EMS" : "ไปรษณีย์ลงทะเบียน";
  const paymentLabel = order.paymentMethod === "transfer" ? "โอนเงิน" : "พร้อมเพย์";

  const itemRows = (order.items ?? [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0ece8;">${item.bookTitle}</td>
          <td style="padding:8px;border-bottom:1px solid #f0ece8;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0ece8;text-align:right;">฿${(item.price * item.quantity).toLocaleString("th-TH")}</td>
        </tr>`
    )
    .join("");

  const addressParts = [
    order.shippingAddress?.address,
    order.shippingAddress?.province,
    order.shippingAddress?.zipcode,
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="th">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f7f4f0;font-family:sans-serif;color:#1C1C1A;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#4e7358;padding:24px 32px;">
      <h1 style="margin:0;font-size:18px;font-weight:600;color:#fff;">คำสั่งซื้อใหม่</h1>
      <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">หมายเลขคำสั่งซื้อ: <strong>${order.orderId}</strong></p>
    </div>

    <div style="padding:24px 32px;">
      <h2 style="font-size:14px;font-weight:600;margin:0 0 12px;color:#4e7358;">ข้อมูลลูกค้า</h2>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:3px 0;color:#888;width:120px;">ชื่อ</td><td>${order.customerName}</td></tr>
        <tr><td style="padding:3px 0;color:#888;">อีเมล</td><td>${order.customerEmail}</td></tr>
        ${order.customerPhone ? `<tr><td style="padding:3px 0;color:#888;">เบอร์โทร</td><td>${order.customerPhone}</td></tr>` : ""}
        ${addressParts.length > 0 ? `<tr><td style="padding:3px 0;color:#888;">ที่อยู่</td><td>${addressParts.join(", ")}</td></tr>` : ""}
        <tr><td style="padding:3px 0;color:#888;">การจัดส่ง</td><td>${deliveryLabel}</td></tr>
        <tr><td style="padding:3px 0;color:#888;">ชำระเงิน</td><td>${paymentLabel}</td></tr>
      </table>

      <h2 style="font-size:14px;font-weight:600;margin:24px 0 12px;color:#4e7358;">รายการสินค้า</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="border-bottom:2px solid #f0ece8;">
            <th style="text-align:left;padding-bottom:8px;font-weight:600;">ชื่อหนังสือ</th>
            <th style="padding-bottom:8px;font-weight:600;text-align:center;">จำนวน</th>
            <th style="padding-bottom:8px;font-weight:600;text-align:right;">ราคา</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <table style="width:100%;font-size:13px;margin-top:16px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#888;">ยอดรวมสินค้า</td><td style="text-align:right;">฿${(order.subtotal ?? 0).toLocaleString("th-TH")}</td></tr>
        <tr><td style="padding:4px 0;color:#888;">ค่าจัดส่ง</td><td style="text-align:right;">฿${(order.shippingFee ?? 0).toLocaleString("th-TH")}</td></tr>
        ${(order.discount ?? 0) > 0 ? `<tr><td style="padding:4px 0;color:#888;">ส่วนลด${order.promoCode ? ` (${order.promoCode})` : ""}</td><td style="text-align:right;color:#4e7358;">-฿${order.discount!.toLocaleString("th-TH")}</td></tr>` : ""}
        <tr style="border-top:2px solid #f0ece8;">
          <td style="padding:10px 0 4px;font-weight:600;">ยอดรวม</td>
          <td style="text-align:right;padding:10px 0 4px;font-weight:600;font-size:15px;color:#4e7358;">฿${(order.total ?? 0).toLocaleString("th-TH")}</td>
        </tr>
      </table>
    </div>

    <div style="padding:16px 32px;background:#f7f4f0;font-size:12px;color:#888;text-align:center;">
      Medaryn Book · อีเมลนี้ส่งอัตโนมัติเมื่อมีคำสั่งซื้อใหม่
    </div>
  </div>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: "Medaryn Book <onboarding@resend.dev>", // TODO: เปลี่ยนเป็น verified domain หลัง verify medarynbook.com ใน Resend
    to: "friendlydev.net@gmail.com",
    subject: `[Medaryn] คำสั่งซื้อใหม่ #${order.orderId} — ${order.customerName}`,
    html,
  });

  if (error) {
    console.error("Resend API error:", error);
    throw new Error(JSON.stringify(error));
  }

  return data;
}

export async function sendCustomerConfirmationEmail(order: NewOrderEmailParams) {
  if (!order.customerEmail) {
    return;
  }

  const itemsHtml = (order.items ?? [])
    .map(
      (i) =>
        `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${i.bookTitle}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center;">${i.quantity}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">฿${i.price.toLocaleString()}</td></tr>`
    )
    .join("");

  const shippingAddress = [
    order.shippingAddress?.address,
    order.shippingAddress?.province,
    order.shippingAddress?.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1C1C1A;">ขอบคุณสำหรับคำสั่งซื้อ! 🎉</h2>
      <p>สวัสดีคุณ ${order.customerName}</p>
      <p>เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว และกำลังดำเนินการจัดส่ง</p>
      <p><strong>หมายเลขคำสั่งซื้อ:</strong> ${order.orderId}</p>
      <p><strong>ที่อยู่จัดส่ง:</strong> ${shippingAddress || "-"}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead>
          <tr style="background:#F7F4EE;">
            <th style="padding:8px 10px;border:1px solid #ddd;text-align:left;">หนังสือ</th>
            <th style="padding:8px 10px;border:1px solid #ddd;">จำนวน</th>
            <th style="padding:8px 10px;border:1px solid #ddd;text-align:right;">ราคา</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="margin-top:16px;font-size:16px;"><strong>ยอดรวม:</strong> ฿${(order.total ?? 0).toLocaleString()}</p>
      <p style="margin-top:20px;color:#6B6B65;font-size:13px;">
        ใช้หมายเลขคำสั่งซื้อนี้เพื่อติดตามสถานะที่ medarynbook.com/track<br/>
        หากมีข้อสงสัย ติดต่อเราได้ที่อีเมลนี้
      </p>
      <p style="margin-top:24px;color:#1C1C1A;">ขอบคุณที่อุดหนุน Medaryn Book ❤️</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: "Medaryn Book <onboarding@resend.dev>",
    to: order.customerEmail,
    subject: `ยืนยันคำสั่งซื้อ #${order.orderId} — Medaryn Book`,
    html,
  });

  if (error) {
    console.error("ส่งอีเมลยืนยันลูกค้าล้มเหลว:", error);
    throw new Error(JSON.stringify(error));
  }

  return data;
}
