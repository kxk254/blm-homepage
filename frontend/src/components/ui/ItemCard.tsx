import Image from "next/image";
import Link from "next/link";
import styles from "./ItemCard.module.css";
import clsx from "clsx";

import { CardProps } from "@/data/types";

export default function ItemCard({
  id,
  productType,
  productColor,
  productName,
  productDescription,
  productPrice,
  imageSrc,
  stockQuantity,
}: CardProps) {
  const isSoldOut = stockQuantity <= 0;

  const formattedPrice = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(productPrice);

  return (
    <Link href={`/shop/${id}`} className={styles.itemCard}>
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
      <span
        className={clsx(styles.addButton, isSoldOut && styles.soldOutLabel)}
      >
        {isSoldOut ? "SOLD OUT" : "商品詳細を見る"}
      </span>
    </Link>
  );
}
