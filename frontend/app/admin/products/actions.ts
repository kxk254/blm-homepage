"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, apiPost, apiPut } from "@/src/lib/api/client";

export async function signOutAdmin() {
  await apiPost("/api/auth/logout");
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
  const themeIdRaw = formData.get("themeId");

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
    typeof stockQuantityRaw !== "string" ||
    typeof themeIdRaw !== "string"
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

  // 空文字は「テーマなし」を意味する
  const themeId = themeIdRaw === "" ? null : Math.trunc(Number(themeIdRaw));
  if (themeId !== null && !Number.isFinite(themeId)) {
    throw new Error("テーマの指定が不正です");
  }

  await apiPut(`/api/admin/products/${productId}`, {
    product_name: productName,
    product_type: productType,
    product_color: productColor,
    product_description: productDescription,
    detail_description: detailDescription,
    product_price: productPrice,
    stock_quantity: stockQuantity,
    theme_id: themeId,
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
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

  await apiPut(`/api/admin/products/${productId}/image`, { image_src: imageSrc });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productId}`);
}

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("ファイルを選択してください");
  }

  const uploadForm = new FormData();
  uploadForm.set("file", file);
  await apiFetch("/api/admin/media/upload", { method: "POST", body: uploadForm });

  revalidatePath("/admin/products");
}
