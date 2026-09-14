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

async function countDocs() {
  // นับทุกประเภท รวม draft และ published
  const types = await client.fetch(`array::unique(*[]._type)`);

  console.log("\n=== Document counts (published + draft) ===");
  let total = 0;

  for (const type of (types as string[]).sort()) {
    const count = await client.fetch(
      `count(*[_type == $type])`,
      { type }
    );
    const draftCount = await client.fetch(
      `count(*[_type == $type && _id in path("drafts.**")])`,
      { type }
    );
    console.log(`${type.padEnd(45)} published: ${Number(count) - Number(draftCount)}, draft: ${draftCount}, total: ${count}`);
    total += Number(count);
  }

  console.log(`\n=== TOTAL: ${total} documents ===`);
  console.log("Free plan limit: 1,000 documents");
  console.log(`Used: ${total}/1000 (${Math.round(total/10)}%)`);
}

countDocs().catch(console.error);
