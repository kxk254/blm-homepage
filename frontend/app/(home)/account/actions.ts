"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export interface AuthActionState {
  error?: string;
  message?: string;
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
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
  if (password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: `登録に失敗しました: ${error.message}` };
  }

  // メール確認が必須の設定だとsignUp直後にはセッションが発行されない。
  // そのままredirectすると/accountで未ログイン扱いになりログイン画面に
  // 戻されて意味不明になるため、その場合は案内を表示して留まる。
  if (!data.session) {
    return {
      message:
        "確認メールを送信しました。メール内のリンクから登録を完了してください。",
    };
  }

  redirect("/account");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
