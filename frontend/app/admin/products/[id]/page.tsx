import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { MediaImage, Product, Theme } from "@/src/lib/api/types";
import ProductImagePicker from "@/src/components/admin/ProductImagePicker";
import { updateProductDetails } from "../actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  let product: Product;
  try {
    product = await apiFetch<Product>(`/api/admin/products/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const [themeList, images] = await Promise.all([
    apiFetch<Theme[]>("/api/themes"),
    apiFetch<MediaImage[]>(`/api/admin/products/${id}/media`),
  ]);

  return (
    <div className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>商品編集: No. {product.id}</h1>
      </div>

      <Link href="/admin/products" className={styles.backLink}>
        ← 商品一覧へ戻る
      </Link>

      {saved === "1" && (
        <p role="status" className={styles.savedBanner}>
          保存しました
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          <ProductImagePicker
            productId={product.id}
            availableImages={images}
            initialSelected={product.imageSrcs}
          />
        </div>

        {/* input/select/textareaはdefaultValue(非制御)のため、保存後にサーバー側で
            revalidateされても値が自動で追従しない。keyを内容依存にして保存の度に
            フォームごと再マウントさせ、常に最新の保存値が表示されるようにする */}
        <form
          key={JSON.stringify(product)}
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
          <label className={styles.field}>
            <span>ストーリー（任意）</span>
            <textarea name="story" defaultValue={product.story} rows={4} />
          </label>
          <label className={styles.field}>
            <span>サイズ（任意）</span>
            <textarea name="sizeInfo" defaultValue={product.sizeInfo} rows={2} />
          </label>
          <label className={styles.field}>
            <span>素材（任意）</span>
            <textarea
              name="materialInfo"
              defaultValue={product.materialInfo}
              rows={2}
            />
          </label>
          <label className={styles.field}>
            <span>お手入れ方法（任意）</span>
            <textarea name="careInfo" defaultValue={product.careInfo} rows={3} />
          </label>
          <label className={styles.field}>
            <span>片方を無くした場合の対応（任意）</span>
            <textarea
              name="lostItemNote"
              defaultValue={product.lostItemNote}
              rows={3}
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
