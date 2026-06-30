import { defineField, defineType } from "sanity";

export const slide = defineType({
  name: "slide",
  title: "สไลด์หน้าแรก",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "ภาพ",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
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
      name: "caption",
      title: "คำบรรยาย",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "ลิงก์",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "ลำดับ",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "ลำดับ",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "caption", media: "image" },
  },
});
