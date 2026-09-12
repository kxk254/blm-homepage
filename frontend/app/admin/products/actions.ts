"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createClient } from "@/src/lib/supabase/server";
import { PRODUCT_IMAGES_BUCKET } from "@/src/lib/supabase/storage";

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateProductDetails(formData: FormData) {
  const productId = formData.get("productId");
  const productName = formData.get("productName");
  const productType = formData.get("productType");
  const productColor = formData.get("productColor");
  const productDescription = formData.get("productDescription");
  const detailDescription = formData.get("detailDescription");
  const productPriceRaw = formData.get("productPrice");
  const stockQuantityRaw = formData.get("stockQuantity");

  if (
    typeof productId !== "string" ||
    !productId ||
    typeof productName !== "string" ||
    !productName ||
    typeof productType !== "string" ||
    !productType ||
    typeof productColor !== "string" ||
    !productColor ||
    typeof productDescription !== "string" ||
    !productDescription ||
    typeof detailDescription !== "string" ||
    typeof productPriceRaw !== "string" ||
    typeof stockQuantityRaw !== "string"
  ) {
    throw new Error("入力内容を確認してください");
  }

  const productPrice = Math.trunc(Number(productPriceRaw));
  const stockQuantity = Math.trunc(Number(stockQuantityRaw));
  if (
    !Number.isFinite(productPrice) ||
    productPrice < 0 ||
    !Number.isFinite(stockQuantity) ||
    stockQuantity < 0
  ) {
    throw new Error("価格・在庫数は0以上の数値で入力してください");
  }

  await db
    .update(products)
    .set({
      productName,
      productType,
      productColor,
      productDescription,
      detailDescription,
      productPrice,
      stockQuantity,
    })
    .where(eq(products.id, productId));

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productId}`);
}

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

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productId}`);
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

  revalidatePath("/admin/products");
}
