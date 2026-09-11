import Image from "next/image";
import Link from "next/link";
import styles from "./ItemCard.module.css";

import { CardProps } from "@/data/types";

export default function ItemCard({
  productType,
  productColor,
  productName,
  productDescription,
  productPrice,
  imageSrc,
  link,
}: CardProps) {
  const formattedPrice = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(productPrice);
  return (
    <div className={styles.itemCard}>
      <Link href={link} className={styles.itemImage}>
        <Image
          src={imageSrc}
          alt={productName}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className={styles.image}
        />
      </Link>
      <p className={styles.itemDescription}>{productDescription}</p>
      <div className={styles.itemName}>
        {productName}
        <br />
        {productType}({productColor})
      </div>
      <div className={styles.itemPrice}>{formattedPrice}</div>
    </div>
  );
}
