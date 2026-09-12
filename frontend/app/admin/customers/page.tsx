import Link from "next/link";
import { desc, isNotNull, sql } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { customers, orders } from "@/src/lib/db/schema";
import { signOutAdmin } from "@/app/admin/products/actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [customerList, orderCounts] = await Promise.all([
    db.select().from(customers).orderBy(desc(customers.createdAt)),
    db
      .select({
        customerId: orders.customerId,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(orders)
      .where(isNotNull(orders.customerId))
      .groupBy(orders.customerId),
  ]);

  const countByCustomer = new Map(
    orderCounts.map((row) => [row.customerId, row.count])
  );

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>顧客管理</h1>
        <form action={signOutAdmin}>
          <button type="submit" className={styles.button}>
            ログアウト
          </button>
        </form>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
      </nav>

      {customerList.length === 0 ? (
        <p className={styles.hint}>まだ会員登録はありません。</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>メールアドレス</th>
              <th>お名前</th>
              <th>電話番号</th>
              <th>ご住所</th>
              <th>登録日</th>
              <th>注文数</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.email}</td>
                <td>{customer.fullName ?? "—"}</td>
                <td>{customer.phone ?? "—"}</td>
                <td>
                  {customer.postalCode ? `〒${customer.postalCode} ` : ""}
                  {customer.address ?? (customer.postalCode ? "" : "—")}
                </td>
                <td>{customer.createdAt.toLocaleDateString("ja-JP")}</td>
                <td>{countByCustomer.get(customer.id) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
