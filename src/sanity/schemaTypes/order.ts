import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "คำสั่งซื้อ",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "เลขที่คำสั่งซื้อ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "ชื่อผู้รับ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "อีเมล",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerPhone",
      title: "เบอร์โทร",
      type: "string",
    }),
    defineField({
      name: "shippingAddress",
      title: "ที่อยู่จัดส่ง",
      type: "object",
      fields: [
        defineField({ name: "address", title: "ที่อยู่", type: "string" }),
        defineField({ name: "subdistrict", title: "ตำบล/แขวง", type: "string" }),
        defineField({ name: "district", title: "อำเภอ/เขต", type: "string" }),
        defineField({ name: "province", title: "จังหวัด", type: "string" }),
        defineField({ name: "zipcode", title: "รหัสไปรษณีย์", type: "string" }),
      ],
    }),
    defineField({
      name: "deliveryMethod",
      title: "รูปแบบการจัดส่ง",
      type: "string",
      options: {
        list: [
          { title: "ไปรษณีย์ลงทะเบียน", value: "registered" },
          { title: "EMS", value: "ems" },
        ],
      },
    }),
    defineField({
      name: "paymentMethod",
      title: "ช่องทางชำระเงิน",
      type: "string",
      options: {
        list: [
          { title: "พร้อมเพย์", value: "promptpay" },
          { title: "โอนเงิน", value: "transfer" },
        ],
      },
    }),
    defineField({
      name: "items",
      title: "รายการหนังสือ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "bookTitle", title: "ชื่อหนังสือ", type: "string" }),
            defineField({ name: "price", title: "ราคา", type: "number" }),
            defineField({ name: "quantity", title: "จำนวน", type: "number" }),
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "ยอดรวมสินค้า",
      type: "number",
    }),
    defineField({
      name: "shippingFee",
      title: "ค่าจัดส่ง",
      type: "number",
    }),
    defineField({
      name: "discount",
      title: "ส่วนลด",
      type: "number",
    }),
    defineField({
      name: "total",
      title: "ยอดรวมสุทธิ",
      type: "number",
    }),
    defineField({
      name: "promoCode",
      title: "โค้ดส่วนลด",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "สถานะ",
      type: "string",
      options: {
        list: [
          { title: "รอชำระเงิน", value: "pending_payment" },
          { title: "ส่งหลักฐานแล้ว", value: "payment_submitted" },
          { title: "ยืนยันแล้ว", value: "confirmed" },
          { title: "จัดส่งแล้ว", value: "shipped" },
          { title: "จัดส่งสำเร็จ", value: "delivered" },
        ],
      },
      initialValue: "pending_payment",
    }),
    defineField({
      name: "slipImageUrl",
      title: "URL สลิป",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "หมายเหตุ",
      type: "string",
    }),
    defineField({
      name: "createdAt",
      title: "วันที่สั่งซื้อ",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "orderId", subtitle: "customerName" },
  },
});
