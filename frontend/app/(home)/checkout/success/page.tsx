import Link from "next/link";
import styles from "../status.module.css";
import { apiFetch } from "@/src/lib/api/client";
import ClearCartOnSuccess from "@/src/components/cart/ClearCartOnSuccess";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let customerEmail: string | null = null;
  if (sessionId) {
    try {
      const session = await apiFetch<{ customerEmail: string | null }>(
        `/api/checkout/session/${encodeURIComponent(sessionId)}`
      );
      customerEmail = session.customerEmail;
    } catch {
      customerEmail = null;
    }
  }

  return (
    <div className={styles.content}>
      <ClearCartOnSuccess />
      <span className={styles.eyebrow}>Thank You</span>
      <p className={styles.message}>ご注文ありがとうございます。</p>
      <p className={styles.subMessage}>
        {customerEmail
          ? `${customerEmail} 宛に確認メールをお送りしました。`
          : "ご登録いただいたメールアドレス宛に確認メールをお送りしました。"}
        <br />
        商品は一つひとつ手作業でお仕立てするため、発送まで今しばらくお待ちください。
      </p>
      <Link href="/" className={styles.backLink}>
        商品一覧へ戻る
      </Link>
    </div>
  );
}
