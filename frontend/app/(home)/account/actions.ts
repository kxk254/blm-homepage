"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, apiPatch, apiPost } from "@/src/lib/api/client";

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

  try {
    await apiPost("/api/auth/signup", { email, password });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: `登録に失敗しました: ${err.message}` };
    }
    return { error: "登録に失敗しました" };
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

  try {
    await apiPost("/api/auth/login", { email, password });
  } catch {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  redirect("/account");
}

export async function signOut() {
  await apiPost("/api/auth/logout");
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

  // 登録済みメールかどうかを外部に推測されないよう、失敗してもログにのみ残し
  // 同じ成功メッセージを返す（バックエンド側でも同様の配慮をしている）
  try {
    await apiPost("/api/auth/request-password-reset", { email });
  } catch (err) {
    console.error("Failed to request password reset", err);
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

  try {
    await apiPost("/api/auth/update-password", { password });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "パスワードの更新に失敗しました" };
  }

  redirect("/account");
}

export async function updateProfile(formData: FormData) {
  const fullName = formData.get("fullName");
  const phone = formData.get("phone");
  const postalCode = formData.get("postalCode");
  const address = formData.get("address");

  try {
    await apiPatch("/api/auth/profile", {
      full_name: typeof fullName === "string" && fullName ? fullName : null,
      phone: typeof phone === "string" && phone ? phone : null,
      postal_code:
        typeof postalCode === "string" && postalCode ? postalCode : null,
      address: typeof address === "string" && address ? address : null,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/account/login");
    }
    throw err;
  }

  revalidatePath("/account");
}
