"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ItemCard.module.css";
import { CardProps } from "@/data/types";
import { useCart } from "@/src/lib/cart/CartContext";

export default function AddToCartButton({
  id,
  productType,
  productColor,
  productName,
  productDescription,
  productPrice,
  imageSrc,
  stockQuantity,
}: CardProps) {
  const { addItem, itemCount } = useCart();
  const [added, setAdded] = useState(false);
  const isSoldOut = stockQuantity <= 0;

  const handleAddToCart = () => {
    addItem({
      id,
      productType,
      productColor,
      productName,
      productDescription,
      productPrice,
      imageSrc,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={styles.addToCartRow}>
      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddToCart}
        disabled={isSoldOut}
      >
        {isSoldOut ? "SOLD OUT" : added ? "カートに追加しました" : "カートに入れる"}
      </button>
      {/* カートに入れた直後、そのままレジに進めるように導線を出す
          （追加直後だけでなく、既にカートに何か入っている間はずっと表示） */}
      {itemCount > 0 && (
        <Link href="/cart" className={styles.viewCartLink}>
          カートを見る（{itemCount}）
        </Link>
      )}
    </div>
  );
}
