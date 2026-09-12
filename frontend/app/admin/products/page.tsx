import Image from "next/image";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { PRODUCT_IMAGES_BUCKET } from "@/src/lib/supabase/storage";
import {
  signOutAdmin,
  updateProductDetails,
  updateProductImage,
  uploadProductImage,
} from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface BucketImage {
  name: string;
  url: string;
}

async function listBucketImages(): Promise<BucketImage[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error || !data) return [];

  return data
    .filter((file) => file.id !== null) // フォルダのプレースホルダー行を除外
    .map((file) => {
      const { data: publicUrlData } = admin.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(file.name);
      return { name: file.name, url: publicUrlData.publicUrl };
    });
}

export default async function AdminProductsPage() {
  const [items, images] = await Promise.all([
    db.select().from(products).orderBy(products.id),
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
            まだアップロード済みの画像がありません。上のフォームから画像を追加すると、下の各商品の画像選択欄で選べるようになります。
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>商品ごとの編集</h2>
        <ul className={styles.productList}>
          {items.map((product) => (
            <li key={product.id} className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.thumbWrap}>
                  <Image
                    src={product.imageSrc}
                    alt={product.productName}
                    fill
                    sizes="80px"
                    className={styles.thumb}
                  />
                </div>
                <span className={styles.productLabel}>
                  No. {product.id} {product.productName}
                </span>
              </div>

              <form action={updateProductImage} className={styles.selectForm}>
                <input type="hidden" name="productId" value={product.id} />
                <select
                  name="imageSrc"
                  defaultValue={product.imageSrc}
                  className={styles.select}
                >
                  {!images.some((img) => img.url === product.imageSrc) && (
                    <option value={product.imageSrc}>
                      現在の画像: {product.imageSrc}
                    </option>
                  )}
                  {images.map((img) => (
                    <option key={img.name} value={img.url}>
                      {img.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className={styles.button}>
                  画像を更新
                </button>
              </form>

              <form
                action={updateProductDetails}
                className={styles.detailsForm}
              >
                <input type="hidden" name="productId" value={product.id} />
                <label className={styles.field}>
                  <span>商品名</span>
                  <input
                    type="text"
                    name="productName"
                    defaultValue={product.productName}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>種類</span>
                  <input
                    type="text"
                    name="productType"
                    defaultValue={product.productType}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>カラー</span>
                  <input
                    type="text"
                    name="productColor"
                    defaultValue={product.productColor}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>価格（円）</span>
                  <input
                    type="number"
                    name="productPrice"
                    defaultValue={product.productPrice}
                    min={0}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>在庫数</span>
                  <input
                    type="number"
                    name="stockQuantity"
                    defaultValue={product.stockQuantity}
                    min={0}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>一覧用の短い説明</span>
                  <textarea
                    name="productDescription"
                    defaultValue={product.productDescription}
                    rows={2}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>商品詳細ページの説明文</span>
                  <textarea
                    name="detailDescription"
                    defaultValue={product.detailDescription}
                    rows={4}
                  />
                </label>
                <button type="submit" className={styles.button}>
                  保存
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
