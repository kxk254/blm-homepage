"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { orders } from "@/src/lib/db/schema";

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

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
}
