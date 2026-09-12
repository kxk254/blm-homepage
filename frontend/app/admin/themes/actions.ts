"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { themes } from "@/src/lib/db/schema";

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

  await db.insert(themes).values({ name, displayOrder });

  revalidateThemeAffectedPaths();
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

  await db
    .update(themes)
    .set({ name, displayOrder })
    .where(eq(themes.id, id));

  revalidateThemeAffectedPaths();
}

export async function deleteTheme(formData: FormData) {
  const idRaw = formData.get("id");
  const id = Math.trunc(Number(idRaw));
  if (!Number.isFinite(id)) {
    throw new Error("不正なリクエストです");
  }

  // 紐づく商品はテーマ削除時にthemeIdがnullになる(スキーマのonDelete: set null)
  await db.delete(themes).where(eq(themes.id, id));

  revalidateThemeAffectedPaths();
}
