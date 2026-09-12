import { asc } from "drizzle-orm";
import { db } from "@/src/lib/db/client";
import { products, themes, type Product } from "@/src/lib/db/schema";
import ExpandableGrid from "./ExpandableGrid";
import styles from "./ThemedShopGrid.module.css";

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
    return <ExpandableGrid items={allProducts} />;
  }

  return (
    <div className={styles.wrapper}>
      {sections.map(({ theme, items }) => (
        <section key={theme.id} className={styles.section}>
          <h2 className={styles.themeTitle}>{theme.name}</h2>
          <ExpandableGrid items={items} />
        </section>
      ))}

      {untagged.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.themeTitle}>その他の商品</h2>
          <ExpandableGrid items={untagged} />
        </section>
      )}
    </div>
  );
}
