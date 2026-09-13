"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/lib/cart/CartContext";
import accountStyles from "@/app/(home)/account/account.module.css";
import styles from "./AccountCartSummary.module.css";

// カートはlocalStorage(ブラウザ単位)で管理しているため、マイページに出す場合も
// サーバーではなくクライアント側でuseCart()から読む必要がある
export default function AccountCartSummary() {
  const { items, subtotal } = useCart();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className={accountStyles.orderSection}>
      <h2 className={accountStyles.orderHeading}>現在のカート</h2>
      {items.length === 0 ? (
        <p className={accountStyles.noOrders}>カートに商品はありません。</p>
      ) : (
        <>
          <ul className={styles.itemList}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.imageWrap}>
                  {/* 商品を間違えないよう、名前だけでなく写真も出す */}
                  <Image
                    src={item.imageSrc}
                    alt={item.productName}
                    fill
                    sizes="56px"
                    className={styles.image}
                  />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.productName}</p>
                  <p className={styles.itemMeta}>
                    × {item.quantity}（{formatPrice(item.productPrice)}）
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.subtotalRow}>
            <span>小計</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link href="/cart" className={accountStyles.switchLink}>
            カートを見る・レジに進む
          </Link>
        </>
      )}
    </section>
  );
}
