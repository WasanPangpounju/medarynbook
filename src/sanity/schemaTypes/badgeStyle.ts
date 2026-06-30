import { defineField, defineType } from "sanity";

export const badgeStyle = defineType({
  name: "badgeStyle",
  title: "รูปแบบ Badge",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "ชื่อ Badge เช่น ใหม่",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bgColor",
      title: "สีพื้นหลัง เช่น #4E7358",
      type: "string",
    }),
    defineField({
      name: "textColor",
      title: "สีตัวหนังสือ เช่น #ffffff",
      type: "string",
    }),
  ],
  preview: { select: { title: "label" } },
});
