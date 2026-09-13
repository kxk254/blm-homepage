import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { AdminCustomer } from "@/src/lib/api/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customerList = await apiFetch<AdminCustomer[]>("/api/admin/customers");

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>顧客管理</h1>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
        <Link href="/admin/admins">管理者</Link>
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
              <th></th>
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
                <td>{new Date(customer.createdAt).toLocaleDateString("ja-JP")}</td>
                <td>{customer.orderCount}</td>
                <td>
                  <Link
                    href={`/admin/customers/${customer.id}/history`}
                    className={styles.button}
                  >
                    変更履歴
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
