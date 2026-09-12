import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/src/lib/db/client";
import { products, themes } from "@/src/lib/db/schema";
import { listBucketImages } from "@/src/lib/supabase/productImages";
import {
  signOutAdmin,
  updateProductDetails,
  updateProductImage,
} from "../actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows, themeList, images] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).limit(1),
    db.select().from(themes).orderBy(asc(themes.displayOrder)),
    listBucketImages(),
  ]);
  const product = rows[0];

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>商品編集: No. {product.id}</h1>
        <form action={signOutAdmin}>
          <button type="submit" className={styles.button}>
            ログアウト
          </button>
        </form>
      </div>

      <Link href="/admin/products" className={styles.backLink}>
        ← 商品一覧へ戻る
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          <div className={styles.thumbWrap}>
            <Image
              src={product.imageSrc}
              alt={product.productName}
              fill
              sizes="240px"
              className={styles.thumb}
            />
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
          {images.length === 0 && (
            <p className={styles.hint}>
              アップロード済みの画像がありません。
              <Link href="/admin/products">商品一覧</Link>
              ページから追加してください。
            </p>
          )}
        </div>

        <form action={updateProductDetails} className={styles.detailsForm}>
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
            <span>テーマ</span>
            <select name="themeId" defaultValue={product.themeId ?? ""}>
              <option value="">なし</option>
              {themeList.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
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
              rows={6}
            />
          </label>
          <button type="submit" className={styles.button}>
            保存
          </button>
        </form>
      </div>
    </div>
  );
}
