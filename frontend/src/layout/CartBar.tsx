import Link from "next/link";
import styles from "./CartBar.module.css";

// カートに商品が入っている間、常に目立つ帯で知らせて買い忘れ・カゴ落ちを防ぐ。
// topはAdminBarと同時に出るケースがあるため、Header側で積み上げ計算して渡す
export default function CartBar({ itemCount, top }: { itemCount: number; top: number }) {
  return (
    <div className={styles.cartBar} style={{ top }}>
      <span className={styles.label}>カートに{itemCount}点入っています</span>
      <Link href="/cart" className={styles.cartLink}>
        レジに進む
      </Link>
    </div>
  );
}
