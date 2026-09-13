"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, apiPut } from "@/src/lib/api/client";
import type { Product } from "@/src/lib/api/types";

export async function updateProductDetails(formData: FormData) {
  const productId = formData.get("productId");
  const productName = formData.get("productName");
  const productType = formData.get("productType");
  const productColor = formData.get("productColor");
  const productDescription = formData.get("productDescription");
  const detailDescription = formData.get("detailDescription");
  const story = formData.get("story");
  const sizeInfo = formData.get("sizeInfo");
  const materialInfo = formData.get("materialInfo");
  const careInfo = formData.get("careInfo");
  const lostItemNote = formData.get("lostItemNote");
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
    typeof story !== "string" ||
    typeof sizeInfo !== "string" ||
    typeof materialInfo !== "string" ||
    typeof careInfo !== "string" ||
    typeof lostItemNote !== "string" ||
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
    story,
    size_info: sizeInfo,
    material_info: materialInfo,
    care_info: careInfo,
    lost_item_note: lostItemNote,
    product_price: productPrice,
    stock_quantity: stockQuantity,
    theme_id: themeId,
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productId}`);

  // 保存が画面に反映されたことをユーザーが確認できるよう、
  // ?saved=1 付きで編集ページへ戻る(バナー表示用)
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function createProduct(formData: FormData) {
  const categoryCode = formData.get("categoryCode");
  const productName = formData.get("productName");
  const productType = formData.get("productType");
  const productColor = formData.get("productColor");
  const productDescription = formData.get("productDescription");
  const detailDescription = formData.get("detailDescription");
  const productPriceRaw = formData.get("productPrice");
  const stockQuantityRaw = formData.get("stockQuantity");
  const themeIdRaw = formData.get("themeId");
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (
    typeof categoryCode !== "string" ||
    !categoryCode ||
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
  if (files.length === 0) {
    throw new Error("画像を1枚以上選択してください");
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

  const uploadForm = new FormData();
  uploadForm.set("category_code", categoryCode);
  uploadForm.set("product_name", productName);
  uploadForm.set("product_type", productType);
  uploadForm.set("product_color", productColor);
  uploadForm.set("product_description", productDescription);
  uploadForm.set("detail_description", detailDescription);
  uploadForm.set("story", String(formData.get("story") ?? ""));
  uploadForm.set("size_info", String(formData.get("sizeInfo") ?? ""));
  uploadForm.set("material_info", String(formData.get("materialInfo") ?? ""));
  uploadForm.set("care_info", String(formData.get("careInfo") ?? ""));
  uploadForm.set("lost_item_note", String(formData.get("lostItemNote") ?? ""));
  uploadForm.set("product_price", String(productPrice));
  uploadForm.set("stock_quantity", String(stockQuantity));
  if (themeId !== null) {
    uploadForm.set("theme_id", String(themeId));
  }
  for (const file of files) {
    uploadForm.append("files", file);
  }

  const product = await apiFetch<Product>("/api/admin/products", {
    method: "POST",
    body: uploadForm,
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");

  redirect(`/admin/products/${product.id}`);
}

export async function updateProductImages(productId: string, imageSrcs: string[]) {
  if (!productId || imageSrcs.length === 0 || imageSrcs.length > 8) {
    throw new Error("画像は1〜8枚の範囲で選択してください");
  }

  await apiPut(`/api/admin/products/${productId}/image`, { image_srcs: imageSrcs });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productId}`);
}
