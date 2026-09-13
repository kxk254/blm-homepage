import { apiFetch } from "@/src/lib/api/client";
import type { Product } from "@/src/lib/api/types";
import styles from "./HomeCard.module.css";
import ItemCard from "@/src/components/ui/ItemCard";

export default async function HomeCard() {
  const items = await apiFetch<Product[]>("/api/products");

  return (
    <div className={styles.itemGrid}>
      {items.map((product) => (
        <ItemCard
          key={product.id}
          id={product.id}
          productType={product.productType}
          productColor={product.productColor}
          productName={product.productName}
          productDescription={product.productDescription}
          productPrice={product.productPrice}
          imageSrc={product.imageSrc}
          stockQuantity={product.stockQuantity}
        />
      ))}
    </div>
  );
}
