import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { Theme } from "@/src/lib/api/types";
import { createTheme, deleteTheme, updateTheme } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const items = await apiFetch<Theme[]>("/api/themes");
  const { saved } = await searchParams;

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>テーマ管理</h1>
      </div>

      {saved === "1" && (
        <p role="status" className={styles.savedBanner}>
          保存しました
        </p>
      )}

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
        <Link href="/admin/admins">管理者</Link>
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
                      {/* defaultValue(非制御)のため、保存後のrevalidateだけでは
                          画面が追従しない。key を内容依存にしてフォームごと
                          再マウントさせる */}
                      <form
                        id={formId}
                        key={`${theme.id}-${theme.displayOrder}-${theme.name}`}
                        action={updateTheme}
                      >
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
                        key={`${theme.id}-${theme.name}`}
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
