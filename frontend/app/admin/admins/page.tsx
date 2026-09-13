import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { AdminAccount, Customer } from "@/src/lib/api/types";
import CreateAdminForm from "./CreateAdminForm";
import { deleteAdminAccount } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const [admins, me] = await Promise.all([
    apiFetch<AdminAccount[]>("/api/admin/admins"),
    apiFetch<Customer>("/api/auth/me"),
  ]);
  const canDelete = admins.length > 1;

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>管理者</h1>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
        <Link href="/admin/admins">管理者</Link>
      </nav>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>管理者アカウントを追加</h2>
        <CreateAdminForm />
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>管理者一覧（{admins.length}件）</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>メールアドレス</th>
              <th>作成日</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const isSelf = admin.id === me.id;
              return (
                <tr key={admin.id}>
                  <td>{admin.email}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString("ja-JP")}</td>
                  <td>
                    {isSelf ? (
                      <span className={styles.hint}>（自分）</span>
                    ) : canDelete ? (
                      <form action={deleteAdminAccount}>
                        <input type="hidden" name="adminId" value={admin.id} />
                        <button type="submit" className={styles.button}>
                          削除
                        </button>
                      </form>
                    ) : (
                      <span className={styles.hint}>管理者は最低1人必要です</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
