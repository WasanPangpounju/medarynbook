import { defineField, defineType } from "sanity";

export const socialPost = defineType({
  name: "socialPost",
  title: "Social Post",
  type: "document",
  fields: [
    defineField({ name: "platform", title: "Platform", type: "string",
      options: { list: [
        { title: "Facebook", value: "facebook" },
        { title: "TikTok", value: "tiktok" },
        { title: "Instagram", value: "instagram" },
        { title: "YouTube", value: "youtube" },
      ]}
    }),
    defineField({ name: "caption", title: "คำบรรยาย", type: "text" }),
    defineField({ name: "url", title: "ลิงก์โพสต์", type: "url" }),
    defineField({ name: "thumbnail", title: "รูป thumbnail", type: "image",
      options: { hotspot: true } }),
    defineField({ name: "likes", title: "จำนวน like/view เช่น 1.2k", type: "string" }),
    defineField({ name: "publishedAt", title: "วันที่โพสต์", type: "date" }),
    defineField({ name: "isVideo", title: "เป็นวิดีโอ", type: "boolean",
      initialValue: false }),
    defineField({ name: "order", title: "ลำดับ (น้อย = ก่อน)", type: "number" }),
    defineField({ name: "isActive", title: "แสดงผล", type: "boolean",
      initialValue: true }),
  ],
  preview: { select: { title: "caption", subtitle: "platform" } }
});
