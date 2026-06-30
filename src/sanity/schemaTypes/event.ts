import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "กิจกรรม",
  type: "document",
  fields: [
    defineField({ name: "title", title: "ชื่อกิจกรรม", type: "string",
      validation: (r) => r.required() }),
    defineField({ name: "eventType", title: "ประเภทกิจกรรม", type: "string",
      options: { list: [
        { title: "Meet & Greet", value: "meet" },
        { title: "งานเปิดตัวหนังสือ", value: "launch" },
        { title: "Live / คลิป", value: "live" },
        { title: "สัมภาษณ์", value: "interview" },
        { title: "Book Fair", value: "fair" },
      ]}
    }),
    defineField({ name: "date", title: "วันที่จัดงาน", type: "date" }),
    defineField({ name: "timeStart", title: "เวลาเริ่ม เช่น 13:00", type: "string" }),
    defineField({ name: "timeEnd", title: "เวลาสิ้นสุด เช่น 16:00", type: "string" }),
    defineField({ name: "location", title: "สถานที่", type: "string" }),
    defineField({ name: "description", title: "รายละเอียด", type: "text" }),
    defineField({ name: "registerUrl", title: "ลิงก์ลงทะเบียน", type: "url" }),
    defineField({ name: "image", title: "รูปภาพ", type: "image",
      options: { hotspot: true } }),
    defineField({ name: "isAnnounced", title: "ประกาศแล้ว (ถ้าไม่ติ๊ก = รอประกาศ)", type: "boolean",
      initialValue: true }),
    defineField({ name: "order", title: "ลำดับ", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "date" } }
});
