import Link from "next/link";
import styles from "./page.module.css";
import HeroSection from "@/src/components/hero/Hero";
import HomeCard from "@/src/components/card/HomeCard";
import OtherActivities from "@/src/components/card/OtherActivities";

// 商品はDB管理のため、1分ごとに再生成して反映する(ISR)
export const revalidate = 60;

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
