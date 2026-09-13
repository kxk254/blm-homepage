"use server";

import { redirect } from "next/navigation";
import { apiPost } from "@/src/lib/api/client";
import type { Customer } from "@/src/lib/api/types";

export interface AdminAuthState {
  error?: string;
}

export async function signInAdmin(
  _prevState: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  let user: Customer;
  try {
    user = await apiPost<Customer>("/api/auth/login", { email, password });
  } catch {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  if (!user.isAdmin) {
    await apiPost("/api/auth/logout");
    return { error: "管理者権限がありません" };
  }

  redirect("/admin/products");
}
