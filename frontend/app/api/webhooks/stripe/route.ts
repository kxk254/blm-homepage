import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from "@/src/lib/stripe/server";
import { db } from "@/src/lib/db/client";
import { orders, orderItems, products } from "@/src/lib/db/schema";

// /api/checkout がセッション作成時にmetadata.itemsへ埋め込んだ購入内容のスナップショット
interface PurchasedItemSnapshot {
  id: string;
  n: string;
  p: number;
  q: number;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 500 }
    );
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // 署名検証には生のリクエストボディが必須（JSON.parse済みのものは使えない）
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // 冪等性の担保: Stripeはwebhookを再送することがあるため、
  // 同じセッションを二重に処理して在庫を余分に減らさないようにする
  const [existingOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripeCheckoutSessionId, session.id))
    .limit(1);
  if (existingOrder) {
    return NextResponse.json({ received: true, alreadyProcessed: true });
  }

  let items: PurchasedItemSnapshot[] = [];
  try {
    items = JSON.parse(session.metadata?.items ?? "[]");
  } catch (err) {
    console.error(
      "Failed to parse checkout session items metadata",
      session.id,
      err
    );
  }

  const customerIdRaw = session.metadata?.customerId;
  const customerId =
    customerIdRaw && customerIdRaw !== "" ? customerIdRaw : null;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const [order] = await db
    .insert(orders)
    .values({
      customerId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      customerEmail: session.customer_details?.email ?? null,
      totalAmount: session.amount_total ?? 0,
      status: "paid",
    })
    .returning();

  if (items.length > 0) {
    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        productId: item.id,
        productName: item.n,
        unitPrice: item.p,
        quantity: item.q,
      }))
    );

    // 在庫は0未満にならないようクランプする（決済は既に完了しているため、
    // 万一の競合で不足していても失敗させず、0で止める）
    for (const item of items) {
      await db
        .update(products)
        .set({
          stockQuantity: sql`GREATEST(${products.stockQuantity} - ${item.q}, 0)`,
        })
        .where(eq(products.id, item.id));
    }
  }

  return NextResponse.json({ received: true });
}
