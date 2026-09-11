"use client";

import { useState } from "react";
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
  const { addItem } = useCart();
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
    <button
      type="button"
      className={styles.addButton}
      onClick={handleAddToCart}
      disabled={isSoldOut}
    >
      {isSoldOut ? "SOLD OUT" : added ? "カートに追加しました" : "カートに入れる"}
    </button>
  );
}
