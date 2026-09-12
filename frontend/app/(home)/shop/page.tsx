import type { Metadata } from "next";
import styles from "./page.module.css";
import ThemedShopGrid from "@/src/components/card/ThemedShopGrid";

// 商品在庫はDB管理のため常に最新を出す(ISRだとクライアント側ルーターキャッシュが
// 数分効いてしまい、在庫・商品説明の編集がすぐ反映されない)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | Blue Millefeuille",
  description:
    "Blue Millefeuilleのハンドメイドアクセサリー一覧。ストーンフラワーシリーズのイヤリングなど、一点一点手作業で仕立てたアクセサリーをご覧いただけます。",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.eyebrow}>Shop</h1>
      <ThemedShopGrid />
    </div>
  );
}
