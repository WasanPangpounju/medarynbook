import { defineField, defineType } from "sanity";

export const mood = defineType({
  name: "mood",
  title: "อารมณ์การอ่าน",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "ชื่ออารมณ์ เช่น คืนฝนตก",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "ลำดับ (น้อย = ก่อน)",
      type: "number",
    }),
    defineField({
      name: "isActive",
      title: "แสดงผล",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: { select: { title: "label" } },
});
