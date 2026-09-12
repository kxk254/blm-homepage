import Image from "next/image";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { PRODUCT_IMAGES_BUCKET } from "@/src/lib/supabase/storage";
import { signOutAdmin, updateProductImage, uploadProductImage } from "./actions";
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
        <h1 className={styles.heading}>商品画像管理</h1>
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
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>商品ごとの画像を選択</h2>
        <ul className={styles.productList}>
          {items.map((product) => (
            <li key={product.id} className={styles.productRow}>
              <div className={styles.thumbWrap}>
                <Image
                  src={product.imageSrc}
                  alt={product.productName}
                  fill
                  sizes="80px"
                  className={styles.thumb}
                />
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productLabel}>
                  No. {product.id} {product.productName}
                </span>
                <form
                  action={updateProductImage}
                  className={styles.selectForm}
                >
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
                    更新
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
