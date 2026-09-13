import Link from "next/link";
import styles from "./AdminBar.module.css";

// 管理者としてログイン中だけHeaderの上に出す専用の帯。
// 通常の顧客向けナビとは分離し、誤操作防止も兼ねて見た目を明確に変える。
// topはCartBarと同時に出るケースがあるため、Header側で積み上げ計算して渡す
export default function AdminBar({ top }: { top: number }) {
  return (
    <div className={styles.adminBar} style={{ top }}>
      <span className={styles.label}>管理者モードでログイン中</span>
      <Link href="/admin/products" className={styles.adminLink}>
        ADMIN管理画面
      </Link>
    </div>
  );
}
