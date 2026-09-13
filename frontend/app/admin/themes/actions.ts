"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiDelete, apiPost, apiPut } from "@/src/lib/api/client";

function revalidateThemeAffectedPaths() {
  revalidatePath("/admin/themes");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function createTheme(formData: FormData) {
  const name = formData.get("name");
  const displayOrderRaw = formData.get("displayOrder");
  if (typeof name !== "string" || !name) {
    throw new Error("テーマ名を入力してください");
  }
  const displayOrder = Math.trunc(Number(displayOrderRaw));
  if (!Number.isFinite(displayOrder)) {
    throw new Error("表示順は数値で入力してください");
  }

  await apiPost("/api/admin/themes", { name, display_order: displayOrder });

  revalidateThemeAffectedPaths();
  redirect("/admin/themes?saved=1");
}

export async function updateTheme(formData: FormData) {
  const idRaw = formData.get("id");
  const name = formData.get("name");
  const displayOrderRaw = formData.get("displayOrder");
  const id = Math.trunc(Number(idRaw));
  if (!Number.isFinite(id) || typeof name !== "string" || !name) {
    throw new Error("入力内容を確認してください");
  }
  const displayOrder = Math.trunc(Number(displayOrderRaw));
  if (!Number.isFinite(displayOrder)) {
    throw new Error("表示順は数値で入力してください");
  }

  await apiPut(`/api/admin/themes/${id}`, { name, display_order: displayOrder });

  revalidateThemeAffectedPaths();
  redirect("/admin/themes?saved=1");
}

export async function deleteTheme(formData: FormData) {
  const idRaw = formData.get("id");
  const id = Math.trunc(Number(idRaw));
  if (!Number.isFinite(id)) {
    throw new Error("不正なリクエストです");
  }

  // 紐づく商品はテーマ削除時にtheme_idがnullになる(ProductモデルのondeleteSET NULL)
  await apiDelete(`/api/admin/themes/${id}`);

  revalidateThemeAffectedPaths();
}
