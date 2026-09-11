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
    detailDescription:
      "（仮テキスト）三日月のフォルムに、ひとつぶひとつぶ丁寧に選んだビーズを配した一点物のイヤリングです。光の角度によって表情を変える煌めきが、日常の装いにさりげない特別感を添えます。金属アレルギーに配慮したパーツを使用しておりますが、素材の特性上、まれに肌に合わない場合がございます。お手入れは柔らかい布で優しく拭き取り、直射日光や湿気を避けて保管してください。ひとつひとつ手作業で仕上げているため、写真と質感が若干異なる場合がございます。",
    productPrice: 4400,
    imageSrc: "/asset/0921-2.PNG",
    stockQuantity: 5,
  },
  {
    id: "002",
    productType: "イヤリング",
    productColor: "トパーズ",
    productName: "ストーンシリーズ",
    productDescription:
      "バロックストーンを使用したストーンフラワーシリーズのイヤリング。透明感のあるキラキラが華やかなイヤリングです。",
    detailDescription:
      "（仮テキスト）透明感のあるバロックストーンを一粒ずつ手作業で組み上げた、フラワーシリーズのイヤリングです。揺れるたびに柔らかな光を放ち、シンプルなお洋服にも華やぎをプラスします。天然素材を使用しているため、色味や形状に個体差がございますが、それも一点物ならではの表情としてお楽しみください。ご使用後は付属の巾着袋などに入れて保管いただくと、長く美しい状態を保てます。",
    productPrice: 3300,
    imageSrc: "/asset/0921-5.png",
    stockQuantity: 5,
  },
  {
    id: "003",
    productType: "イヤリング",
    productColor: "グレー",
    productName: "フラワーシリーズ",
    productDescription:
      "モザイクパールを使用したストーンフラワーシリーズのイヤリング。上品でお洋服にも合わせやすいイヤリングです。",
    detailDescription:
      "（仮テキスト）小さなモザイクパールを花びらのように配した、上品な印象のイヤリングです。オフィスシーンから特別な日のお出かけまで、幅広いシーンに寄り添います。パール表面はデリケートなため、香水やヘアスプレーが直接触れないよう、お化粧の後に着用いただくことをおすすめします。金具部分は変色しにくい素材を使用しておりますが、汗や水分が付着した際は乾いた布で拭き取ってください。",
    productPrice: 3300,
    imageSrc: "/asset/0921-14.png",
    stockQuantity: 5,
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
