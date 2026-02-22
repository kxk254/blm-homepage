import { cards } from "@/data/ItemCard";
import styles from "./HomeCard.module.css";
import ItemCard from "@/src/components/ui/ItemCard";

export default function HomeCard() {
  return (
    <div className={styles.itemGrid}>
      {cards.map((product) => (
        <ItemCard
          key={product.id}
          id={product.id}
          productType={product.productType}
          productColor={product.productColor}
          productName={product.productName}
          productDescription={product.productDescription}
          productPrice={product.productPrice}
          imageSrc={product.imageSrc}
          link={product.link}
        />
      ))}
    </div>
  );
}
