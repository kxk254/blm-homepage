import { db } from "@/src/lib/db/client";
import { products } from "@/src/lib/db/schema";
import styles from "./HomeCard.module.css";
import ItemCard from "@/src/components/ui/ItemCard";

export default async function HomeCard() {
  const items = await db.select().from(products).orderBy(products.id);

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
        />
      ))}
    </div>
  );
}
