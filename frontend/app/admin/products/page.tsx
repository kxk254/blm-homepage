import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { products, themes } from "@/src/lib/db/schema";
import { listBucketImages } from "@/src/lib/supabase/productImages";
import { signOutAdmin, uploadProductImage } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [items, images] = await Promise.all([
    db
      .select({
        id: products.id,
        productName: products.productName,
        productPrice: products.productPrice,
        stockQuantity: products.stockQuantity,
        imageSrc: products.imageSrc,
        themeName: themes.name,
      })
      .from(products)
      .leftJoin(themes, eq(products.themeId, themes.id))
      .orderBy(products.id),
    listBucketImages(),
  ]);

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>商品管理</h1>
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

      <section className={styles.section}>
        <h2 className={styles.subHeading}>新しい画像をアップロード</h2>
        <form action={uploadProductImage} className={styles.uploadForm}>
          <input type="file" name="file" accept="image/*" required />
          <button type="submit" className={styles.button}>
            アップロード
          </button>
        </form>
        {images.length === 0 && (
          <p className={styles.hint}>
            まだアップロード済みの画像がありません。上のフォームから画像を追加すると、各商品の編集ページで選べるようになります。
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>商品一覧（{items.length}件）</h2>
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
