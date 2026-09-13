import { cache } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { Product } from "@/src/lib/api/types";
import AddToCartButton from "@/src/components/ui/AddToCartButton";
import ProductGallery from "@/src/components/ui/ProductGallery";
import ShareButtons from "@/src/components/ui/ShareButtons";

// 在庫・商品説明はDB管理のため常に最新を出す(ISRだとクライアント側ルーターキャッシュが
// 数分効いてしまい、在庫・商品説明の編集がすぐ反映されない)
export const dynamic = "force-dynamic";

// generateMetadataとページ本体の両方から呼ばれるため、
// 同一リクエスト内でのバックエンド二重取得を避けるためcache()でメモ化する
const getProduct = cache(async (id: string): Promise<Product | null> => {
  try {
    return await apiFetch<Product>(`/api/products/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "商品が見つかりません | Blue Millefeuille" };
  }

  const title = `${product.productName} | Blue Millefeuille`;
  const description = product.productDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://blmf.jp/shop/${product.id}`,
      images: product.imageSrcs.map((src) => ({ url: src })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.imageSrcs,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

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

  // NAS由来の画像は/media配下の相対パス、ローカルの/asset配下も相対パスなので、
  // JSON-LD用に絶対URLへ揃える(next/imageのMetadata APIとは異なりmetadataBaseは効かない)
  const toAbsoluteUrl = (src: string) =>
    src.startsWith("http") ? src : `https://blmf.jp${src}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.productDescription,
    sku: product.id,
    image: product.imageSrcs.map(toAbsoluteUrl),
    offers: {
      "@type": "Offer",
      url: `https://blmf.jp/shop/${product.id}`,
      priceCurrency: "JPY",
      price: product.productPrice,
      availability: isSoldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className={styles.content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Link href="/shop" className={styles.backLink}>
        商品一覧へ戻る
      </Link>

      <div className={styles.layout}>
        <ProductGallery images={product.imageSrcs} alt={product.productName} />

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

          <ShareButtons
            url={`https://blmf.jp/shop/${product.id}`}
            title={product.productName}
          />

          <section className={styles.detailSection}>
            <h2 className={styles.detailHeading}>商品について</h2>
            <p className={styles.detailText}>
              {product.detailDescription || "商品説明は準備中です。"}
            </p>
          </section>

          {product.story && (
            <section className={styles.detailSection}>
              <h2 className={styles.detailHeading}>ストーリー</h2>
              <p className={styles.detailText}>{product.story}</p>
            </section>
          )}

          {(product.sizeInfo || product.materialInfo) && (
            <section className={styles.detailSection}>
              <h2 className={styles.detailHeading}>商品情報</h2>
              <dl className={styles.specList}>
                {product.sizeInfo && (
                  <>
                    <dt>サイズ</dt>
                    <dd>{product.sizeInfo}</dd>
                  </>
                )}
                {product.materialInfo && (
                  <>
                    <dt>素材</dt>
                    <dd>{product.materialInfo}</dd>
                  </>
                )}
              </dl>
            </section>
          )}

          {product.careInfo && (
            <section className={styles.detailSection}>
              <h2 className={styles.detailHeading}>お手入れ方法</h2>
              <p className={styles.detailText}>{product.careInfo}</p>
            </section>
          )}

          {product.lostItemNote && (
            <section className={styles.detailSection}>
              <h2 className={styles.detailHeading}>片方を無くされた場合</h2>
              <p className={styles.detailText}>{product.lostItemNote}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
