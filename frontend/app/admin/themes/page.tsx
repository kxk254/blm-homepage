import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { themes } from "@/src/lib/db/schema";
import { signOutAdmin } from "@/app/admin/products/actions";
import { createTheme, deleteTheme, updateTheme } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminThemesPage() {
  const items = await db
    .select()
    .from(themes)
    .orderBy(asc(themes.displayOrder));

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>テーマ管理</h1>
        <form action={signOutAdmin}>
          <button type="submit" className={styles.button}>
            ログアウト
          </button>
        </form>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
      </nav>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>新しいテーマを追加</h2>
        <form action={createTheme} className={styles.createForm}>
          <label className={styles.field}>
            <span>テーマ名</span>
            <input
              type="text"
              name="name"
              placeholder="例: 秋冬新作2026"
              required
            />
          </label>
          <label className={styles.field}>
            <span>表示順（数字が小さいほどShopの先頭に表示）</span>
            <input
              type="number"
              name="displayOrder"
              defaultValue={100}
              required
            />
          </label>
          <button type="submit" className={styles.button}>
            追加
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>テーマ一覧</h2>
        {items.length === 0 ? (
          <p className={styles.hint}>
            まだテーマがありません。上のフォームから追加してください。
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>表示順</th>
                <th>テーマ名</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((theme) => {
                const formId = `theme-form-${theme.id}`;
                return (
                  <tr key={theme.id}>
                    <td>
                      <form id={formId} action={updateTheme}>
                        <input type="hidden" name="id" value={theme.id} />
                        <input
                          type="number"
                          name="displayOrder"
                          defaultValue={theme.displayOrder}
                          className={styles.orderInput}
                        />
                      </form>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        defaultValue={theme.name}
                        form={formId}
                        className={styles.nameInput}
                      />
                    </td>
                    <td className={styles.actions}>
                      <button
                        type="submit"
                        form={formId}
                        className={styles.button}
                      >
                        保存
                      </button>
                      <form action={deleteTheme}>
                        <input type="hidden" name="id" value={theme.id} />
                        <button type="submit" className={styles.button}>
                          削除
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
