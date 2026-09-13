"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPatch, apiPost } from "@/src/lib/api/client";

const VALID_STATUSES = ["paid", "shipped", "cancelled", "refunded"];

// 注文一覧は検索フィルターがURLクエリに乗っているため、保存後の
// リダイレクト先でも同じフィルターを保ったまま "保存しました" を出す
function buildOrdersRedirectUrl(formData: FormData): string {
  const query = new URLSearchParams();
  for (const key of ["customerName", "productId", "date", "stripeId"]) {
    const value = formData.get(key);
    if (typeof value === "string" && value) {
      query.set(key, value);
    }
  }
  query.set("saved", "1");
  return `/admin/orders?${query.toString()}`;
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (
    typeof orderId !== "string" ||
    !orderId ||
    typeof status !== "string" ||
    !VALID_STATUSES.includes(status)
  ) {
    throw new Error("不正なリクエストです");
  }

  await apiPatch(`/api/admin/orders/${orderId}`, { status });

  revalidatePath("/admin/orders");
  redirect(buildOrdersRedirectUrl(formData));
}

export async function recordRefund(formData: FormData) {
  const orderId = formData.get("orderId");
  const refundAmountRaw = formData.get("refundAmount");
  const refundReason = formData.get("refundReason");

  if (
    typeof orderId !== "string" ||
    !orderId ||
    typeof refundAmountRaw !== "string" ||
    typeof refundReason !== "string" ||
    !refundReason.trim()
  ) {
    throw new Error("返金額と理由を入力してください");
  }

  const refundAmount = Math.trunc(Number(refundAmountRaw));
  if (!Number.isFinite(refundAmount) || refundAmount < 0) {
    throw new Error("返金額は0以上の数値で入力してください");
  }

  await apiPost(`/api/admin/orders/${orderId}/refund`, {
    refund_amount: refundAmount,
    refund_reason: refundReason,
  });

  revalidatePath("/admin/orders");
  redirect(buildOrdersRedirectUrl(formData));
}
