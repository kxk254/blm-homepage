"use server";

import { revalidatePath } from "next/cache";
import { apiPatch } from "@/src/lib/api/client";

const VALID_STATUSES = ["paid", "shipped", "cancelled", "refunded"];

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
}
