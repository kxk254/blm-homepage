"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { createClient } from "@/src/lib/supabase/server";
import { db } from "@/src/lib/db/client";
import { customers } from "@/src/lib/db/schema";

export interface AuthActionState {
  error?: string;
  message?: string;
}

async function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
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

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return { error: "メールアドレスを入力してください" };
  }

  const origin = await getSiteOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/account/reset-password`,
  });
  if (error) {
    // 登録済みメールかどうかを外部に推測されないよう、失敗してもログにのみ残し
    // 同じ成功メッセージを返す
    console.error("Failed to send password reset email", error);
  }

  return {
    message:
      "パスワード再設定用のメールを送信しました。メール内のリンクからお進みください。",
  };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "セッションの有効期限が切れています。再設定メールのリンクをもう一度開いてください。",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: `パスワードの更新に失敗しました: ${error.message}` };
  }

  redirect("/account");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/account/login");
  }

  const fullName = formData.get("fullName");
  const phone = formData.get("phone");
  const postalCode = formData.get("postalCode");
  const address = formData.get("address");

  await db
    .update(customers)
    .set({
      fullName: typeof fullName === "string" && fullName ? fullName : null,
      phone: typeof phone === "string" && phone ? phone : null,
      postalCode:
        typeof postalCode === "string" && postalCode ? postalCode : null,
      address: typeof address === "string" && address ? address : null,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, user.id));

  revalidatePath("/account");
}
