import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-05-15",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function deletePageViews() {
  console.log("นับ pageView documents...");
  const count = await client.fetch(`count(*[_type == "pageView"])`);
  console.log(`พบ ${count} documents`);

  let deleted = 0;
  while (true) {
    const docs = await client.fetch(
      `*[_type == "pageView"][0...100]{ _id }`
    );
    if (docs.length === 0) break;

    const transaction = client.transaction();
    for (const doc of docs) {
      transaction.delete(doc._id);
    }
    await transaction.commit();
    deleted += docs.length;
    console.log(`ลบแล้ว ${deleted}/${count}`);
  }
  console.log("เสร็จสิ้น ลบ pageView ทั้งหมดแล้ว");
}

deletePageViews().catch(console.error);
