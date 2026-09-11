import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, type NewProduct } from "./schema";

const seedProducts: NewProduct[] = [
  {
    id: "001",
    productType: "イヤリング",
    productColor: "シルバー",
    productName: "ムーンシリーズイヤリング",
    productDescription:
      "クレッセント型のスタイリッシュなイヤリング。スワロスキーやバールのキラキラ感が華やかなデザインです。",
    productPrice: 4400,
    imageSrc: "/asset/0921-2.PNG",
  },
  {
    id: "002",
    productType: "イヤリング",
    productColor: "トパーズ",
    productName: "ストーンシリーズ",
    productDescription:
      "バロックストーンを使用したストーンフラワーシリーズのイヤリング。透明感のあるキラキラが華やかなイヤリングです。",
    productPrice: 3300,
    imageSrc: "/asset/0921-5.png",
  },
  {
    id: "003",
    productType: "イヤリング",
    productColor: "グレー",
    productName: "フラワーシリーズ",
    productDescription:
      "モザイクパールを使用したストーンフラワーシリーズのイヤリング。上品でお洋服にも合わせやすいイヤリングです。",
    productPrice: 3300,
    imageSrc: "/asset/0921-14.png",
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  for (const product of seedProducts) {
    await db
      .insert(products)
      .values(product)
      .onConflictDoUpdate({ target: products.id, set: product });
  }

  await client.end();
  console.log(`${seedProducts.length}件の商品をシードしました`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
