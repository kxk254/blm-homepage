import Link from "next/link";
import styles from "../status.module.css";

export default function CheckoutCancelPage() {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Checkout</span>
      <p className={styles.message}>お手続きがキャンセルされました。</p>
      <p className={styles.subMessage}>
        カートの内容はそのまま保存されています。
        <br />
        よろしければ、もう一度お手続きをお願いいたします。
      </p>
      <Link href="/cart" className={styles.backLink}>
        カートに戻る
      </Link>
    </div>
  );
}
