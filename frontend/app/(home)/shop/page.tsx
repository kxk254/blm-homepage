import styles from "./page.module.css";
import HomeCard from "@/src/components/card/HomeCard";

// 商品在庫はDB管理のため常に最新を出す(ISRだとクライアント側ルーターキャッシュが
// 数分効いてしまい、在庫・商品説明の編集がすぐ反映されない)
export const dynamic = "force-dynamic";

export default function ShopPage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Shop</span>
      <HomeCard />
    </div>
  );
}
