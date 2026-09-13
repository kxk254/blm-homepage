"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiDelete, apiPost } from "@/src/lib/api/client";

export interface CreateAdminState {
  error?: string;
  message?: string;
}

export async function createAdminAccount(
  _prevState: CreateAdminState,
  formData: FormData
): Promise<CreateAdminState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    !email ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return { error: "メールアドレスと8文字以上のパスワードを入力してください" };
  }

  try {
    await apiPost("/api/admin/admins", { email, password });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "管理者アカウントの作成に失敗しました" };
  }

  revalidatePath("/admin/admins");
  return { message: `管理者アカウントを作成しました: ${email}` };
}

export async function deleteAdminAccount(formData: FormData) {
  const adminId = formData.get("adminId");
  if (typeof adminId !== "string" || !adminId) {
    throw new Error("不正なリクエストです");
  }

  try {
    await apiDelete(`/api/admin/admins/${adminId}`);
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.message);
    }
    throw new Error("管理者アカウントの削除に失敗しました");
  }

  revalidatePath("/admin/admins");
}
