{
  /* import { cards } from "@/data/ItemCard"; */
}
import styles from "./HomeCard.module.css";
import ItemCard from "@/src/components/ui/ItemCard";

async function getCards() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/home`, {
    cache: "no-store",
  });
  const cards = await res.json();
  return cards.slice(0, 3);
}

export default async function HomeCard() {
  const cards = await getCards();
  console.log("---imageSrc---", cards[0].image_src);
  return (
    <div className={styles.itemGrid}>
      {cards.map((product) => (
        <ItemCard
          key={product.id}
          id={product.id}
          productType={product.product_type}
          productColor={product.product_color}
          productName={product.product_name}
          productDescription={product.product_description}
          productPrice={product.product_price}
          imageSrc={product.image_src}
          link={product.link}
        />
      ))}
    </div>
  );
}
