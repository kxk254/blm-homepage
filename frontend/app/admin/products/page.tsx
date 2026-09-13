import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { AdminProductListItem } from "@/src/lib/api/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const items = await apiFetch<AdminProductListItem[]>("/api/admin/products");

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>商品管理</h1>
      </div>

      <nav className={styles.adminNav}>
        <Link href="/admin/products">商品一覧</Link>
        <Link href="/admin/themes">テーマ管理</Link>
        <Link href="/admin/orders">注文管理</Link>
        <Link href="/admin/customers">顧客一覧</Link>
        <Link href="/admin/admins">管理者</Link>
      </nav>

      <section className={styles.section}>
        <div className={styles.headerRow}>
          <h2 className={styles.subHeading}>商品一覧（{items.length}件）</h2>
          <Link href="/admin/products/new" className={styles.button}>
            ＋ 新しい商品を追加
          </Link>
        </div>
        <p className={styles.hint}>
          画像のアップロード・選択は各商品の「編集」ページで行います（商品ごとにフォルダを分けて管理します）。
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>No.</th>
              <th>商品名</th>
              <th>テーマ</th>
              <th>価格</th>
              <th>在庫</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.thumbWrap}>
                    <Image
                      src={product.imageSrc}
                      alt={product.productName}
                      fill
                      sizes="48px"
                      className={styles.thumb}
                    />
                  </div>
                </td>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>{product.themeName ?? "—"}</td>
                <td>¥{product.productPrice.toLocaleString()}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className={styles.button}
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
