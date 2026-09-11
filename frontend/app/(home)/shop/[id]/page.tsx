import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import AddToCartButton from "@/src/components/ui/AddToCartButton";

// 在庫・商品説明はDB管理のため常に最新を出す(ISRだとクライアント側ルーターキャッシュが
// 数分効いてしまい、在庫・商品説明の編集がすぐ反映されない)
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.productPrice);

  const isSoldOut = product.stockQuantity <= 0;

  return (
    <div className={styles.content}>
      <Link href="/shop" className={styles.backLink}>
        商品一覧へ戻る
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          <Image
            src={product.imageSrc}
            alt={product.productName}
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <span className={styles.itemNumber}>No. {product.id}</span>
          <h1 className={styles.itemName}>{product.productName}</h1>
          <p className={styles.itemMeta}>
            {product.productType}（{product.productColor}）
          </p>
          <p className={styles.itemPrice}>{formattedPrice}</p>
          <p
            className={
              isSoldOut ? styles.stockSoldOut : styles.stockAvailable
            }
          >
            {isSoldOut
              ? "SOLD OUT（在庫切れ）"
              : `残り ${product.stockQuantity} 点`}
          </p>
          <p className={styles.itemDescription}>
            {product.productDescription}
          </p>

          <AddToCartButton
            id={product.id}
            productType={product.productType}
            productColor={product.productColor}
            productName={product.productName}
            productDescription={product.productDescription}
            productPrice={product.productPrice}
            imageSrc={product.imageSrc}
            stockQuantity={product.stockQuantity}
          />

          <section className={styles.detailSection}>
            <h2 className={styles.detailHeading}>商品について</h2>
            <p className={styles.detailText}>
              {product.detailDescription || "商品説明は準備中です。"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
