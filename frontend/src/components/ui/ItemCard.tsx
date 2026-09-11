"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ItemCard.module.css";

import { CardProps } from "@/data/types";
import { useCart } from "@/src/lib/cart/CartContext";

export default function ItemCard({
  id,
  productType,
  productColor,
  productName,
  productDescription,
  productPrice,
  imageSrc,
}: CardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(productPrice);

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
    <div className={styles.itemCard}>
      <div className={styles.itemImage}>
        <Image
          src={imageSrc}
          alt={productName}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className={styles.image}
        />
      </div>
      <span className={styles.itemNumber}>No. {id}</span>
      <p className={styles.itemDescription}>{productDescription}</p>
      <div className={styles.itemName}>
        {productName}
        <br />
        {productType}({productColor})
      </div>
      <div className={styles.itemPrice}>{formattedPrice}</div>
      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddToCart}
      >
        {added ? "カートに追加しました" : "カートに入れる"}
      </button>
    </div>
  );
}
