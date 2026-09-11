import Link from "next/link";
import styles from "./page.module.css";
import HeroSection from "@/src/components/hero/Hero";
import HomeCard from "@/src/components/card/HomeCard";
import OtherActivities from "@/src/components/card/OtherActivities";

// 商品在庫はDB管理のため常に最新を出す(ISRだとクライアント側ルーターキャッシュが
// 数分効いてしまい、在庫・商品説明の編集がすぐ反映されない)
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="shop" className={styles.items}>
        <span className={styles.shopEyebrow}>Shop</span>
        <HomeCard />
        <Link href="/shop" className={styles.shopMoreLink}>
          すべての商品を見る
        </Link>
      </div>
      <OtherActivities />
    </>
  );
}
