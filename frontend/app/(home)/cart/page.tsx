"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/src/lib/cart/CartContext";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "決済ページの作成に失敗しました");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "決済ページの作成に失敗しました"
      );
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.content}>
        <span className={styles.eyebrow}>Cart</span>
        <p className={styles.emptyMessage}>カートに商品がありません。</p>
        <Link href="/" className={styles.backLink}>
          商品一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>Cart</span>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <div className={styles.rowImage}>
              <Image
                src={item.imageSrc}
                alt={item.productName}
                fill
                sizes="120px"
              />
            </div>
            <div className={styles.rowDetails}>
              <p className={styles.rowName}>{item.productName}</p>
              <p className={styles.rowMeta}>
                {item.productType}（{item.productColor}）
              </p>
              <p className={styles.rowPrice}>
                {formatPrice(item.productPrice)}
              </p>
              <div className={styles.quantityControl}>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  aria-label="数量を減らす"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  aria-label="数量を増やす"
                >
                  ＋
                </button>
              </div>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeItem(item.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <div className={styles.subtotalRow}>
          <span>小計</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className={styles.shippingNote}>
          送料は決済画面にてご確認いただけます。
        </p>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? "処理中・・・" : "レジに進む"}
        </button>
      </div>
    </div>
  );
}
