import { asc } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { products, themes, type Product } from "@/src/lib/db/schema";
import ItemCard from "@/src/components/ui/ItemCard";
import gridStyles from "./HomeCard.module.css";
import styles from "./ThemedShopGrid.module.css";

function renderGrid(items: Product[]) {
  return (
    <div className={gridStyles.itemGrid}>
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

export default async function ThemedShopGrid() {
  const [allProducts, allThemes] = await Promise.all([
    db.select().from(products).orderBy(products.id),
    db.select().from(themes).orderBy(asc(themes.displayOrder)),
  ]);

  const productsByTheme = new Map<number, Product[]>();
  const untagged: Product[] = [];

  for (const product of allProducts) {
    if (product.themeId === null) {
      untagged.push(product);
      continue;
    }
    const list = productsByTheme.get(product.themeId);
    if (list) {
      list.push(product);
    } else {
      productsByTheme.set(product.themeId, [product]);
    }
  }

  const sections = allThemes
    .map((theme) => ({ theme, items: productsByTheme.get(theme.id) ?? [] }))
    .filter((section) => section.items.length > 0);

  // テーマが一つも無い場合は従来通りフラットな一覧として表示する
  if (sections.length === 0) {
    return renderGrid(allProducts);
  }

  return (
    <div className={styles.wrapper}>
      {sections.map(({ theme, items }) => (
        <section key={theme.id} className={styles.section}>
          <h2 className={styles.themeTitle}>{theme.name}</h2>
          {renderGrid(items)}
        </section>
      ))}

      {untagged.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.themeTitle}>その他の商品</h2>
          {renderGrid(untagged)}
        </section>
      )}
    </div>
  );
}
