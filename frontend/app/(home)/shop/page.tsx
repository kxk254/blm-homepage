import styles from "./page.module.css";
import HomeCard from "@/src/components/card/HomeCard";

// 商品はDB管理のため、1分ごとに再生成して反映する(ISR)
export const revalidate = 60;

export default function ShopPage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Shop</span>
      <HomeCard />
    </div>
  );
}
