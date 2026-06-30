import { defineField, defineType } from "sanity";

export const promo = defineType({
  name: "promo",
  title: "โปรโมชั่น",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "หัวข้อ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "รายละเอียด",
      type: "text",
    }),
    defineField({
      name: "cta",
      title: "ข้อความปุ่ม",
      type: "string",
    }),
    defineField({
      name: "bgColor",
      title: "สีพื้นหลัง (hex)",
      type: "string",
    }),
    defineField({
      name: "btnColor",
      title: "สีปุ่ม (hex)",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "ลิงก์",
      type: "url",
    }),
  ],
});
