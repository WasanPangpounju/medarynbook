import { defineField, defineType } from "sanity";

export const book = defineType({
  name: "book",
  title: "หนังสือ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อหนังสือ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "ผู้เขียน",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "ราคาขาย (บาท)",
      type: "number",
    }),
    defineField({
      name: "originalPrice",
      title: "ราคาเต็ม (บาท)",
      type: "number",
    }),
    defineField({
      name: "badge",
      title: "ป้ายกำกับ",
      type: "string",
      options: {
        list: [
          { title: "ใหม่", value: "ใหม่" },
          { title: "ขายดี", value: "ขายดี" },
          { title: "ไม่มี", value: "none" },
        ],
      },
    }),
    defineField({
      name: "coverImage",
      title: "ภาพปก",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "คำอธิบายภาพ (Alt text)",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "url",
      title: "ลิงก์สั่งซื้อ",
      type: "url",
    }),
    defineField({
      name: "bg",
      title: "สีพื้นหลัง (hex)",
      type: "string",
      description: "ใช้เมื่อยังไม่มีภาพปก เช่น #3d5a48",
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่",
      type: "string",
      options: {
        list: [
          { title: "พีเรียด", value: "พีเรียด" },
          { title: "โรแมนติก", value: "โรแมนติก" },
          { title: "สืบสวน", value: "สืบสวน" },
          { title: "แฟนตาซี", value: "แฟนตาซี" },
          { title: "เยาวชน", value: "เยาวชน" },
        ],
      },
    }),
    defineField({
      name: "isPromotion",
      title: "อยู่ในโปรโมชัน",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "แนะนำ",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "inStock",
      title: "มีสินค้า",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "stockQuantity",
      title: "จำนวนคงเหลือ (เล่ม)",
      type: "number",
      initialValue: 0,
      validation: (r) => r.min(0).integer(),
    }),
    defineField({ name: "synopsis", title: "เรื่องย่อ", type: "text" }),
    defineField({ name: "publishYear", title: "ปีที่พิมพ์", type: "string" }),
    defineField({
      name: "adaptationStatus",
      title: "สถานะลิขสิทธิ์",
      type: "string",
      options: {
        list: [
          { title: "ไม่ระบุ", value: "none" },
          { title: "พร้อมดัดแปลง", value: "available" },
          { title: "พร้อมแปลภาษา", value: "translation" },
          { title: "ดัดแปลงแล้ว", value: "sold" },
        ],
      },
    }),
    defineField({
      name: "adaptationType",
      title: "ประเภทที่ดัดแปลง เช่น ซีรีส์, ภาพยนตร์",
      type: "string",
    }),
    defineField({
      name: "logline",
      title: "Logline (1-2 ประโยค)",
      type: "text",
    }),
    defineField({
      name: "availableLanguages",
      title: "ภาษาที่พร้อมแปล เช่น EN, JP, KR",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "publisher",
      title: "สำนักพิมพ์",
      type: "string",
      initialValue: "Medaryn Book",
    }),
    defineField({ name: "shopeeUrl", title: "ลิงก์ Shopee", type: "url" }),
    defineField({ name: "mebUrl", title: "ลิงก์ Meb", type: "url" }),
    defineField({ name: "naiinUrl", title: "ลิงก์ Naiin", type: "url" }),
    defineField({
      name: "authorRef",
      title: "นักเขียน (เชื่อมกับ Author)",
      type: "reference",
      to: [{ type: "author" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "coverImage" },
  },
});
