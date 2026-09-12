"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/src/lib/cart/CartContext";
import styles from "./page.module.css";

interface StockStatus {
  productPrice: number;
  stockQuantity: number;
}

export default function CartPage() {
  const { items, subtotal, updateQuantityBy, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null = 未取得（判定を保留し、+ボタン等をロックしない）
  const [stockById, setStockById] = useState<Map<string, StockStatus> | null>(
    null
  );

  const itemIdsKey = items.map((item) => item.id).join(",");

  useEffect(() => {
    if (items.length === 0) {
      setStockById(new Map());
      return;
    }
    let cancelled = false;
    fetch("/api/products/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: items.map((item) => item.id) }),
    })
      .then((res) => res.json())
      .then(
        (data: {
          items?: { id: string; productPrice: number; stockQuantity: number }[];
        }) => {
          if (cancelled) return;
          const map = new Map<string, StockStatus>();
          for (const row of data.items ?? []) {
            map.set(row.id, {
              productPrice: row.productPrice,
              stockQuantity: row.stockQuantity,
            });
          }
          setStockById(map);
        }
      )
      .catch(() => {
        // 取得に失敗しても決済時にサーバー側で最終チェックされるため致命的ではない
        if (!cancelled) setStockById(new Map());
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdsKey]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const hasBlockingIssue =
    stockById !== null &&
    items.some((item) => {
      const status = stockById.get(item.id);
      return (
        !status || status.stockQuantity <= 0 || status.stockQuantity < item.quantity
      );
    });

  const handleCheckout = async () => {
    if (items.length === 0 || hasBlockingIssue) return;
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
        {items.map((item) => {
          const status = stockById?.get(item.id);
          const isDiscontinued = stockById !== null && !status;
          const isSoldOut = status ? status.stockQuantity <= 0 : false;
          const exceedsStock = status
            ? status.stockQuantity < item.quantity
            : false;
          const atMax = status ? item.quantity >= status.stockQuantity : false;

          return (
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

                {isDiscontinued && (
                  <p className={styles.stockWarning}>
                    この商品は現在お取り扱いがございません。お手数ですが削除をお願いいたします。
                  </p>
                )}
                {!isDiscontinued && isSoldOut && (
                  <p className={styles.stockWarning}>SOLD OUT（在庫切れ）</p>
                )}
                {!isDiscontinued && !isSoldOut && exceedsStock && (
                  <p className={styles.stockWarning}>
                    在庫はあと{status?.stockQuantity}点です。数量を調整してください。
                  </p>
                )}

                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    onClick={() => updateQuantityBy(item.id, -1)}
                    aria-label="数量を減らす"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantityBy(item.id, 1)}
                    aria-label="数量を増やす"
                    disabled={atMax || isSoldOut || isDiscontinued}
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
          );
        })}
      </ul>

      <div className={styles.summary}>
        <div className={styles.subtotalRow}>
          <span>小計</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className={styles.shippingNote}>
          送料は決済画面にてご確認いただけます。
        </p>
        {hasBlockingIssue && (
          <p className={styles.errorMessage}>
            在庫の都合により、一部の商品にご対応が必要です。上記の案内をご確認ください。
          </p>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={handleCheckout}
          disabled={isCheckingOut || hasBlockingIssue}
        >
          {isCheckingOut ? "処理中・・・" : "レジに進む"}
        </button>
      </div>
    </div>
  );
}
