import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "นักเขียน",
  type: "document",
  fields: [
    defineField({ name: "nameTh", title: "ชื่อ (ภาษาไทย)", type: "string",
      validation: (r) => r.required() }),
    defineField({ name: "nameEn", title: "Name (English)", type: "string" }),
    defineField({ name: "penName", title: "นามปากกา / Pen Name", type: "string" }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug",
      options: { source: "nameTh" }, validation: (r) => r.required() }),
    defineField({
      name: "photo", title: "รูปภาพนักเขียน", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })]
    }),
    defineField({ name: "biographyTh", title: "ประวัติ (ภาษาไทย)", type: "text" }),
    defineField({ name: "biographyEn", title: "Biography (English)", type: "text" }),
    defineField({ name: "genres", title: "แนวเรื่อง เช่น พีเรียด, โรแมนติก",
      type: "array", of: [{ type: "string" }] }),
    defineField({ name: "languages", title: "ภาษาที่รองรับ เช่น ไทย, EN, JP",
      type: "array", of: [{ type: "string" }] }),
    defineField({ name: "worksCount", title: "จำนวนผลงาน", type: "number" }),
    defineField({ name: "adaptationsCount", title: "จำนวนที่ดัดแปลง", type: "number" }),
    defineField({ name: "totalSales", title: "ยอดขายรวม เช่น 50k+", type: "string" }),
    defineField({
      name: "awards", title: "รางวัลและการยอมรับ",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "ชื่อรางวัล", type: "string" }),
          defineField({ name: "year", title: "ปี (พ.ศ.)", type: "string" }),
          defineField({ name: "icon", title: "Icon เช่น trophy, star, globe, movie", type: "string" }),
        ]
      }]
    }),
    defineField({
      name: "social", title: "Social Media", type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
      ]
    }),
    defineField({
      name: "featuredWorks",
      title: "ผลงานเด่น (เลือกจากหนังสือ)",
      type: "array",
      of: [{
        type: "reference",
        to: [{ type: "book" }],
      }],
      description: "เลือกหนังสือที่ต้องการแสดงในโปรไฟล์นักเขียน"
    }),
    defineField({ name: "order", title: "ลำดับ (น้อย = ก่อน)", type: "number" }),
    defineField({ name: "isActive", title: "แสดงผล", type: "boolean",
      initialValue: true }),
  ],
  preview: { select: { title: "nameTh", subtitle: "penName", media: "photo" } }
});
