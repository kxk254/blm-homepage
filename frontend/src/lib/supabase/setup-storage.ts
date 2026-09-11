import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { PRODUCT_IMAGES_BUCKET } from "./storage";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is not set. Add them to .env.local."
    );
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((bucket) => bucket.name === PRODUCT_IMAGES_BUCKET)) {
    console.log(`バケット "${PRODUCT_IMAGES_BUCKET}" は既に存在します`);
    return;
  }

  const { error } = await admin.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
    public: true,
  });
  if (error) throw error;
  console.log(`バケット "${PRODUCT_IMAGES_BUCKET}" を作成しました`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
