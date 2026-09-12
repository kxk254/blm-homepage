import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";

// カートページが表示中に在庫・価格・商品の存在を再確認するための軽量エンドポイント。
// 決済時の在庫チェックは/api/checkout側で別途行うため、ここはあくまでUI表示用
export async function POST(req: NextRequest) {
  let body: { ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string")
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const rows = await db
    .select({
      id: products.id,
      productPrice: products.productPrice,
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .where(inArray(products.id, ids));

  return NextResponse.json({ items: rows });
}
