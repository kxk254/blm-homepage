"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "管理者権限がありません" };
  }

  redirect("/admin/products");
}
