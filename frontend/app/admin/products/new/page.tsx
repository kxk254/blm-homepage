import Link from "next/link";
import { apiFetch } from "@/src/lib/api/client";
import type { ProductCategory, Theme } from "@/src/lib/api/types";
import { createProduct } from "../actions";
import styles from "../[id]/page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const [categories, themeList] = await Promise.all([
    apiFetch<ProductCategory[]>("/api/admin/products/categories"),
    apiFetch<Theme[]>("/api/themes"),
  ]);

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>新しい商品を追加</h1>
      </div>

      <Link href="/admin/products" className={styles.backLink}>
        ← 商品一覧へ戻る
      </Link>

      <p className={styles.hint}>
        商品番号は「年月-カテゴリ-連番」の形式で自動採番されます（例:
        2609-E-001）。入力の必要はありません。
      </p>

      <form
        action={createProduct}
        className={styles.detailsForm}
        encType="multipart/form-data"
      >
        <label className={styles.field}>
          <span>カテゴリ</span>
          <select name="categoryCode" required defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.label}（{category.code}）
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>商品名</span>
          <input type="text" name="productName" required />
        </label>
        <label className={styles.field}>
          <span>種類</span>
          <input type="text" name="productType" required />
        </label>
        <label className={styles.field}>
          <span>カラー</span>
          <input type="text" name="productColor" required />
        </label>
        <label className={styles.field}>
          <span>価格（円）</span>
          <input type="number" name="productPrice" min={0} required />
        </label>
        <label className={styles.field}>
          <span>在庫数</span>
          <input type="number" name="stockQuantity" min={0} defaultValue={0} required />
        </label>
        <label className={styles.field}>
          <span>テーマ</span>
          <select name="themeId" defaultValue="">
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
          <textarea name="productDescription" rows={2} required />
        </label>
        <label className={styles.field}>
          <span>商品詳細ページの説明文</span>
          <textarea name="detailDescription" rows={6} />
        </label>
        <label className={styles.field}>
          <span>ストーリー（任意）</span>
          <textarea name="story" rows={4} />
        </label>
        <label className={styles.field}>
          <span>サイズ（任意）</span>
          <textarea name="sizeInfo" rows={2} />
        </label>
        <label className={styles.field}>
          <span>素材（任意）</span>
          <textarea name="materialInfo" rows={2} />
        </label>
        <label className={styles.field}>
          <span>お手入れ方法（任意）</span>
          <textarea name="careInfo" rows={3} />
        </label>
        <label className={styles.field}>
          <span>片方を無くした場合の対応（任意）</span>
          <textarea name="lostItemNote" rows={3} />
        </label>
        <label className={styles.field}>
          <span>画像（1〜8枚、必須）</span>
          <input type="file" name="files" accept="image/*" multiple required />
        </label>
        <button type="submit" className={styles.button}>
          追加する
        </button>
      </form>
    </div>
  );
}
