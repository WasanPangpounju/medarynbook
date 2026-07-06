import { defineField, defineType } from "sanity";

export const promoCode = defineType({
  name: "promoCode",
  title: "โค้ดส่วนลด",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "โค้ด (ตัวพิมพ์ใหญ่) เช่น PAIR15",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "คำอธิบาย เช่น ส่วนลด 15% สำหรับคู่รัก",
      type: "string",
    }),
    defineField({
      name: "discountType",
      title: "ประเภทส่วนลด",
      type: "string",
      options: {
        list: [
          { title: "ลด % จากยอดรวม", value: "percent" },
          { title: "ลดจำนวนเงิน (บาท)", value: "fixed" },
          { title: "ของแถม (แจ้งเตือนลูกค้า)", value: "gift" },
          { title: "ส่งฟรี", value: "freeshipping" },
        ],
        layout: "radio",
      },
      initialValue: "percent",
    }),
    defineField({
      name: "discountValue",
      title: "มูลค่าส่วนลด (% หรือ บาท — ถ้าเป็นของแถมหรือส่งฟรีใส่ 0)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "giftDescription",
      title: "คำอธิบายของแถม เช่น ที่คั่นหนังสือ Medaryn Book 1 ชิ้น",
      type: "string",
      description: "ใช้เฉพาะเมื่อ discountType = gift",
    }),
    defineField({
      name: "conditions",
      title: "เงื่อนไข (ต้องตรงทุกข้อ)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "conditionType",
              title: "ประเภทเงื่อนไข",
              type: "string",
              options: {
                list: [
                  { title: "ยอดซื้อขั้นต่ำ (บาท)", value: "minAmount" },
                  { title: "จำนวนหนังสือขั้นต่ำ (เล่ม)", value: "minQuantity" },
                  { title: "ไม่มีเงื่อนไข (ใช้ได้ทุกออเดอร์)", value: "none" },
                ],
                layout: "radio",
              },
              initialValue: "none",
            }),
            defineField({
              name: "value",
              title: "ค่าขั้นต่ำ (เช่น 1000 หรือ 3)",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "errorMessage",
              title: "ข้อความแจ้งเมื่อไม่ผ่านเงื่อนไข เช่น ต้องซื้อครบ ฿1,000 ก่อนใช้โค้ดนี้",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "conditionType", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "isActive",
      title: "เปิดใช้งาน",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "maxUses",
      title: "จำกัดจำนวนครั้ง (0 = ไม่จำกัด)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "usedCount",
      title: "ใช้แล้วกี่ครั้ง (อัปเดตอัตโนมัติ)",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "expiresAt",
      title: "วันหมดอายุ (ถ้าไม่กรอก = ไม่มีวันหมดอายุ)",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "code", subtitle: "description" },
  },
});
