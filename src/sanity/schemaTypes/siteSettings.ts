import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "ตั้งค่าเว็บไซต์",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "ส่วน Hero",
      type: "object",
      fields: [
        defineField({ name: "brand", title: "ชื่อแบรนด์", type: "string" }),
        defineField({ name: "tagline", title: "แท็กไลน์", type: "string" }),
        defineField({ name: "title", title: "หัวข้อหลัก", type: "string" }),
        defineField({
          name: "titleEmphasis",
          title: "คำเน้น",
          type: "string",
        }),
        defineField({ name: "titleSuffix", title: "ข้อความต่อท้าย", type: "string" }),
        defineField({ name: "description", title: "คำอธิบาย", type: "text" }),
        defineField({ name: "ctaPrimary", title: "ปุ่มหลัก", type: "string" }),
        defineField({ name: "ctaSecondary", title: "ปุ่มรอง", type: "string" }),
      ],
    }),
    defineField({
      name: "promoBar",
      title: "แถบโปรโมชั่น (PromoBar)",
      type: "object",
      fields: [
        defineField({
          name: "isActive",
          title: "เปิดใช้งาน",
          type: "boolean",
          initialValue: false,
        }),
        defineField({ name: "badge", title: "ป้ายกำกับ", type: "string" }),
        defineField({
          name: "text",
          title: "ข้อความ",
          type: "string",
          description:
            "เช่น ฉลองเปิดร้านมีของที่ระลึกทุกออเดอร์ — โค้ด NEWMEDA | ซื้อครบ 399 ส่งฟรี",
        }),
        defineField({ name: "code", title: "โค้ดส่วนลด", type: "string" }),
        defineField({ name: "shipping", title: "เงื่อนไขจัดส่ง", type: "string" }),
        defineField({
          name: "bgColor",
          title: "สีพื้นหลัง",
          type: "string",
          initialValue: "#4E7358",
        }),
        defineField({
          name: "textColor",
          title: "สีตัวอักษร",
          type: "string",
          initialValue: "#ffffff",
        }),
        defineField({ name: "url", title: "ลิงก์ (ถ้ามี)", type: "url" }),
      ],
    }),
    defineField({
      name: "shopping",
      title: "ช่องทางการสั่งซื้อ",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "ชื่อร้าน", type: "string" }),
          defineField({ name: "desc", title: "คำอธิบาย", type: "string" }),
          defineField({ name: "tag", title: "Tag เช่น E-Book", type: "string" }),
          defineField({ name: "url", title: "URL", type: "url" }),
          defineField({ name: "icon", title: "Icon key เช่น shoppingCart", type: "string" }),
        ]
      }]
    }),
    defineField({
      name: "rights",
      title: "ส่วนลิขสิทธิ์",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label บน", type: "string" }),
        defineField({ name: "title", title: "หัวข้อ", type: "string" }),
        defineField({ name: "desc", title: "คำอธิบาย", type: "text" }),
        defineField({ name: "genres", title: "แนวเรื่อง", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "ctaText", title: "ข้อความปุ่ม", type: "string" }),
        defineField({ name: "ctaUrl", title: "URL ปุ่ม", type: "url" }),
      ]
    }),
    defineField({
      name: "contact",
      title: "ช่องทางติดต่อ",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon key เช่น mail", type: "string" }),
          defineField({ name: "label", title: "หัวข้อ", type: "string" }),
          defineField({ name: "value", title: "ข้อมูล", type: "array", of: [{ type: "string" }] }),
        ]
      }]
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "social",
          title: "Social Links",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "label", title: "ชื่อ", type: "string" }),
              defineField({ name: "icon", title: "Icon key เช่น facebook", type: "string" }),
              defineField({ name: "href", title: "URL", type: "url" }),
            ]
          }]
        }),
        defineField({ name: "copyright", title: "ข้อความ Copyright", type: "string" }),
      ]
    }),
  ],
  preview: {
    prepare() {
      return { title: "ตั้งค่าเว็บไซต์" };
    },
  },
});
