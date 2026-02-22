import Image from "next/image";
import Link from "next/link";
import styles from "./ItemCard.module.css";

import { CardProps } from "@/data/types";

export default function ItemCard({
  id,
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
      <div className={styles.itemImage}>
        <Link href={link}>
          <Image
            src={imageSrc}
            alt={id}
            width={200}
            height={200}
            className={styles.image}
          />
        </Link>
        <p>{productDescription}</p>
      </div>
      <div className={styles.itemName}>
        {productName}
        <br />
        {productType}({productColor})
      </div>
      <div className={styles.itemPrice}>{formattedPrice}</div>
    </div>
  );
}
