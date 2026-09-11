"use server";

import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { PRODUCT_IMAGES_BUCKET } from "@/src/lib/supabase/storage";

export async function updateProductImage(formData: FormData) {
  const productId = formData.get("productId");
  const imageSrc = formData.get("imageSrc");
  if (
    typeof productId !== "string" ||
    !productId ||
    typeof imageSrc !== "string" ||
    !imageSrc
  ) {
    throw new Error("不正なリクエストです");
  }

  await db
    .update(products)
    .set({ imageSrc })
    .where(eq(products.id, productId));
}

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("ファイルを選択してください");
  }

  const admin = createAdminClient();
  // 元のファイル名の衝突・パス区切り文字混入を避けるため安全な名前に変換
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { error } = await admin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(safeName, file, { contentType: file.type });

  if (error) {
    throw new Error(`アップロードに失敗しました: ${error.message}`);
  }
}
