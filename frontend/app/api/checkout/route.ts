import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/src/lib/stripe/server";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";

interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  let body: { items?: CheckoutRequestItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  const requestedItems = Array.isArray(body.items) ? body.items : [];
  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "カートが空です" }, { status: 400 });
  }

  // 価格は必ずサーバー側のデータから取得する（クライアントから送られた金額は信用しない）
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    new URL(req.url).origin;

  for (const { id, quantity } of requestedItems) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) {
      return NextResponse.json(
        { error: `不明な商品IDです: ${id}` },
        { status: 400 }
      );
    }
    const safeQuantity = Math.min(
      Math.max(Math.trunc(Number(quantity)) || 1, 1),
      10
    );
    lineItems.push({
      quantity: safeQuantity,
      price_data: {
        currency: "jpy",
        unit_amount: product.productPrice,
        product_data: {
          name: product.productName,
          description: `${product.productType}（${product.productColor}）`,
          images: [`${origin}${product.imageSrc}`],
        },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["JP"] },
      phone_number_collection: { enabled: true },
      // TODO: 実際の送料ポリシーに合わせて金額を調整してください（現在は仮で全国一律300円）
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 300, currency: "jpy" },
            display_name: "全国一律送料",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      locale: "ja",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "決済セッションの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
