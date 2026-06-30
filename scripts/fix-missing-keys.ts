import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixMissingKeys() {
  const orders = await sanityClient.fetch<{ _id: string; items?: { _key?: string }[] }[]>(
    `*[_type == "order"]{_id, items}`
  );

  let fixed = 0;
  for (const order of orders) {
    if (!order.items) continue;
    const hasUnkeyed = order.items.some((item) => !item._key);
    if (!hasUnkeyed) continue;

    const fixedItems = order.items.map((item) => ({
      ...item,
      _key: item._key ?? randomUUID(),
    }));

    await sanityClient.patch(order._id).set({ items: fixedItems }).commit();
    console.log(`แก้ไข order ${order._id} แล้ว`);
    fixed++;
  }

  console.log(`เสร็จสิ้น — แก้ไข ${fixed} จาก ${orders.length} รายการ`);
}

fixMissingKeys().catch(console.error);
